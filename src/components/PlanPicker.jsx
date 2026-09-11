const PLANS = [
  { id: "basic", name: "Basic", price: 29, desc: "Gym access · Locker room" },
  { id: "pro",   name: "Pro",   price: 49, desc: "+ Classes · Sauna · Coach" },
  { id: "elite", name: "Elite", price: 79, desc: "All access · PT · Spa" }
];

export default function PlanPicker({ value, onChange }) {
  return (
    <div className="plans">
      {PLANS.map((p) => (
        <div className="plan" key={p.id}>
          <input
            type="radio"
            name="plan"
            id={`plan-${p.id}`}
            value={p.id}
            checked={value === p.id}
            onChange={() => onChange(p.id)}
          />
          <label htmlFor={`plan-${p.id}`}>
            <span className="plan-name">
              {p.name}
              <span className="check">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </span>
            </span>
            <span className="plan-price">
              ${p.price}
              <span>/mo</span>
            </span>
            <span className="plan-desc">{p.desc}</span>
          </label>
        </div>
      ))}
    </div>
  );
}