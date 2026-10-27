export default function ModuleCard({ icon, title, description, button, onClick }) {
  return (
    <div className="module-card">
      <div className="module-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onClick}>
        {button}
        <span>→</span>
      </button>
    </div>
  );
}
