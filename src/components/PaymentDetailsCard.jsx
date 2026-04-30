import React from "react";
import Button from "./Button.jsx";

export default function PaymentDetailsCard({ payment, onUpdate, onAddBackup }) {
  return (
    <div className="info-card payment-card">
      <div>
        <h3>Payment details</h3>
        <div className="body" style={{ color: "var(--omni-text)", fontWeight: 600 }}>
          {payment.method}
        </div>
        <div className="meta" style={{ marginTop: 6 }}>Expires {payment.expires}</div>
        <div className="meta">Last updated on: {payment.updatedOn}</div>
      </div>
      <div className="actions">
        <Button variant="primary" size="sm" onClick={onUpdate}>Update</Button>
        <Button variant="outline" size="sm" onClick={onAddBackup}>Add backup</Button>
      </div>
    </div>
  );
}
