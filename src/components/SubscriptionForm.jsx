import { useState } from "react";
import { supabase } from "../supabase.js";
import PlanPicker from "./PlanPicker.jsx";
import Field from "./Field.jsx";
import CardBrandBadge from "./CardBrandBadge.jsx";
import Toast from "./Toast.jsx";

const Svg = {
  user: (
    <svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10z" /></svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24c1.12.37 2.33.57 3.54.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.21.2 2.42.57 3.54a1 1 0 01-.25 1.05l-2.2 2.2z" /></svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10z" /></svg>
  ),
  card: (
    <svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H4V6h16v12zM6 10h5v2H6z" /></svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24"><path d="M18 8h-1V6a5 5 0 00-10 0v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zM9 6a3 3 0 016 0v2H9V6zm3 12a2 2 0 110-4 2 2 0 010 4z" /></svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 5v2h2v-2h-2z" /></svg>
  ),
  comment: (
    <svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" /></svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2c1.85 0 3.55.63 4.9 1.69L12 10.58 7.1 5.69A7.96 7.96 0 0112 4zm-8 8c0-1.85.63-3.55 1.69-4.9L10.58 12l-4.89 4.9A7.96 7.96 0 014 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L12 13.42l4.9 4.89A7.96 7.96 0 0112 20zm6.31-3.1L13.42 12l4.89-4.9A7.96 7.96 0 0120 12c0 1.85-.63 3.55-1.69 4.9z" /></svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 16.8 5.7 21.4 8 14 2 9.4h7.6z" /></svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6a6 6 0 110 12 6 6 0 01-6-6H4a8 8 0 108-8z" /></svg>
  )
};

