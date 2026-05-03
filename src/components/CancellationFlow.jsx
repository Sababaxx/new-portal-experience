import React, { useEffect, useMemo, useState } from "react";
import Button from "./Button.jsx";

const SUPPORT_URL = "https://contact.gorgias.help/en-US/forms/0c4rzba9";
const FINAL_STEP_LABEL = "Review final step";

function trackCancellationEvent(eventName, payload = {}) {
  const detail = { event: eventName, ...payload, timestamp: new Date().toISOString() };
  window.dispatchEvent(new CustomEvent("omni:cancellation", { detail }));
  if (window.dataLayer) window.dataLayer.push(detail);
  console.info("[OMNI cancellation]", detail);
}

function supportUrlWithContext(context) {
  const url = new URL(SUPPORT_URL);
  url.searchParams.set("context", context);
  return url.toString();
}

const reasonConfig = [
  {
    id: "no-results",
    title: "I haven't seen results yet",
    helper: "Give consistency, dose, and timing enough time to line up.",
    treatment: "education",
    headline: "Give your routine enough time to work",
    body: "Most members judge results too early. Creatine works best when dose, timing, and consistency line up for several weeks.",
    subReasons: ["Less than 4 weeks", "Taking inconsistently", "Not sure about dose", "Expected faster change"],
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
    reminder: "A consistency plan may help you judge results before leaving.",
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
    reminder: "A habit plan can make the routine easier before you cancel.",
  },
  {
    id: "stocked",
    title: "I'm stocked up",
    helper: "Skip or slow down delivery without losing your subscription.",
    treatment: "overstock",
    headline: "You do not need to cancel to slow things down",
    body: "If you have enough product, keep member access and move the next order out.",
    subReasons: ["One extra pouch", "Multiple pouches left", "Using it slower", "Travel or schedule change"],
    cards: ["Unopened pouches keep well sealed", "Skip once without cancelling", "Move cadence to 8 or 12 weeks"],
    ctas: [
      { label: "Skip next order", branch: "skip" },
      { label: "Move to 8 weeks", branch: "cadence", preselect: "Every 8 weeks" },
      { label: "Move to 12 weeks", branch: "cadence", preselect: "Every 12 weeks" },
      { label: "Pause subscription", branch: "pause" },
    ],
    reminder: "Skipping or slowing down gives you time to use your current supply.",
  },
  {
    id: "expensive",
    title: "Too expensive to continue",
    helper: "Review a stronger member offer before cancelling.",
    treatment: "savings",
    headline: "Lower the next orders before giving up member pricing",
    body: "Keep portal control, member pricing, and your routine while reducing the next few orders.",
    subReasons: ["Monthly cost", "Shipping cost", "Budget changed", "Want fewer orders"],
    offer: "50% off next 3 orders",
    cards: ["Best if you still want OMNI", "Keeps member pricing active", "Can pair with a skipped order"],
    ctas: [
      { label: "Apply 50% off next 3 orders", branch: "savings", preselect: "50% off next 3 orders" },
      { label: "Skip and keep offer", branch: "savings", preselect: "Skip next order and keep offer" },
      { label: "Move to 8 weeks", branch: "cadence", preselect: "Every 8 weeks" },
    ],
    reminder: "Savings may lower the cost while keeping your member setup active.",
  },
  {
    id: "trial-only",
    title: "I don't like subscriptions, I just wanted to try once",
    helper: "Keep control without pressure.",
    treatment: "control",
    headline: "Keep control without losing the better price",
    body: "The subscription only keeps your member pricing active. You can skip, pause, or slow deliveries whenever you need.",
    subReasons: ["Only wanted one order", "Prefer manual orders", "Subscription anxiety", "Need more control"],
    cards: ["Skip anytime", "Pause anytime", "Change delivery date", "Cancel from portal"],
    ctas: [
      { label: "Skip next order", branch: "skip" },
      { label: "Pause subscription", branch: "pause" },
      { label: "Move to 8 weeks", branch: "cadence", preselect: "Every 8 weeks" },
    ],
    reminder: "You can keep the better price without taking another immediate shipment.",
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
    cards: ["Switch to electrolyte stick packs", "Try Peach gummies", "Try Watermelon gummies", "Build a product plan"],
    ctas: [
      { label: "Swap product", branch: "product" },
      { label: "Get my product plan", branch: "plan" },
    ],
    plan: {
      title: "Your product plan",
      body: "Move toward the product direction that fits your taste and routine.",
      options: ["Electrolyte stick packs", "Peach gummies", "Watermelon gummies"],
      cta: "Save product plan",
      saved: "Your product plan was saved.",
    },
    reminder: "A product swap may solve the fit issue without canceling.",
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
      { label: "Switch to stick packs", branch: "product", preselect: "Electrolyte stick packs" },
      { label: "Skip next order", branch: "skip" },
      { label: "Contact support", action: "support" },
    ],
    supportContext: "Customer selected too much sugar or too sweet during cancellation flow.",
    reminder: "A sugar free swap may be a better fit than cancelling.",
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
      { label: "Switch product", branch: "product", preselect: "Electrolyte stick packs" },
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
    reminder: "A slower routine or support check may help before final cancellation.",
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
    reminder: "Frequency controls can solve timing issues without ending the subscription.",
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
    reminder: "Pausing keeps your setup ready if you want OMNI again later.",
  },
  {
    id: "product-issue",
    title: "There's an issue with my gummies",
    helper: "Share details so support can resolve it.",
    treatment: "issue",
    headline: "Let support fix the product issue",
    body: "Choose what you are seeing so the team can route it correctly.",
    issueFields: true,
    issueOptions: ["Melted or sticky gummies", "Damaged pouch or packaging", "Wrong flavor or item", "Missing item in the order", "Taste, smell, or texture seems off", "Other product issue"],
    ctas: [
      { label: "Contact support about this issue", action: "support", requiresDetail: true },
      { label: "Pause subscription", branch: "pause" },
    ],
    supportContext: "Customer selected product issue during cancellation flow.",
    reminder: "Support can review the product issue before final cancellation.",
  },
  {
    id: "packaging-issue",
    title: "Packaging issue with my order",
    helper: "Tell us what happened so support can fix it.",
    treatment: "issue",
    headline: "Let support fix the packaging issue",
    body: "Choose what happened so support can route this correctly.",
    issueFields: true,
    issueOptions: ["Pouch arrived damaged", "Seal was open", "Box was damaged", "Items were missing", "Label or address issue", "Other packaging issue"],
    ctas: [
      { label: "Contact support about packaging", action: "support", requiresDetail: true },
      { label: "Pause subscription", branch: "pause" },
    ],
    supportContext: "Customer selected packaging issue during cancellation flow.",
    reminder: "Support can review packaging problems before you cancel.",
  },
  {
    id: "alternative",
    title: "I found a better alternative or another product",
    helper: "Compare quality and convenience before making the final call.",
    treatment: "comparison",
    headline: "Check the difference before you switch",
    body: "OMNI is built for daily consistency, convenience, and tested quality. Compare the basics before you leave.",
    subReasons: ["Different brand", "Different format", "Friend recommended another", "Comparing value"],
    cards: ["Third party quality testing", "Daily format made for consistency", "Portal control for timing and skips"],
    ctas: [
      { label: "See why members stay", branch: "education" },
      { label: "Get my personalized plan", branch: "plan" },
      { label: "Apply member savings", branch: "savings", preselect: "50% off next 3 orders" },
    ],
    plan: {
      title: "Your better setup",
      body: "Keep OMNI only where it fits your current routine.",
      options: ["Move to 8 weeks", "Add electrolyte sticks", "Keep member pricing active"],
      cta: "Save better setup",
      saved: "Your better setup was saved.",
    },
    reminder: "A quick comparison may help before you give up member benefits.",
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
    reminder: "Portal controls can fix most subscription timing issues.",
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
    reminder: "Support can review your note before you cancel.",
  },
];

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
    options: ["Pause 2 weeks", "Pause 4 weeks", "Pause 8 weeks", "Custom restart date"],
    note: "Your subscription stays active, and orders resume after the pause ends.",
    cta: "Pause subscription",
    saved: "Your pause was saved.",
  },
  savings: {
    title: "Lock in the member savings",
    body: "Choose how you want the offer applied.",
    options: ["50% off next 3 orders", "Skip next order and keep offer", "Keep current plan"],
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
    body: "This placeholder is ready for deeper website-style content.",
    options: ["Quality testing", "How to take OMNI", "Routine tips"],
    cta: "Save and keep subscription",
    saved: "Your member setup was kept active.",
  },
};

