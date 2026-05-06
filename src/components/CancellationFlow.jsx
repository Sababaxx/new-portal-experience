import React, { useEffect, useMemo, useState } from "react";
import Button from "./Button.jsx";
import { subscription } from "../data/subscription.js";

const SUPPORT_URL = "https://contact.gorgias.help/en-US/forms/0c4rzba9";
const FOUNDER_SUPPORT_URL = "https://contact.gorgias.help/en-US/forms/0c4rzba9"; // placeholder — wire to real founder contact URL
const SCIENCE_PAGE_URL = "#science"; // placeholder — wire to real science/why-OMNI page
const FINAL_STEP_LABEL = "Continue to cancel";

// ─── Editable offer banner mapping ──────────────────────────────────────────
// Key format: `${pouchCount}-${tier}`. Tiers: low (1–3 orders) | mid (4–5) | high (5+)
const OFFER_BANNER_MAP = {
  "1-low":  "/assets/omni-offer-1x-21.jpg",
  "1-mid":  "/assets/omni-offer-1x-27.jpg",
  "1-high": "/assets/omni-offer-1x-31.jpg",
  "2-low":  "/assets/omni-offer-2x-39.jpg",
  "2-mid":  "/assets/omni-offer-2x-51.jpg",
  "2-high": "/assets/omni-offer-2x-59.jpg",
  "3-low":  "/assets/omni-offer-3x-57.jpg",
  "3-mid":  "/assets/omni-offer-3x-74.jpg",
  "3-high": "/assets/omni-offer-3x-86.jpg",
};

// ─── Editable product swap mapping ──────────────────────────────────────────
// Gummy subscriptions (peach / watermelon) map to OMNI Electrolytes variants
const PRODUCT_SWAP_MAP = {
  peach: { id: "electrolytes-peach", title: "OMNI Electrolytes Peach", image: "/assets/omni-modal-electrolytes-peach.webp" },
  pear:  { id: "electrolytes-pear",  title: "OMNI Electrolytes Pear",  image: "/assets/omni-modal-electrolytes-pear.png" },
};

function getOrderTier(orderCount) {
  if (orderCount >= 5) return "high";
  if (orderCount >= 4) return "mid";
  return "low";
}

function getOfferBanner(pouchCount, orderCount) {
  const tier = getOrderTier(orderCount);
  return OFFER_BANNER_MAP[`${pouchCount}-${tier}`] || OFFER_BANNER_MAP["3-low"];
}

// ─── Analytics helpers ───────────────────────────────────────────────────────
function trackCancellationEvent(eventName, payload = {}) {
  const detail = { event: eventName, ...payload, timestamp: new Date().toISOString() };
  window.dispatchEvent(new CustomEvent("omni:cancellation", { detail }));
  if (window.dataLayer) window.dataLayer.push(detail);
  console.info("[OMNI cancellation]", detail);
}

function getActionEventName(action) {
  const label = action.label.toLowerCase();
  if (action.action === "support" || action.action === "founder-support" || label.includes("support") || label.includes("founder")) return "support_clicked";
  if (action.branch === "pause" || label.includes("pause")) return "pause_clicked";
  if (action.branch === "skip" || label.includes("skip")) return "skip_clicked";
  if (action.branch === "cadence" || label.includes("week") || label.includes("delivery")) return "cadence_change_clicked";
  if (action.branch === "product-swap") return "product_swap_clicked";
  return "save_action_clicked";
}

function supportUrlWithContext(context) {
  const url = new URL(SUPPORT_URL);
  url.searchParams.set("context", context);
  return url.toString();
}

