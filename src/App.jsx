import Sidebar from "./components/Sidebar.jsx";
import SubscriptionForm from "./components/SubscriptionForm.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <header className="main-header">
          <div className="eyebrow">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 16.8 5.7 21.4 8 14 2 9.4h7.6z" />
            </svg>
            Membership Subscription
          </div>
          <h2>Create your account</h2>
          <p>Fill in your details below. Everything is saved to your Demo Gym member profile.</p>
        </header>
        <SubscriptionForm />
      </main>
    </div>
  );
}