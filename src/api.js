/* =====================================================
   API HELPERS
   - one place for the backend URL
   - caches GET responses so switching pages does not
     download the same data again
   - longer timeout because Render's free tier "sleeps"
     and can take up to a minute to wake up
===================================================== */

import { useEffect, useState } from "react";

export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const REQUEST_TIMEOUT_MS = 75000;

export async function fetchWithTimeout(
  url,
  options = {},
  timeoutMs = REQUEST_TIMEOUT_MS
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function friendlyError(error) {
  if (error?.name === "AbortError") {
    return "The ML server took too long to respond.";
  }

  if (error instanceof TypeError) {
    return "Could not reach the ML server.";
  }

  return error?.message || "Something went wrong.";
}

const cache = new Map();
const inFlight = new Map();

export function getJSON(path) {
  if (cache.has(path)) {
    return Promise.resolve(cache.get(path));
  }

  if (inFlight.has(path)) {
    return inFlight.get(path);
  }

  const request = fetchWithTimeout(`${API_URL}${path}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server returned an error (${res.status}).`);
      }
      return res.json();
    })
    .then((data) => {
      cache.set(path, data);
      return data;
    })
    .finally(() => inFlight.delete(path));

  inFlight.set(path, request);
  return request;
}

/* Load data from a GET endpoint inside a component.
   Returns { data, loading, error, retry }. */
export function useApi(path) {
  const [state, setState] = useState(() =>
    cache.has(path)
      ? { data: cache.get(path), loading: false, error: "" }
      : { data: null, loading: true, error: "" }
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getJSON(path)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: "" });
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: friendlyError(error) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path, attempt]);

  const retry = () => {
    setState({ data: null, loading: true, error: "" });
    setAttempt((value) => value + 1);
  };

  return { ...state, retry };
}

/* Checks whether the backend is awake.
   status: "checking" | "waking" | "online" | "offline" */
export function useServerStatus() {
  const [status, setStatus] = useState("checking");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    // If there is no answer within 4 s, the server is probably asleep.
    const slowTimer = setTimeout(() => {
      if (!cancelled) {
        setStatus((current) => (current === "checking" ? "waking" : current));
      }
    }, 4000);

    async function ping() {
      while (!cancelled) {
        try {
          const res = await fetchWithTimeout(`${API_URL}/health`, {}, 20000);
          if (res.ok) {
            if (!cancelled) setStatus("online");
            return;
          }
        } catch {
          // ignore and try again below
        }

        if (Date.now() - startedAt > 120000) {
          if (!cancelled) setStatus("offline");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    ping();

    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
    };
  }, [attempt]);

  const retry = () => {
    setStatus("checking");
    setAttempt((value) => value + 1);
  };

  return { status, retry };
}
