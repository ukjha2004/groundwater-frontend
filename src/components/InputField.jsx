export default function InputField({ label, name, value, onChange, min, max, invalid }) {
  const hasRange = min !== undefined && max !== undefined;

  return (
    <div className={invalid ? "input-field invalid" : "input-field"}>
      <label htmlFor={name}>{label}</label>

      <input
        id={name}
        type="number"
        step="any"
        name={name}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
      />

      {hasRange && (
        <small className="input-hint">
          Range: {min} – {max}
        </small>
      )}
    </div>
  );
}