// ─── Cancellation reason config ──────────────────────────────────────────────
// Central config for all reasons. Edit labels, CTAs, and cards here.
const reasonConfig = [
  {
    id: "no-results",
    title: "I haven't seen results yet",
    helper: "Give consistency, dose, and timing enough time to line up.",
    treatment: "education",
    headline: "Give your routine enough time to work",
    body: "Most members judge results too early. Creatine works best when dose, timing, and consistency line up for several weeks.",
    subReasons: ["Less than 4 weeks", "Taking inconsistently", "Not sure about dose", "Expected faster change"],
    // Recommended action changes dynamically based on selected sub-reason
    subReasonCtaMap: {
      "Less than 4 weeks":      { label: "Skip this order and keep going", branch: "skip" },
      "Taking inconsistently":  { label: "Build my consistency plan", branch: "plan" },
      "Not sure about dose":    { label: "Contact support about dosing", action: "support" },
      "Expected faster change": { label: "Learn how creatine works", branch: "education" },
    },
    cards: ["4 to 12 week consistency window", "Daily serving matters", "Timing should fit your routine"],
    ctas: [
      { label: "Build my consistency plan", branch: "plan" },
      { label: "Skip next order", branch: "skip" },
    ],
    plan: {
      title: "Your consistency plan",
      body: "Use a smaller, easier routine long enough to judge results.",
      options: ["Take with breakfast", "Use daily serving consistently", "Check progress at week 8"],
      note: "If your next order is too soon, skip it and keep the plan active.",
      cta: "Save my plan",
      saved: "Your consistency plan was saved.",
    },
  },
  {
    id: "habit",
    title: "Hard to remember or not consistent with routine",
    helper: "Build the habit first, then decide if the subscription fits.",
    treatment: "habit",
    headline: "Make OMNI easier to stick with",
    body: "Missing days early on is normal. The fix is not cancelling, it is making the routine easier.",
    subReasons: ["Forget most days", "Travel schedule", "No set routine", "Timing feels awkward"],
    cards: ["Pair with an existing habit", "Keep the pouch visible", "Give the habit a few weeks"],
    ctas: [
      { label: "Build my habit plan", branch: "plan" },
      { label: "Move delivery to 8 weeks", branch: "cadence", preselect: "Every 8 weeks" },
      { label: "Skip next order", branch: "skip" },
    ],
    plan: {
      title: "Your habit plan",
      body: "Tie OMNI to something you already do every day.",
      options: ["Morning reminder", "Keep pouch visible", "Pair with coffee or breakfast"],
      cta: "Save habit plan",
      saved: "Your habit plan was saved.",
    },
  },
  {
    id: "stocked",
    title: "I'm stocked up",
    helper: "Skip or slow down delivery without losing your subscription.",
    treatment: "overstock",
    headline: "You do not need to cancel to slow things down",
    body: "If you have enough product, keep member access and move the next order out.",
    subReasons: ["One extra pouch", "Multiple pouches left", "Using it slower", "Travel or schedule change"],
    cards: ["Unopened pouches keep well sealed", "Skip once without cancelling", "Move cadence to 12 weeks"],
    ctas: [
      { label: "Skip next order", branch: "skip" },
      { label: "Move to 12 weeks", branch: "cadence", preselect: "Every 12 weeks" },
      { label: "Pause subscription", branch: "pause" },
    ],
  },
  {
    id: "expensive",
    title: "Too expensive to continue",
    helper: "Review a stronger member offer before cancelling.",
    treatment: "savings",
    headline: "Keep your routine with less cost",
    body: "Keep portal control and member pricing while reducing the next few orders.",
    subReasons: ["Monthly cost", "Shipping cost", "Budget changed", "Want fewer orders"],
    useOfferMode: true,
    ctas: [
      { label: "Get 50% off next 3 orders", branch: "savings", preselect: "50% off next 3 orders" },
      { label: "Skip and get 50% off", branch: "savings", preselect: "Skip next order and keep offer" },
      { label: "Move to 12 weeks and get 50% off", branch: "cadence", preselect: "Every 12 weeks" },
    ],
  },
  {
    id: "trial-only",
    title: "I don't like subscriptions, I just wanted to try once",
    helper: "Keep control without pressure.",
    treatment: "control",
    headline: "Keep control without losing the better price",
    body: "The subscription only keeps your member pricing active. You can skip, pause, or slow deliveries whenever you need.",
    subReasons: ["Only wanted one order", "Prefer manual orders", "Subscription anxiety", "Need more control"],
    cards: ["Skip anytime", "Pause anytime", "Change delivery date"],
    ctas: [
      { label: "Move to 12 weeks", branch: "cadence", preselect: "Every 12 weeks" },
      { label: "Pause subscription", branch: "pause" },
    ],
  },
  {
    id: "flavor-texture",
    title: "Flavor or texture not a fit for me",
    helper: "Switch product format before you leave.",
    treatment: "product-fit",
    headline: "Try a better fit before leaving",
    body: "If the format is the issue, switching product type can solve the experience without losing your routine.",
    subReasons: ["Too chewy", "Flavor too strong", "Aftertaste", "Prefer drink format"],
    imageKey: "product-swap",
    cards: ["Switch to a sugar-free electrolyte format", "Try a different gummy flavor"],
    ctas: [
      { label: "Swap to electrolytes", branch: "product-swap" },
      { label: "Change the Flavor", branch: "flavor" },
    ],
    plan: {
      title: "Change your flavor",
      body: "Choose the flavor direction for your next delivery.",
      options: ["Peach gummies", "Watermelon gummies"],
      cta: "Save flavor preference",
      saved: "Your flavor preference was saved.",
    },
  },
  {
    id: "sugar",
    title: "Too much sugar or too sweet",
    helper: "Try sugar free stick packs instead.",
    treatment: "product-fit",
    headline: "Switch to a cleaner format",
    body: "Electrolyte stick packs are sugar free and keep the daily habit simple with added hydration support.",
    subReasons: ["Too sweet", "Avoiding sugar", "Prefer sugar free", "Want stick packs"],
    imageKey: "electrolytes",
    cards: ["Zero sugar format", "Added hydration support", "Keeps the daily routine"],
    ctas: [
      { label: "Switch to sugar free electrolytes", branch: "product", preselect: "Electrolyte stick packs" },
      { label: "Skip next order", branch: "skip" },
      { label: "Contact support", action: "support" },
    ],
    supportContext: "Customer selected too much sugar or too sweet during cancellation flow.",
  },
  {
    id: "digestion",
    title: "Not agreeing with my digestion",
    helper: "Try a gentler routine before cancelling.",
    treatment: "health-fit",
    headline: "Try a gentler routine first",
    body: "Some customers do better by taking OMNI with food, using a smaller serving at first, or switching formats.",
    subReasons: ["Mild stomach upset", "Too much at once", "Need food with it", "Want support advice"],
    cards: ["Take with food", "Start with fewer gummies", "Switch to stick packs"],
    ctas: [
      { label: "Build gentler routine", branch: "plan" },
      { label: "Switch to electrolytes instead", branch: "product", preselect: "Electrolyte stick packs" },
      { label: "Contact support", action: "support" },
    ],
    plan: {
      title: "Your gentler routine",
      body: "Try a slower start and only judge fit after the routine feels consistent.",
      options: ["Take with food", "Start with fewer gummies", "Use the same time daily"],
      cta: "Save gentler routine",
      saved: "Your gentler routine was saved.",
    },
    supportContext: "Customer selected digestion discomfort during cancellation flow.",
  },
  {
    id: "fast",
    title: "Orders ship too fast or frequently",
    helper: "Slow deliveries down without cancelling.",
    treatment: "cadence",
    headline: "Slow deliveries without losing your plan",
    body: "Adjust the timing so your next order arrives when you actually need it.",
    subReasons: ["Too frequent", "Wrong next date", "Travel conflict", "Need fewer shipments"],
    cards: ["Move to 8 weeks", "Move to 12 weeks", "Choose a custom date"],
    ctas: [
      { label: "Move to 8 weeks", branch: "cadence", preselect: "Every 8 weeks" },
      { label: "Move to 12 weeks", branch: "cadence", preselect: "Every 12 weeks" },
      { label: "Choose custom date", branch: "cadence", preselect: "Custom date" },
      { label: "Skip next order", branch: "skip" },
    ],
  },
  {
    id: "no-longer-need",
    title: "I no longer need it",
    helper: "Pause or slow delivery in case your routine changes later.",
    treatment: "control",
    headline: "Keep the option open",
    body: "Pause, skip, or slow deliveries instead of closing the account.",
    subReasons: ["Routine changed", "Goal changed", "Taking a break", "Using another supplement"],
    cards: ["Pause without losing setup", "Skip once", "Move to 12 weeks"],
    ctas: [
      { label: "Pause subscription", branch: "pause" },
      { label: "Skip next order", branch: "skip" },
      { label: "Move to 12 weeks", branch: "cadence", preselect: "Every 12 weeks" },
    ],
  },
  {
    id: "product-issue",
    title: "There's an issue with my gummies",
    helper: "Share details so support can resolve it.",
    treatment: "issue",
    headline: "Let support fix the issue",
    body: "Choose what you are seeing so the team can route it correctly.",
    // issueOptions shown as chips; selecting one adds context to the support request
    issueOptions: [
      "Melted or sticky gummies",
      "Wrong flavor or item",
      "Missing item in the order",
      "Taste, smell, or texture seems off",
      "Packaging arrived damaged",
      "Other product issue",
    ],
    ctas: [
      { label: "Contact support", action: "support" },
      { label: "Pause subscription", branch: "pause" },
    ],
    supportContext: "Customer selected product issue during cancellation flow.",
  },
  {
    id: "alternative",
    title: "I found a better alternative or another product",
    helper: "Compare quality and convenience before making the final call.",
    treatment: "comparison",
    headline: "Check the difference before you switch",
    body: "OMNI is built for daily consistency, convenience, and tested quality. Compare the basics before you leave.",
    subReasons: ["Different brand", "Different format", "Friend recommended another", "Comparing value"],
    useOfferMode: true,
    ctas: [
      { label: "See why OMNI is superior to other supplements", branch: "education", url: SCIENCE_PAGE_URL },
      { label: "Talk to Founder about it", action: "founder-support" },
      { label: "Get 50% off next 3 orders", branch: "savings", preselect: "50% off next 3 orders" },
    ],
  },
  {
    id: "editing",
    title: "I'm having trouble editing my subscription",
    helper: "Get help with the portal controls.",
    treatment: "portal-help",
    headline: "Your controls are still here",
    body: "Skipping, pausing, rescheduling, and changing frequency can all happen from the portal.",
    subReasons: ["Cannot find controls", "Need date change", "Need product change", "Need billing help"],
    cards: ["Change delivery frequency", "Skip next order", "Pause subscription", "Contact support"],
    ctas: [
      { label: "Change delivery frequency", branch: "cadence" },
      { label: "Skip next order", branch: "skip" },
      { label: "Pause subscription", branch: "pause" },
      { label: "Contact support", action: "support" },
    ],
    supportContext: "Trouble editing subscription in portal.",
  },
  {
    id: "other",
    title: "Other reason",
    helper: "Tell us what's missing.",
    treatment: "general",
    headline: "Tell us what is going on",
    body: "Leave a short note or choose a flexible option before making the final decision.",
    subReasons: ["Account question", "Product question", "Timing issue", "Something else"],
    noteField: true,
    ctas: [
      { label: "Contact support", action: "support" },
      { label: "Pause subscription", branch: "pause" },
      { label: "Skip next order", branch: "skip" },
    ],
    supportContext: "Customer selected other reason during cancellation flow.",
  },
];

