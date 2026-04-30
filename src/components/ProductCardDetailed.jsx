import React from "react";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";
import { TagIcon } from "./Icons.jsx";

/**
 * Detailed product card used in the subscription detail view.
 * Includes quantity badge, strikethrough compare-at price, discount line,
 * "Free" pill (when applicable) and an Edit action.
 */
export default function ProductCardDetailed({ product, onEdit }) {
  return (
    <div className="product-detail-card">
      <div className={`product-thumb ${product.image === "daily-bottle" ? "peach" : ""}`}>
        <span className="qty-badge">{product.quantity}</span>
        {product.image === "creatine-pouch" ? "OMNI" : "DAILY"}
      </div>

      <div className="product-info">
        <p className="product-title">{product.title}</p>
        <p className="product-meta">{product.variant}</p>

        {product.oneTime && <span className="product-onetime">One time added</span>}

        {product.discount && (
          <div className="product-discount">
            <TagIcon /> {product.discount}
          </div>
        )}

        <div className="product-price-row">
          <span className="product-price">
            ${product.price.toFixed(2)}
            {product.compareAt && (
              <span className="product-strike">${product.compareAt.toFixed(2)}</span>
            )}
          </span>
          <Button variant="primary" size="sm" onClick={onEdit}>Edit</Button>
        </div>
      </div>

      {product.free && (
        <div className="free-badge">
          <Badge kind="free">Free</Badge>
        </div>
      )}
    </div>
  );
}
