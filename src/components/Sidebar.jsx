export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
          </svg>
          <span className="brand-name">
            DEMO<span>GYM</span>
          </span>
        </div>

        <div className="hero">
          <h1>
            Train at the
            <em>best gym</em>
            in town.
          </h1>
          <p>Modern equipment, expert coaches, and a community that pushes you further every single day.</p>
        </div>

        <ul className="benefits">
          {[
            "24/7 access to all locations",
            "Free fitness assessment",
            "No hidden fees, cancel anytime",
            "30+ group classes weekly"
          ].map((text) => (
            <li key={text}>
              <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="price-block">
        <div className="price-label">Starting from</div>
        <div className="price-row">
          <span className="price-amount">$29</span>
          <span className="price-period">/ month</span>
        </div>
        <div className="price-sub">
          <svg viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          Cancel anytime · No commitment
        </div>
      </div>
    </aside>
  );
}