// ─── Branch config ─────────────────────────────────────────────────────────
const branchConfig = {
  cadence: {
    title: "Update delivery frequency",
    body: "Choose when future orders should arrive.",
    options: ["Every 4 weeks", "Every 8 weeks", "Every 12 weeks", "Custom date"],
    cta: "Save frequency",
    saved: "Your frequency was updated.",
  },
  skip: {
    title: "Skip your next order",
    body: "Keep your subscription active and move the next shipment out.",
    options: ["Skip 1 week", "Skip 2 weeks", "Skip 4 weeks"],
    cta: "Skip next order",
    saved: "Your next order was skipped.",
  },
  pause: {
    title: "Pause and keep your member setup",
    body: "Take a break without closing the subscription.",
    options: ["Pause 4 weeks", "Pause 8 weeks", "Pause 12 weeks"],
    note: "Your subscription stays active, and orders resume after the pause ends.",
    cta: "Pause subscription",
    saved: "Your pause was saved.",
  },
  savings: {
    title: "Lock in the member savings",
    body: "Choose how you want the offer applied.",
    options: ["50% off next 3 orders", "Skip next order and keep offer"],
    cta: "Apply savings",
    saved: "Your savings were applied.",
  },
  product: {
    title: "Choose the format that fits better",
    body: "Pick the product direction you want for future orders.",
    options: ["Electrolyte stick packs", "Peach gummies", "Watermelon gummies"],
    cta: "Save product swap",
    saved: "Your product swap was saved.",
  },
  education: {
    title: "Why members stay",
    body: "Third-party tested quality, daily creatine gummies, and full portal control.",
    options: ["Quality testing", "How to take OMNI", "Routine tips"],
    cta: "Save and keep subscription",
    saved: "Your member setup was kept active.",
  },
  flavor: {
    title: "Change your gummy flavor",
    body: "Choose the flavor direction for your next delivery.",
    options: ["Peach gummies", "Watermelon gummies"],
    cta: "Save flavor",
    saved: "Your flavor preference was saved.",
  },
};

