import React from "react";

/**
 * Compact product tile used inside the subscription summary card on the list page.
 * Shows small plain placeholder image on the left, product info on the right.
 */
export default function ProductCardCompact({ product }) {
  return (
    <div className="product-card">
      <div className={`product-thumb ${product.image === "daily-bottle" ? "peach" : ""}`}>
        {product.image === "creatine-pouch" ? "OMNI" : "DAILY"}
      </div>
      <div className="product-info">
        <p className="product-title">{product.title}</p>
        <p className="product-meta">{product.variant}</p>
        <div className="product-price-row">
          <span className="product-price">
            ${product.price.toFixed(2)} × {product.quantity}
          </span>
        </div>
        {product.oneTime && (
          <p className="product-meta" style={{ marginTop: 3 }}>One time added</p>
        )}
      </div>
    </div>
  );
}