function getBranchConfig(branch, reason) {
  if (branch === "plan" && reason.plan) return reason.plan;
  return branchConfig[branch] || branchConfig.skip;
}

function ProductVisual({ imageKey }) {
  if (!imageKey) return null;
  return (
    <div className={`cancel-product-visual cancel-product-visual-${imageKey}`}>
      <div>
        <span className="cancel-kicker">Product option</span>
        <strong>{imageKey === "electrolytes" ? "Electrolyte stick packs" : "Better product fit"}</strong>
        <small>Image asset slot ready for final OMNI product creative.</small>
      </div>
    </div>
  );
}

function CancellationReasonSelect({ selectedReasonId, onSelect, onContinue, onClose }) {
  return (
    <div className="cancel-step">
      <div className="cancel-step-head">
        <span className="cancel-kicker">Cancellation flow</span>
        <h2>Before you cancel, what should we fix first?</h2>
        <p>Choose the closest reason so we can show the best option before you make the final call.</p>
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
        <Button variant="outline" onClick={onClose}>Back</Button>
        <Button variant="primary" onClick={onContinue} disabled={!selectedReasonId}>Continue</Button>
      </div>
    </div>
  );
}

function CancellationSavePage({ reason, onBack, onAction, onCancel }) {
  const [selectedSubReason, setSelectedSubReason] = useState("");
  const [note, setNote] = useState("");
  const isIssueFlow = Boolean(reason.issueFields);
  const diagnosticOptions = reason.issueOptions || reason.subReasons || [];
  const engineLabel = isIssueFlow ? "Issue resolution route" : "Retention engine match";

  const handleAction = (action) => {
    onAction(action, { selectedSubReason, note });
  };

  return (
    <div className="cancel-step cancel-save-step">
      <div className="cancel-step-meta">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to reasons</button>
        <span className="cancel-selected-label">{reason.title}</span>
      </div>
      <h2>{reason.headline}</h2>
      <p>{reason.body}</p>

      <ProductVisual imageKey={reason.imageKey} />

      {reason.offer && <p className="cancel-offer-note">{reason.offer}</p>}

      {diagnosticOptions.length > 0 && (
        <div className="cancel-diagnostic-block">
          <span className="cancel-kicker">{isIssueFlow ? "Choose issue type" : "What best describes it?"}</span>
          <div className="cancel-issue-type-grid" aria-label={isIssueFlow ? "Issue type" : "Cancellation sub reason"}>
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

      {isIssueFlow && selectedSubReason && (
        <div className="cancel-issue-fields" aria-label="Product issue details">
          <span className="cancel-kicker">Details for support</span>
          <label>
            Photo of the gummies
            <input type="file" />
          </label>
          <label>
            Lot number from the back of the sachet
            <input type="text" placeholder="Lot number" />
          </label>
          <label>
            Short description of the issue
            <textarea rows="3" placeholder={`Tell us about: ${selectedSubReason}`} onChange={(event) => setNote(event.target.value)} />
          </label>
        </div>
      )}

      {reason.noteField && (
        <label className="cancel-note-field">
          Short note
          <textarea rows="3" placeholder="Tell us what is missing" value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
      )}

      {reason.cards?.length > 0 && (
        <div className="cancel-insight-grid">
          {reason.cards.map((card) => <div key={card}>{card}</div>)}
        </div>
      )}

      <div className={`cancel-save-card cancel-treatment-${reason.treatment} cancel-cta-count-${reason.ctas.length}`}>
        <span className="cancel-kicker">{engineLabel}</span>
        <h3>{reason.ctas[0].label}</h3>
        {selectedSubReason && !isIssueFlow && <p>Selected: {selectedSubReason}</p>}
        {isIssueFlow && !selectedSubReason && <p>Select an issue type above to unlock support.</p>}
        <div className="cancel-save-grid">
          {reason.ctas.map((action, index) => (
            <button
              key={`${reason.id}-${action.label}`}
              type="button"
              className={index === 0 ? "cancel-save-primary" : "cancel-save-secondary"}
              disabled={Boolean(action.requiresDetail && !selectedSubReason)}
              onClick={() => handleAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="cancel-text-link" onClick={onCancel}>
        {FINAL_STEP_LABEL}
      </button>
    </div>
  );
}

function CancellationBranchScreen({ branch, reason, preselect, onBack, onDone, onCancel }) {
  const config = getBranchConfig(branch, reason);
  const [choice, setChoice] = useState(preselect || config.options[0] || "");

  useEffect(() => {
    setChoice(preselect || config.options[0] || "");
  }, [preselect, config]);

  return (
    <div className="cancel-step">
      <div className="cancel-step-meta">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to save page</button>
        <span className="cancel-selected-label">{reason.title}</span>
      </div>
      <h2>{config.title}</h2>
      <p>{config.body}</p>

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
        <Button variant="primary" onClick={() => onDone(config.saved, choice)}>{choice ? `${config.cta}: ${choice}` : config.cta}</Button>
        <button type="button" className="cancel-text-link" onClick={onCancel}>{FINAL_STEP_LABEL}</button>
      </div>
    </div>
  );
}

function CancellationFinalConfirm({ reason, onBack, onKeep, onConfirm }) {
  return (
    <div className="cancel-step cancel-confirm-step">
      <div className="cancel-step-meta">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to save page</button>
        <span className="cancel-kicker">Final confirmation</span>
      </div>
      <h2>Before you cancel</h2>

      <div className="cancel-confirm-card">
        <span className="cancel-selected-label">{reason.title}</span>
        <p>{reason.reminder}</p>
        <small>Confirming cancellation will submit this request locally in the prototype. No backend action is connected yet.</small>
      </div>

      <div className="cancel-flow-actions cancel-flow-actions-sticky">
        <Button variant="outline" onClick={onKeep}>Keep subscription</Button>
        <Button variant="primary" onClick={onConfirm}>Confirm cancellation</Button>
      </div>
    </div>
  );
}

function CancellationSavedScreen({ message, onDone }) {
  return (
    <div className="cancel-step cancel-complete-step">
      <span className="cancel-kicker">Saved</span>
      <h2>{message}</h2>
      <p>Your subscription stays active in this prototype. You can return to the overview and keep managing your order.</p>
      <Button variant="primary" onClick={onDone}>Return to subscription overview</Button>
    </div>
  );
}

function CancellationCompleteScreen({ onDone }) {
  return (
    <div className="cancel-step cancel-complete-step">
      <span className="cancel-kicker">Request submitted</span>
      <h2>Subscription cancellation submitted.</h2>
      <p>This prototype records the cancellation locally. A real version would show the cancellation date and email confirmation details.</p>
      <Button variant="primary" onClick={onDone}>Done</Button>
    </div>
  );
}

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

  const closeFlow = () => {
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
    trackCancellationEvent("reason_selected", { reasonId });
  };

  const handleAction = (action, context = {}) => {
    trackCancellationEvent("retention_cta_clicked", {
      reasonId: selectedReason?.id,
      action: action.label,
      subReason: context.selectedSubReason,
    });

    if (action.action === "support") {
      const supportContext = [
        selectedReason?.supportContext || `Customer selected ${selectedReason?.title} during cancellation flow.`,
        context.selectedSubReason ? `Sub reason: ${context.selectedSubReason}.` : "",
        context.note ? `Note: ${context.note}` : "",
      ].filter(Boolean).join(" ");
      window.open(supportUrlWithContext(supportContext), "_blank", "noopener,noreferrer");
      trackCancellationEvent("support_route_started", { reasonId: selectedReason?.id, supportContext });
      closeFlow();
      onSupportStarted?.("Support request started.");
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

  const continueCancellation = () => {
    trackCancellationEvent("continue_cancellation_clicked", { reasonId: selectedReason?.id, step });
    setStep("confirm");
  };

  const keepSubscription = () => {
    trackCancellationEvent("subscription_kept", { reasonId: selectedReason?.id });
    closeFlow();
    onKept();
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
        <button className="cancel-flow-close" type="button" onClick={closeFlow} aria-label="Close cancellation flow">x</button>

        {!submitted && !savedMessage && step === "reason" && (
          <CancellationReasonSelect
            selectedReasonId={selectedReasonId}
            onSelect={handleReasonSelect}
            onContinue={() => {
              trackCancellationEvent("save_page_opened", { reasonId: selectedReasonId });
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
            onCancel={continueCancellation}
          />
        )}
        {!submitted && !savedMessage && step === "branch" && selectedReason && (
          <CancellationBranchScreen
            branch={branch}
            preselect={branchPreselect}
            reason={selectedReason}
            onBack={() => setStep("save")}
            onDone={handleSaved}
            onCancel={continueCancellation}
          />
        )}
        {!submitted && !savedMessage && step === "confirm" && selectedReason && (
          <CancellationFinalConfirm
            reason={selectedReason}
            onBack={() => setStep("save")}
            onKeep={keepSubscription}
            onConfirm={() => {
              trackCancellationEvent("cancellation_confirmed", { reasonId: selectedReason.id });
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