// ---------- Helpers ----------
function luhn(num) {
  const d = num.replace(/\s/g, "");
  let sum = 0, alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = parseInt(d[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function detectBrand(num) {
  const n = num.replace(/\s/g, "");
  if (!n) return "unknown";
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return "unknown";
}

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  country: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state_region: "",
  postal_code: "",
  emergency_name: "",
  emergency_phone: "",
  billing_cycle: "monthly",
  start_date: "",
  promo_code: "",
  cardholder_name: "",
  card_number: "",
  card_expiry: "",
  card_cvc: "",
  billing_zip: "",
  referral_source: "",
  notes: ""
};

export default function SubscriptionForm() {
  const [form, setForm] = useState(initialForm);
  const [plan, setPlan] = useState("basic");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(true);
  const [termsError, setTermsError] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", title: "", message: "" });

  const set = (k) => (e) => {
    const v = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const cardBrand = detectBrand(form.card_number);

  const handleCardNumber = (e) => {
    const raw = e.target.value.replace(/\s/g, "").replace(/\D/g, "").slice(0, 19);
    const spaced = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setForm((f) => ({ ...f, card_number: spaced }));
    setErrors((p) => ({ ...p, card_number: undefined }));
  };

  const handleExpiry = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = v.length >= 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
    setForm((f) => ({ ...f, card_expiry: formatted }));
    setErrors((p) => ({ ...p, card_expiry: undefined }));
  };

  const handleCvc = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    setForm((f) => ({ ...f, card_cvc: v }));
    setErrors((p) => ({ ...p, card_cvc: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.full_name.trim().length < 2) e.full_name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (form.cardholder_name.trim().length < 2) e.cardholder_name = "Enter the name on the card.";

    const rawCard = form.card_number.replace(/\s/g, "");
    const cardValid = rawCard.length >= 13 && rawCard.length <= 19 && /^\d+$/.test(rawCard) && luhn(rawCard);
    if (!cardValid) e.card_number = "Please enter a valid card number.";

    const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    let expValid = expRegex.test(form.card_expiry);
    if (expValid) {
      const [m, y] = form.card_expiry.split("/").map(Number);
      const now = new Date();
      const curY = now.getFullYear() % 100;
      const curM = now.getMonth() + 1;
      if (y < curY || (y === curY && m < curM)) expValid = false;
    }
    if (!expValid) e.card_expiry = "Use MM/YY format.";

    if (!/^\d{3,4}$/.test(form.card_cvc)) e.card_cvc = "3 or 4 digits.";

    setErrors(e);
    if (!terms) setTermsError(true); else setTermsError(false);
    return Object.keys(e).length === 0 && terms;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      const firstErr = document.querySelector(".field.error");
      if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);

    const payload = {
      ...form,
      plan,
      email: form.email.trim().toLowerCase(),
      card_number: form.card_number.replace(/\s/g, ""),
      card_brand: cardBrand
    };

    // Convert empty strings to null so Postgres doesn't reject date columns
    Object.keys(payload).forEach((k) => {
      if (payload[k] === "") payload[k] = null;
    });

    try {
      const { error } = await supabase.from("subscriptions").insert([payload]).select().single();
      if (error) throw error;

      setToast({
        open: true,
        type: "success",
        title: "Welcome to Demo Gym",
        message: `${payload.full_name.split(" ")[0]}, your ${plan} plan is confirmed. Confirmation sent to ${payload.email}.`
      });

      setForm(initialForm);
      setPlan("basic");
      setTerms(true);
      setErrors({});
    } catch (err) {
      console.error("[Demo Gym] insert error:", err);
      setToast({
        open: true,
        type: "error",
        title: "Something went wrong",
        message: err?.message || "Please try again in a moment."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={submit} noValidate>
        {/* PERSONAL */}
        <fieldset>
          <div className="section-title">
            {Svg.user}
            Personal Details
          </div>
          <div className="grid">
            <Field label="Full name *" icon={Svg.user} error={errors.full_name} className="col-6">
              <input
                type="text"
                value={form.full_name}
                onChange={set("full_name")}
                placeholder="Smith Luson"
                autoComplete="name"
              />
            </Field>
            <Field label="Email *" icon={Svg.mail} error={errors.email} className="col-6">
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="smith.luson@example.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Phone" icon={Svg.phone} className="col-6">
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+1 555 123 4567"
                autoComplete="tel"
              />
            </Field>
            <Field label="Date of birth" icon={Svg.calendar} className="col-6">
              <input
                type="date"
                value={form.date_of_birth}
                onChange={set("date_of_birth")}
              />
            </Field>
            <Field label="Gender" icon={Svg.user} className="col-4">
              <select value={form.gender} onChange={set("gender")}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Country" icon={Svg.globe} className="col-4">
              <select value={form.country} onChange={set("country")}>
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="NG">Nigeria</option>
                <option value="ZA">South Africa</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
        </fieldset>

        {/* ADDRESS */}
        <fieldset>
          <div className="section-title">
            {Svg.pin}
            Address
          </div>
          <div className="grid">
            <Field label="Address line 1" className="col-8">
              <input
                type="text"
                value={form.address_line1}
                onChange={set("address_line1")}
                placeholder="123 Main Street"
                autoComplete="address-line1"
              />
            </Field>
            <Field label="Address line 2" className="col-4">
              <input
                type="text"
                value={form.address_line2}
                onChange={set("address_line2")}
                placeholder="Apt, suite..."
                autoComplete="address-line2"
              />
            </Field>
            <Field label="City" className="col-4">
              <input
                type="text"
                value={form.city}
                onChange={set("city")}
                placeholder="Lagos"
                autoComplete="address-level2"
              />
            </Field>
            <Field label="State / Region" className="col-4">
              <input
                type="text"
                value={form.state_region}
                onChange={set("state_region")}
                placeholder="Lagos"
                autoComplete="address-level1"
              />
            </Field>
            <Field label="Postal code" className="col-4">
              <input
                type="text"
                value={form.postal_code}
                onChange={set("postal_code")}
                placeholder="100001"
                autoComplete="postal-code"
              />
            </Field>
          </div>
        </fieldset>

        {/* EMERGENCY */}
        <fieldset>
          <div className="section-title">
            {Svg.alert}
            Emergency Contact
          </div>
          <div className="grid">
            <Field label="Contact name" className="col-6">
              <input
                type="text"
                value={form.emergency_name}
                onChange={set("emergency_name")}
                placeholder="Jane Luson"
              />
            </Field>
            <Field label="Contact phone" className="col-6">
              <input
                type="tel"
                value={form.emergency_phone}
                onChange={set("emergency_phone")}
                placeholder="+1 555 987 6543"
              />
            </Field>
          </div>
        </fieldset>

        {/* PLAN */}
        <fieldset>
          <div className="section-title">
            {Svg.spark}
            Choose Your Plan
          </div>
          <PlanPicker value={plan} onChange={setPlan} />
          <div className="grid" style={{ marginTop: "1rem" }}>
            <Field label="Billing cycle" icon={Svg.refresh} className="col-4">
              <select value={form.billing_cycle} onChange={set("billing_cycle")}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </Field>
            <Field label="Start date" className="col-4">
              <input type="date" value={form.start_date} onChange={set("start_date")} />
            </Field>
            <Field label="Promo code" className="col-4">
              <input
                type="text"
                value={form.promo_code}
                onChange={set("promo_code")}
                placeholder="DEMO10"
              />
            </Field>
          </div>
        </fieldset>

        {/* PAYMENT */}
        <fieldset>
          <div className="section-title">
            {Svg.card}
            Payment Details
          </div>
          <div className="grid">
            <Field label="Cardholder name *" icon={Svg.user} error={errors.cardholder_name} className="col-12">
              <input
                type="text"
                value={form.cardholder_name}
                onChange={set("cardholder_name")}
                placeholder="SMITH LUSON"
                autoComplete="cc-name"
              />
            </Field>

            <Field label="Card number *" icon={Svg.card} error={errors.card_number} className="col-12">
              <div className="card-wrap">
                <input
                  type="text"
                  value={form.card_number}
                  onChange={handleCardNumber}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  maxLength={23}
                />
                <CardBrandBadge brand={cardBrand} />
              </div>
            </Field>

            <Field label="Expiry *" icon={Svg.calendar} error={errors.card_expiry} className="col-4">
              <input
                type="text"
                value={form.card_expiry}
                onChange={handleExpiry}
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
                maxLength={5}
              />
            </Field>
            <Field label="CVC *" icon={Svg.lock} error={errors.card_cvc} className="col-4">
              <input
                type="text"
                value={form.card_cvc}
                onChange={handleCvc}
                placeholder="123"
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
              />
            </Field>
            <Field label="Billing ZIP" className="col-4">
              <input
                type="text"
                value={form.billing_zip}
                onChange={set("billing_zip")}
                placeholder="100001"
                autoComplete="postal-code"
              />
            </Field>
          </div>
        </fieldset>

        {/* EXTRA */}
        <fieldset>
          <div className="section-title">
            {Svg.comment}
            A Little More
          </div>
          <div className="grid">
            <Field label="How did you hear about us?" className="col-6">
              <select value={form.referral_source} onChange={set("referral_source")}>
                <option value="">Select...</option>
                <option value="friend">Friend / Family</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="google">Google Search</option>
                <option value="walkin">Walked in</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Goals or notes" className="col-6">
              <input
                type="text"
                value={form.notes}
                onChange={set("notes")}
                placeholder="e.g. Build muscle, lose weight..."
              />
            </Field>
          </div>
        </fieldset>

        {/* TERMS + SUBMIT */}
        <div className="terms">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={terms}
            onChange={(e) => {
              setTerms(e.target.checked);
              if (e.target.checked) setTermsError(false);
            }}
          />
          <label htmlFor="agreeTerms">
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>, and I confirm the information above is accurate. My membership will auto-renew and I can cancel anytime.
          </label>
        </div>
        {termsError && <div className="terms-error show">You must agree to the terms to continue.</div>}

        <div className="submit-row">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Complete Subscription</span>
                <svg viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                </svg>
              </>
            )}
          </button>
          <span className="secure-note">
            <svg viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            Saved to your Demo Gym profile
          </span>
        </div>
      </form>

      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </>
  );
}