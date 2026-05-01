import React from "react";

export default function ReferFriendPage({ onOpenModal }) {
  return (
    <section className="referral-program-page" aria-label="Refer a friend">
      <div className="referral-program-head">
        <h1>Join the OMNI referral program!</h1>
        <p>
          Earn product rewards and account credit for every qualified referral.
          Share your personal link and let friends start with OMNI.
        </p>
      </div>

      <form className="referral-program-form" onSubmit={(event) => { event.preventDefault(); onOpenModal("Invite a friend"); }}>
        <label>
          <span>First Name:<sup>*</sup></span>
          <input type="text" aria-label="First name" />
        </label>
        <label>
          <span>Last Name:<sup>*</sup></span>
          <input type="text" aria-label="Last name" />
        </label>
        <label>
          <span>Email:<sup>*</sup></span>
          <input type="email" aria-label="Email" />
        </label>
        <label>
          <span>Phone:</span>
          <div className="referral-phone-field">
            <span aria-hidden="true">🇺🇸</span>
            <input type="tel" aria-label="Phone" />
          </div>
        </label>

        <button type="submit">Sign Up</button>
        <button className="referral-login-link" type="button" onClick={() => onOpenModal("Account login")}>
          Already have an account? Sign in here.
        </button>
      </form>

      <p className="referral-policy-note">
        Referral rewards are designed for personal, unpaid referrals only. Paid advertising,
        arbitrage, or misuse of referral links may make rewards ineligible.
      </p>
    </section>
  );
}
