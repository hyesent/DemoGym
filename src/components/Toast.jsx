import { useEffect } from "react";

export default function Toast({ open, type, title, message, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [open, onClose]);

  const isError = type === "error";

  return (
    <div className={`toast ${open ? "show" : ""} ${isError ? "error" : "success"}`}>
      <div className="t-icon">
        {isError ? (
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        )}
      </div>
      <div>
        <div className="t-title">{title}</div>
        <div className="t-msg">{message}</div>
      </div>
    </div>
  );
}