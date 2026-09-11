export default function Field({ label, icon, error, children, className = "" }) {
  return (
    <div className={`field ${className} ${error ? "error" : ""}`}>
      {label && (
        <label>
          {icon}
          {label}
        </label>
      )}
      {children}
      <span className="err">{error}</span>
    </div>
  );
}