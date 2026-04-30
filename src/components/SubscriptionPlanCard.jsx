import React from "react";
import Button from "./Button.jsx";

export default function SubscriptionPlanCard({ plan, onEdit }) {
  return (
    <div className="info-card">
      <div>
        <h3>Subscription plan</h3>
        <div className="body">{plan.label}</div>
      </div>
      <div className="edit-row">
        <Button variant="primary" size="sm" onClick={onEdit}>Edit</Button>
      </div>
    </div>
  );
}