function getBranchConfig(branch, reason) {
  if (branch === "plan" && reason.plan) return reason.plan;
  return branchConfig[branch] || branchConfig.skip;
}

// ─── Product visual (flavor/texture and sugar reasons) ───────────────────────
function ProductVisual({ imageKey }) {
  if (!imageKey) return null;
  const productTitle = imageKey === "electrolytes" ? "Electrolyte stick packs" : "Better product fit";
  const productCopy =
    imageKey === "electrolytes"
      ? "A sugar free stick pack format with creatine and hydration support."
      : "Switch format or flavor without ending your subscription.";

  return (
    <article className={`cancel-product-visual cancel-product-visual-${imageKey}`}>
      <div className="cancel-product-thumb" aria-hidden="true" />
      <div className="cancel-product-copy">
        <span className="cancel-kicker">Product option</span>
        <h3>{productTitle}</h3>
        <p>{productCopy}</p>
      </div>
    </article>
  );
}

// ─── Modal header ─────────────────────────────────────────────────────────────
function CancellationModalHeader({ onClose }) {
  return (
    <div className="cancel-modal-header">
      <div className="cancel-modal-logo" aria-label="OMNI">
        <img src="/assets/omni-logo-dark.svg" alt="OMNI" />
      </div>
      <button className="cancel-flow-close" type="button" onClick={onClose} aria-label="Close cancellation flow">×</button>
    </div>
  );
}

