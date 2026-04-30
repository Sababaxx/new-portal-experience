import React from "react";
import Button from "../components/Button.jsx";

export default function ReferFriendPage({ onOpenModal }) {
  return (
    <section className="portal-page-panel" aria-label="Refer a friend">
      <div className="portal-page-head">
        <h1>Refer a Friend</h1>
        <p>Share OMNI with a friend and keep rewards simple in this prototype flow.</p>
      </div>

      <div className="portal-info-card referral-hero-card">
        <div>
          <span className="mini-label">Referral perks</span>
          <h2>Give a friend a better subscription start.</h2>
          <p>
            Share your OMNI code with a friend so they can start with gummies, electrolytes, or a subscription routine.
            Rewards and invite tracking can be connected once the final referral rules are approved.
          </p>
        </div>
      </div>

      <div className="portal-info-card referral-code-card">
        <label>
          <span className="mini-label">Your code</span>
          <input value="OMNI-SABA-47" readOnly />
        </label>
        <div className="referral-actions">
          <Button variant="outline" onClick={() => onOpenModal("Copy referral code")}>Copy code</Button>
          <Button variant="primary" onClick={() => onOpenModal("Invite a friend")}>Invite a friend</Button>
        </div>
      </div>
    </section>
  );
}
