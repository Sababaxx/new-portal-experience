import React from "react";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";
import ProductCardCompact from "./ProductCardCompact.jsx";
import { RefreshIcon } from "./Icons.jsx";

/**
 * Card shown on the Active Subscriptions list page.
 * Shows only the first product.
 */
export default function SubscriptionSummaryCard({ sub, onView }) {
  return (
    <div className="card">
      <div className="sub-card-top">
        <span className="sub-id">#{sub.id}</span>
        <Badge kind="active">{sub.status}</Badge>
      </div>

      <p className="next-order-line">
        <span className="next-label">Next order: </span>{sub.nextOrderDate}
      </p>

      <div className="delivery-row">
        <RefreshIcon /> {sub.frequency}
      </div>

      <div className="product-grid">
        {sub.products.slice(0, 1).map((p) => <ProductCardCompact key={p.id} product={p} />)}
      </div>

      <div className="sub-card-bottom">
        <div className="total">
          <strong>${sub.total.toFixed(2)}</strong> + ${sub.shippingPerDelivery.toFixed(2)} shipping per delivery
        </div>
        <Button variant="primary" size="sm" onClick={onView}>View details</Button>
      </div>
    </div>
  );
}
