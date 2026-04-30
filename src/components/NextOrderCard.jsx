import React from "react";
import Button from "./Button.jsx";

/**
 * The "Next order: <date>" card with Order now / Gift / Skip / Delay actions.
 */
export default function NextOrderCard({
  nextOrderDate,
  onOrderNow,
  onGift,
  onSkip,
  onDelay,
}) {
  return (
    <div className="card next-order-section">
      <p className="next-title">
        <span style={{ fontWeight: 500, color: "var(--omni-text-2)" }}>Next order: </span>
        <span className="date">{nextOrderDate}</span>
      </p>
      <div className="order-actions">
        <Button variant="primary" onClick={onOrderNow}>Order now</Button>
        <Button variant="outline" onClick={onGift}>Gift</Button>
        <Button variant="outline" onClick={onSkip}>Skip order</Button>
        <Button variant="outline" onClick={onDelay}>Delay</Button>
      </div>
    </div>
  );
}
