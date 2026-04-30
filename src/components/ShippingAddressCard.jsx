import React from "react";
import Button from "./Button.jsx";

export default function ShippingAddressCard({ shipping, onEdit }) {
  return (
    <div className="info-card">
      <div>
        <h3>Shipping address</h3>
        <div className="body">
          {shipping.name}<br />
          {shipping.line1}<br />
          {shipping.cityRegion}<br />
          {shipping.country}<br />
          {shipping.phone}
        </div>
      </div>
      <div className="edit-row">
        <Button variant="primary" size="sm" onClick={onEdit}>Edit</Button>
      </div>
    </div>
  );
}