// ─── Step 1: Reason select ───────────────────────────────────────────────────
function CancellationReasonSelect({ selectedReasonId, onSelect, onContinue, onClose }) {
  return (
    <div className="cancel-step">
      <div className="cancel-step-head">
        <span className="cancel-kicker">Cancellation options</span>
        <h2>Want to adjust anything before you cancel?</h2>
        <p>Choose the closest option so we can show the most useful next step.</p>
      </div>

      <div className="cancel-reason-list">
        {reasonConfig.map((reason) => (
          <button
            key={reason.id}
            type="button"
            className={`cancel-reason-row ${selectedReasonId === reason.id ? "selected" : ""}`}
            onClick={() => onSelect(reason.id)}
          >
            <span className="cancel-radio" aria-hidden="true" />
            <span>
              <strong>{reason.title}</strong>
              <small>{reason.helper}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="cancel-flow-actions">
        <Button variant="primary" onClick={onClose}>Back</Button>
        <Button variant="outline" onClick={onContinue} disabled={!selectedReasonId}>Continue</Button>
      </div>
    </div>
  );
}

// ─── Swap drawer (electrolytes product swap) ─────────────────────────────────
function SwapDrawer({ onConfirm, onClose }) {
  const [selectedFlavor, setSelectedFlavor] = useState("peach");
  const flavors = Object.entries(PRODUCT_SWAP_MAP);
  const selectedProduct = PRODUCT_SWAP_MAP[selectedFlavor];

  return (
    <div className="cancel-step">
      <div className="cancel-step-back-row">
        <button type="button" className="cancel-back-link" onClick={onClose}>Close</button>
      </div>
      <div className="cancel-step-head">
        <h2>Change To Electrolytes</h2>
        <p>Choose Electrolytes Flavor</p>
      </div>
      <div className="cancel-swap-flavor-grid">
        {flavors.map(([key, opt]) => (
          <button
            key={key}
            type="button"
            className={`cancel-swap-flavor-option ${selectedFlavor === key ? "selected" : ""}`}
            onClick={() => setSelectedFlavor(key)}
          >
            <img src={opt.image} alt={opt.title} />
            <span>{opt.title}</span>
          </button>
        ))}
      </div>
      <div className="cancel-flow-actions cancel-flow-actions-sticky">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={() => onConfirm(selectedProduct)}>Confirm swap</Button>
      </div>
    </div>
  );
}

// ─── Step 2: Save page (reason-specific treatment) ──────────────────────────
function CancellationSavePage({ reason, onBack, onAction, onCancel }) {
  const [selectedSubReason, setSelectedSubReason] = useState("");
  const [note, setNote] = useState("");
  const isIssueFlow = Boolean(reason.issueOptions?.length);
  const diagnosticOptions = reason.issueOptions || reason.subReasons || [];
  const needsDiagnosticAnswer = diagnosticOptions.length > 0 && !isIssueFlow;
  // Issue flow CTAs always enabled (no required field selection)
  const canContinue = !needsDiagnosticAnswer || Boolean(selectedSubReason);

  // Dynamic recommended CTA for "no-results" based on selected sub-reason
  const activeCtas = useMemo(() => {
    if (reason.subReasonCtaMap && selectedSubReason && reason.subReasonCtaMap[selectedSubReason]) {
      const dynamic = reason.subReasonCtaMap[selectedSubReason];
      const secondary = reason.ctas.find((c) => c.label !== dynamic.label);
      return secondary ? [dynamic, secondary] : [dynamic];
    }
    return reason.ctas;
  }, [reason, selectedSubReason]);

  const handleAction = (action) => {
    if (!canContinue) return;
    onAction(action, { selectedSubReason, note });
  };

  const handleCancel = () => {
    if (!canContinue) return;
    onCancel();
  };

  // ── Offer mode (expensive, alternative) ─────────────────────────────────
  if (reason.useOfferMode) {
    const bannerUrl = getOfferBanner(subscription.pouchCount || 3, subscription.orderCount || 2);
    return (
      <div className="cancel-step cancel-save-step">
        <h2>{reason.headline}</h2>
        <p>{reason.body}</p>
        <div className="cancel-offer-banner">
          <img src={bannerUrl} alt="Member offer" />
        </div>
        <div className="cancel-offer-cta-stack">
          {reason.ctas.map((action, index) => (
            <button
              key={`${reason.id}-${action.label}`}
              type="button"
              className={index === 0 ? "cancel-save-primary" : "cancel-save-secondary"}
              onClick={() => handleAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
        <button type="button" className="cancel-text-link" onClick={handleCancel}>
          {FINAL_STEP_LABEL}
        </button>
      </div>
    );
  }

  // ── Action mode ──────────────────────────────────────────────────────────
  return (
    <div className="cancel-step cancel-save-step">
      <h2>{reason.headline}</h2>
      <p>{reason.body}</p>

      <ProductVisual imageKey={reason.imageKey} />

      {diagnosticOptions.length > 0 && (
        <div className="cancel-diagnostic-block">
          <span className="cancel-kicker">{isIssueFlow ? "Choose issue type" : "What best describes it?"}</span>
          <div className="cancel-issue-type-grid" aria-label={isIssueFlow ? "Issue type" : "Sub-reason"}>
            {diagnosticOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`cancel-issue-type ${selectedSubReason === option ? "selected" : ""}`}
                onClick={() => setSelectedSubReason(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {reason.noteField && (
        <label className="cancel-note-field">
          Short note
          <textarea rows="3" placeholder="Tell us what is missing" value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
      )}

      <div className={`cancel-save-card cancel-treatment-${reason.treatment}`}>
        {needsDiagnosticAnswer && !selectedSubReason && (
          <p className="cancel-unlock-note">Choose one option above to unlock these actions.</p>
        )}
        {selectedSubReason && !isIssueFlow && (
          <p className="cancel-selected-choice">Selected: {selectedSubReason}</p>
        )}
        {reason.cards?.length > 0 && (
          <div className="cancel-insight-grid">
            {reason.cards.map((card) => (
              <article className="cancel-insight-card" key={card}>
                <span aria-hidden="true">✓</span>
                <strong>{card}</strong>
              </article>
            ))}
          </div>
        )}
        <div className="cancel-save-grid">
          {activeCtas.map((action, index) => (
            <button
              key={`${reason.id}-${action.label}`}
              type="button"
              className={index === 0 ? "cancel-save-primary" : "cancel-save-secondary"}
              disabled={!canContinue}
              onClick={() => handleAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="cancel-text-link" onClick={handleCancel} disabled={!canContinue}>
        {FINAL_STEP_LABEL}
      </button>
    </div>
  );
}

// ─── Step 3: Branch screen (cadence, skip, pause, savings, product, etc.) ───
function CancellationBranchScreen({ branch, reason, preselect, onBack, onDone, onCancel }) {
  const config = getBranchConfig(branch, reason);
  const [choice, setChoice] = useState(preselect || config.options[0] || "");

  useEffect(() => {
    setChoice(preselect || config.options[0] || "");
  }, [preselect, config]);

  return (
    <div className="cancel-step">
      <div className="cancel-step-back-row">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to save page</button>
      </div>
      <div className="cancel-step-head cancel-stacked-head">
        <span className="cancel-selected-label">{reason.title}</span>
        <h2>{config.title}</h2>
        <p>{config.body}</p>
      </div>

      <div className="cancel-branch-card">
        {config.options.map((option) => (
          <button
            key={option}
            type="button"
            className={`cancel-option-pill ${choice === option ? "selected" : ""}`}
            onClick={() => setChoice(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {config.note && <p className="cancel-offer-note">{config.note}</p>}

      <div className="cancel-flow-actions cancel-flow-actions-sticky">
        <Button variant="primary" onClick={() => onDone(config.saved, choice)}>
          {choice ? `${config.cta}: ${choice}` : config.cta}
        </Button>
        <button type="button" className="cancel-text-link" onClick={onCancel}>{FINAL_STEP_LABEL}</button>
      </div>
    </div>
  );
}

// ─── Step 4: Rescue page ("Choose what you'd like to do next") ──────────────
// Rescue page always shows the offer banner + claim CTA + pause secondary
function CancellationRescuePage({ reason, onBack, onAction, onContinue }) {
  const bannerUrl = getOfferBanner(subscription.pouchCount || 3, subscription.orderCount || 2);
  const offerAction = { label: "Claim this offer", branch: "savings", preselect: "50% off next 3 orders" };
  const pauseAction = { label: "Pause subscription", branch: "pause" };

  return (
    <div className="cancel-step cancel-rescue-step">
      <div className="cancel-step-back-row">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to options</button>
      </div>
      <div className="cancel-step-head cancel-stacked-head">
        <span className="cancel-kicker">Account options</span>
        <h2>Choose what you'd like to do next</h2>
      </div>

      <div className="cancel-rescue-offer-panel">
        <img src={bannerUrl} alt="Member offer — 50% off next order + free electrolytes" className="cancel-rescue-offer-img" />
        <button
          type="button"
          className="cancel-save-primary cancel-rescue-offer-cta"
          onClick={() => onAction(offerAction)}
        >
          Claim this offer
        </button>
        <button
          type="button"
          className="cancel-save-secondary cancel-rescue-pause-btn"
          onClick={() => onAction(pauseAction)}
        >
          Pause subscription instead
        </button>
      </div>

      <div className="cancel-rescue-footer cancel-rescue-footer-single">
        <button type="button" className="cancel-text-link" onClick={onContinue}>Continue to final cancellation</button>
      </div>
    </div>
  );
}

// ─── Step 5: Final confirmation ──────────────────────────────────────────────
function getFinalConfirmConfig(reason) {
  if (["product-issue", "flavor-texture", "sugar", "digestion"].includes(reason.id)) {
    return {
      pill: "Product issue",
      title: "You can still let support review this first.",
      body: "If you continue, your subscription will be cancelled. If you want the team to review the issue before you decide, go back to the fix options.",
    };
  }
  if (["stocked", "fast"].includes(reason.id)) {
    return {
      pill: "Too much product",
      title: "You can still slow deliveries instead of cancelling.",
      body: "If you continue, your subscription will be cancelled. If timing is the issue, go back to switch cadence or skip your next order.",
    };
  }
  if (reason.id === "expensive") {
    return {
      pill: "Price concern",
      title: "You can still pause or take the offer instead of cancelling.",
      body: "If you continue, your subscription will be cancelled. If now is not the right time, go back to pause or apply the member offer.",
    };
  }
  if (reason.id === "alternative") {
    return {
      pill: "Considering another product",
      title: "You can still keep your OMNI subscription active.",
      body: "If you continue, your subscription will be cancelled. If you want to compare options first, go back to the fix options.",
    };
  }
  if (["no-longer-need", "trial-only"].includes(reason.id)) {
    return {
      pill: "Not using it right now",
      title: "You can still keep control without another delivery.",
      body: "If you continue, your subscription will be cancelled. If you may come back later, go back to pause instead.",
    };
  }
  return {
    pill: "Other reason",
    title: "You can still choose a lighter option.",
    body: "If you continue, your subscription will be cancelled. If you want to pause, skip, or contact support first, go back to the fix options.",
  };
}

function CancellationFinalConfirm({ reason, onBack, onConfirm }) {
  const finalCopy = getFinalConfirmConfig(reason);

  return (
    <div className="cancel-step cancel-confirm-step">
      <div className="cancel-confirm-shell">
        <div className="cancel-step-back-row">
          <button type="button" className="cancel-back-link" onClick={onBack}>Back to options</button>
        </div>
        <div className="cancel-step-head cancel-stacked-head">
          <span className="cancel-kicker">Final choice</span>
          <h2>Choose how you'd like to finish</h2>
          <p className="cancel-final-subcopy">Your subscription can be cancelled now, or you can adjust the next order instead.</p>
        </div>

        <div className="cancel-confirm-card">
          <span className="cancel-selected-label">{finalCopy.pill}</span>
          <h3>{finalCopy.title}</h3>
          <p>{finalCopy.body}</p>
        </div>

        <div className="cancel-confirm-actions">
          <Button variant="primary" onClick={onBack}>Adjust next order</Button>
          <Button variant="outline" onClick={onConfirm}>Cancel subscription</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Saved / cancelled screens ───────────────────────────────────────────────
function CancellationSavedScreen({ message, onDone }) {
  return (
    <div className="cancel-step cancel-complete-step cancel-complete-step-saved">
      <span className="cancel-kicker">Saved</span>
      <h2>{message}</h2>
      <p>Your subscription stays active. You can return to the overview and keep managing your order.</p>
      <Button variant="primary" onClick={onDone}>Return to subscription overview</Button>
    </div>
  );
}

function CancellationCompleteScreen({ onDone }) {
  return (
    <div className="cancel-step cancel-complete-step cancel-complete-step-cancelled">
      <span className="cancel-kicker">Cancelled</span>
      <h2>Your subscription has been cancelled.</h2>
      <p>You'll still have access to your account if you want to restart later.</p>
      <Button variant="primary" onClick={onDone}>Done</Button>
    </div>
  );
}

// ─── Main cancellation flow ──────────────────────────────────────────────────
export default function CancellationFlow({ open, onClose, onKept, onSupportStarted }) {
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [step, setStep] = useState("reason");
  const [branch, setBranch] = useState("");
  const [branchPreselect, setBranchPreselect] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedReason = useMemo(
    () => reasonConfig.find((reason) => reason.id === selectedReasonId),
    [selectedReasonId]
  );

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    trackCancellationEvent("flow_opened");
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const closeFlow = ({ skipAbandonedEvent = false } = {}) => {
    if (!skipAbandonedEvent && step === "confirm" && selectedReason?.id) {
      trackCancellationEvent("final_cancellation_abandoned", { reasonId: selectedReason.id, source: "close" });
    }
    setSelectedReasonId("");
    setStep("reason");
    setBranch("");
    setBranchPreselect("");
    setSavedMessage("");
    setSubmitted(false);
    onClose();
  };

  const handleBackdrop = () => {
    if (step === "reason" && !submitted && !savedMessage) closeFlow();
  };

  const handleReasonSelect = (reasonId) => {
    setSelectedReasonId(reasonId);
    trackCancellationEvent("cancellation_reason_selected", { reasonId });
  };

  const handleAction = (action, context = {}) => {
    trackCancellationEvent(getActionEventName(action), {
      reasonId: selectedReason?.id,
      action: action.label,
      subReason: context.selectedSubReason,
    });

    // Support / founder-support: open external URL
    if (action.action === "support" || action.action === "founder-support") {
      const baseUrl = action.action === "founder-support" ? FOUNDER_SUPPORT_URL : SUPPORT_URL;
      const supportContext = [
        selectedReason?.supportContext || `Customer selected ${selectedReason?.title} during cancellation flow.`,
        context.selectedSubReason ? `Issue type: ${context.selectedSubReason}.` : "",
        context.note ? `Note: ${context.note}` : "",
      ].filter(Boolean).join(" ");
      const url = new URL(baseUrl);
      url.searchParams.set("context", supportContext);
      window.open(url.toString(), "_blank", "noopener,noreferrer");
      closeFlow({ skipAbandonedEvent: true });
      onSupportStarted?.("Support request started.");
      return;
    }

    // Actions with a direct URL (e.g. science page)
    if (action.url) {
      window.open(action.url, "_blank", "noopener,noreferrer");
      return;
    }

    // Product swap (electrolytes drawer)
    if (action.branch === "product-swap") {
      setStep("product-swap");
      return;
    }

    setBranch(action.branch || "skip");
    setBranchPreselect(action.preselect || "");
    setStep("branch");
    trackCancellationEvent("branch_opened", { reasonId: selectedReason?.id, branch: action.branch, preselect: action.preselect });
  };

  const handleSaved = (message, choice) => {
    const finalMessage = message || "Your subscription update was saved.";
    setSavedMessage(finalMessage);
    setStep("saved");
    trackCancellationEvent("save_completed", { reasonId: selectedReason?.id, branch, choice, message: finalMessage });
  };

  const handleSwapConfirmed = (product) => {
    handleSaved(`Your subscription is being swapped to ${product.title}.`, product.id);
  };

  const reviewFinalStep = () => {
    trackCancellationEvent("save_page_viewed", { reasonId: selectedReason?.id, step });
    setStep("rescue");
  };

  const continueToFinalConfirmation = () => {
    trackCancellationEvent("continue_to_final_cancellation_clicked", { reasonId: selectedReason?.id, step });
    setStep("confirm");
  };

  return (
    <div className="cancel-flow-backdrop" role="presentation" onClick={handleBackdrop}>
      <section
        className="cancel-flow-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Cancel subscription flow"
        onClick={(event) => event.stopPropagation()}
      >
        <CancellationModalHeader onClose={closeFlow} />

        {!submitted && !savedMessage && step === "reason" && (
          <CancellationReasonSelect
            selectedReasonId={selectedReasonId}
            onSelect={handleReasonSelect}
            onContinue={() => {
              trackCancellationEvent("save_page_viewed", { reasonId: selectedReasonId });
              setStep("save");
            }}
            onClose={closeFlow}
          />
        )}
        {!submitted && !savedMessage && step === "save" && selectedReason && (
          <CancellationSavePage
            reason={selectedReason}
            onBack={() => setStep("reason")}
            onAction={handleAction}
            onCancel={reviewFinalStep}
          />
        )}
        {!submitted && !savedMessage && step === "product-swap" && selectedReason && (
          <SwapDrawer
            onConfirm={handleSwapConfirmed}
            onClose={() => setStep("save")}
          />
        )}
        {!submitted && !savedMessage && step === "branch" && selectedReason && (
          <CancellationBranchScreen
            branch={branch}
            preselect={branchPreselect}
            reason={selectedReason}
            onBack={() => setStep("save")}
            onDone={handleSaved}
            onCancel={reviewFinalStep}
          />
        )}
        {!submitted && !savedMessage && step === "rescue" && selectedReason && (
          <CancellationRescuePage
            reason={selectedReason}
            onBack={() => setStep("save")}
            onAction={(action) => handleAction(action, { selectedSubReason: "Final save attempt" })}
            onContinue={continueToFinalConfirmation}
          />
        )}
        {!submitted && !savedMessage && step === "confirm" && selectedReason && (
          <CancellationFinalConfirm
            reason={selectedReason}
            onBack={() => setStep("rescue")}
            onConfirm={() => {
              trackCancellationEvent("final_cancellation_confirmed", { reasonId: selectedReason.id });
              setSubmitted(true);
            }}
          />
        )}
        {savedMessage && <CancellationSavedScreen message={savedMessage} onDone={closeFlow} />}
        {submitted && <CancellationCompleteScreen onDone={closeFlow} />}
      </section>
    </div>
  );
}
