export default function CardBrandBadge({ brand }) {
  const labelMap = { visa: "Visa", mastercard: "MC", amex: "Amex", discover: "Disc", unknown: "Card" };
  const label = labelMap[brand] || "Card";
  const cls = brand !== "unknown" ? `brand-${brand}` : "";
  return (
    <span className={`card-badge ${cls}`}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H4V6h16v12z" />
      </svg>
      <span>{label}</span>
    </span>
  );
}