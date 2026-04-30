import React, { useState } from "react";
import ActionModal from "./ActionModal.jsx";

const creatineVariants = [
  { label: "1x / Peach", product: "OMNI Creatine Gummies", flavor: "Peach", pack: "1 pouch / 30 servings", price: 42, image: "/assets/omni-product-peach.png" },
  { label: "1x / Watermelon", product: "OMNI Creatine Gummies", flavor: "Watermelon", pack: "1 pouch / 30 servings", price: 42, image: "/assets/omni-product-watermelon.png" },
  { label: "2x / Peach", product: "Two Pouches", flavor: "Peach", pack: "2 pouches / 60 servings", price: 79, image: "/assets/omni-product-peach.png" },
  { label: "2x / Watermelon", product: "Two Pouches", flavor: "Watermelon", pack: "2 pouches / 60 servings", price: 79, image: "/assets/omni-product-watermelon.png" },
  { label: "3x / Peach", product: "Three Pouches", flavor: "Peach", pack: "3 pouches / 90 servings", price: 115, image: "/assets/omni-product-peach.png" },
  { label: "3x / Watermelon", product: "Three Pouches", flavor: "Watermelon", pack: "3 pouches / 90 servings", price: 115, image: "/assets/omni-product-watermelon.png" },
];

const recs = [
  {
    name: "Daily Creatine Gummy",
    desc: "One pouch of OMNI creatine gummies from the product export.",
    options: [
      { label: "Peach / 1x", price: 42, image: "/assets/omni-product-peach.png" },
      { label: "Watermelon / 1x", price: 42, image: "/assets/omni-product-watermelon.png" },
    ],
    tone: "peach",
  },
  {
    name: "Two Pouches",
    desc: "A 60-day gummy supply with Peach or Watermelon options.",
    options: [
      { label: "Peach / 2x", price: 79, image: "/assets/omni-product-peach.png" },
      { label: "Watermelon / 2x", price: 79, image: "/assets/omni-product-watermelon.png" },
    ],
    tone: "watermelon",
  },
  {
    name: "OMNI Electrolytes",
    desc: "Creatine and electrolyte stick packs in Pear or Peach.",
    options: [
      { label: "Pear / 1x", price: 67, image: "/assets/omni-product-electrolytes-pear.png" },
      { label: "Peach / 1x", price: 67, image: "/assets/omni-product-3x-peach.png" },
      { label: "Pear / 2x", price: 134, image: "/assets/omni-product-electrolytes-pear.png" },
      { label: "Peach / 2x", price: 134, image: "/assets/omni-product-3x-peach.png" },
    ],
    tone: "electrolytes",
  },
];

export default function ProductWorkspace({ compact = false }) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("3x / Peach");
  const [recSelections, setRecSelections] = useState(() => Object.fromEntries(recs.map((item) => [item.name, item.options[0].label])));
  const [modal, setModal] = useState(null);
  const currentProduct = creatineVariants.find((variant) => variant.label === selectedVariant) || creatineVariants[0];
  const subtotal = currentProduct.price * qty;
  const shipping = 8;
  const total = subtotal + shipping;

  return (
    <section className={`workspace-grid ${compact ? "workspace-grid-compact" : ""}`} aria-label="Subscription product workspace">
      <div className="workspace-left">
        <h2 className="workspace-title">Products</h2>
        <div className="workspace-card product-builder-card">
          <div className="current-product-row">
            <div className="workspace-product-image">
              <img src={currentProduct.image} alt={`${currentProduct.flavor} ${currentProduct.product}`} />
            </div>
            <div className="workspace-product-copy">
              <div className="workspace-product-head">
                <div>
                  <h3>{currentProduct.product}</h3>
                <p>{currentProduct.flavor} · {currentProduct.pack}</p>
                </div>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="workspace-product-actions">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty((currentQty) => Math.max(1, currentQty - 1))}>−</button>
                <span>{qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty((currentQty) => currentQty + 1)}>+</button>
                <select value={selectedVariant} onChange={(event) => setSelectedVariant(event.target.value)}>
                  {creatineVariants.map((variant) => (
                    <option key={variant.label}>{variant.label}</option>
                  ))}
                </select>
                <button className="swap-mini" type="button" onClick={() => setModal("Swap flavor")}>Swap</button>
              </div>
            </div>
          </div>

          <button type="button" className="add-product-wide" onClick={() => setModal("Add product")}>+ Add product</button>
          <p className="eligible-note">Add 1 more item to get 5% off subscription! <button type="button">See eligible items →</button></p>
        </div>

        <div className="saved-banner">You’ve saved with your subscription: <strong>$80</strong></div>

        <h2 className="workspace-title">Shipping information</h2>
        <div className="workspace-card info-workspace-card">
          <div>
            <h3>Saba Bakhtadze</h3>
            <p>595 North Main street<br />Hiawassee, Georgia 30546<br />United States</p>
          </div>
          <button type="button">Edit</button>
        </div>

        <h2 className="workspace-title">Billing</h2>
        <div className="workspace-card billing-workspace-card">
          <div className="billing-row">
            <div>
              <h3>Saba B</h3>
              <p><span className="mastercard-dot red" /><span className="mastercard-dot orange" />•••• 6047</p>
            </div>
            <div className="billing-meta"><button type="button">Edit</button><span>11/26</span></div>
          </div>
          <button type="button" className="add-product-wide">+ Add backup card</button>
        </div>

        <h2 className="workspace-title">Summary</h2>
        <div className="workspace-card summary-workspace-card">
          <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
          <div><span>Shipping</span><strong>${shipping.toFixed(2)}</strong></div>
          <label className="promo-row"><input placeholder="Enter promo code" /><button type="button">Apply</button></label>
          <div className="summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
        </div>
      </div>

      <aside className="workspace-right" aria-label="Recommended products">
        <h2 className="workspace-title">You might also like</h2>
        <div className="workspace-card rec-card-list">
          {recs.map((item) => {
            const selected = item.options.find((option) => option.label === recSelections[item.name]) || item.options[0];

            return (
            <div className="rec-product" key={item.name}>
              <div className={`rec-image ${item.tone}`}>
                {selected.image ? <img src={selected.image} alt={`${item.name} ${selected.label}`} /> : <span>{selected.tile}</span>}
              </div>
              <div className="rec-copy">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <select
                  value={recSelections[item.name]}
                  onChange={(event) => setRecSelections((plans) => ({ ...plans, [item.name]: event.target.value }))}
                >
                  {item.options.map((option) => (
                    <option key={option.label}>{option.label}</option>
                  ))}
                </select>
                <div className="rec-bottom"><strong>${selected.price.toFixed(2)}</strong><button type="button" onClick={() => setModal("Add to next order")}>Add</button></div>
              </div>
            </div>
          )})}
        </div>
      </aside>
      {modal && (
        <ActionModal title={modal} onClose={() => setModal(null)}>
          <div className="product-modal-preview">
            <img src={currentProduct.image} alt={`${currentProduct.flavor} ${currentProduct.product}`} />
            <div>
              {modal === "Swap flavor" && <p>Swap the current gummies to another OMNI flavor for the next shipment. Your selected quantity stays at {qty}.</p>}
              {modal === "Add product" && <p>Add another OMNI product to this subscription order and review savings before checkout.</p>}
              {modal === "Add to next order" && <p>Add the selected recommended OMNI product to the upcoming shipment. Pricing and flavor are confirmed before final checkout.</p>}
            </div>
          </div>
        </ActionModal>
      )}
    </section>
  );
}
