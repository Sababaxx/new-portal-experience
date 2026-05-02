import React, { useEffect, useMemo, useState } from "react";
import Button from "./Button.jsx";

const reasonConfig = [
  {
    id: "no-results",
    title: "I haven't seen results yet",
    helper: "Give consistency, dose, and timing enough time to line up.",
    treatment: "education",
    headline: "Results usually build with consistency",
    body: "Most members notice changes between 4 to 12 weeks when dose, timing, and routine match their lifestyle.",
    ctas: [
      { label: "Get my personalized plan", branch: "plan" },
      { label: "Skip next order", branch: "skip" },
    ],
    reminder: "A personalized plan may help you get more from the product before leaving.",
  },
  {
    id: "habit",
    title: "Hard to remember or not consistent with routine",
    helper: "Build the habit first, then decide if the subscription fits.",
    treatment: "habit",
    headline: "Missing days is normal at first",
    body: "Most members need a few weeks to make OMNI part of the same daily routine.",
    ctas: [
      { label: "Get my personalized habit plan", branch: "plan" },
      { label: "Update delivery frequency", branch: "cadence" },
      { label: "Skip next order", branch: "skip" },
    ],
    reminder: "A habit plan can make the routine easier before you cancel.",
  },
  {
    id: "stocked",
    title: "I'm stocked up",
    helper: "Skip the next order without losing your subscription.",
    treatment: "overstock",
    headline: "Keep access and use what you have",
    body: "If you already have enough product, you can skip your next order and keep member access for later.",
    offer: "Keep your subscription active and your next order can stay eligible for member savings.",
    ctas: [{ label: "Skip next order", branch: "skip" }],
    reminder: "Skipping gives you time to use your current supply without ending the account.",
  },
  {
    id: "expensive",
    title: "Too expensive to continue",
    helper: "Review a stronger member offer before cancelling.",
    treatment: "savings",
    headline: "Keep the plan with a stronger offer",
    body: "You can lower the next few orders instead of losing subscription pricing and portal control.",
    ctas: [
      { label: "Apply 50 percent off next 3 orders", branch: "savings" },
      { label: "Skip next order", branch: "skip" },
    ],
    reminder: "The stronger offer can reduce the cost while keeping your routine active.",
  },
  {
    id: "flavor-texture",
    title: "Flavor or texture not a fit for me",
    helper: "Switch the product format before you leave.",
    treatment: "product-fit",
    headline: "Try a cleaner fit first",
    body: "Many customers improve the experience by switching from gummies to electrolyte stick packs.",
    ctas: [
      { label: "Swap product", branch: "product" },
      { label: "Get my personalized plan", branch: "plan" },
    ],
    reminder: "A product swap may solve the fit issue without canceling.",
  },
  {
    id: "trial-only",
    title: "I don't like subscriptions, I just wanted to try once",
    helper: "Keep control without pressure.",
    treatment: "control",
    headline: "You stay in control",
    body: "The subscription keeps better pricing, future offers, and consistency, but you can skip or pause anytime.",
    ctas: [
      { label: "Skip next order", branch: "skip" },
      { label: "Pause subscription", branch: "pause" },
    ],
    reminder: "Skipping or pausing keeps control without another immediate shipment.",
  },
  {
    id: "digestion",
    title: "Not agreeing with my digestion",
    helper: "Adjust the routine and delivery timing first.",
    treatment: "health-fit",
    headline: "Take it slower before deciding",
    body: "Gummies contain fiber, and some customers need time to adjust. Try taking them with food and starting with fewer gummies.",
    ctas: [
      { label: "Update delivery frequency", branch: "cadence" },
      { label: "Skip next order", branch: "skip" },
      { label: "Contact support", branch: "support" },
    ],
    reminder: "A slower routine or support check may help you decide with more confidence.",
  },
  {
    id: "product-issue",
    title: "There's an issue with my gummies",
    helper: "Share details so support can resolve it.",
    treatment: "issue",
    headline: "What type of issue are you seeing?",
    body: "Choose the issue type first so support can route this toward the right resolution.",
    issueFields: true,
    issueOptions: [
      "Melted or sticky gummies",
      "Damaged pouch or packaging",
      "Wrong flavor or item",
      "Missing item in the order",
      "Taste, smell, or texture seems off",
      "Other product issue",
    ],
    ctas: [{ label: "Contact support", branch: "support" }],
    reminder: "Support can review the product issue before final cancellation.",
  },
  {
    id: "fast",
    title: "Orders ship too fast or frequently",
    helper: "Slow deliveries down without cancelling.",
    treatment: "cadence",
    headline: "Slow down your deliveries",
    body: "You can adjust shipment timing so your next order arrives when you actually need it.",
    ctas: [
      { label: "Update delivery frequency", branch: "cadence" },
      { label: "Skip next order", branch: "skip" },
      { label: "Reschedule subscription", branch: "cadence" },
    ],
    reminder: "Frequency controls can solve timing issues without ending the subscription.",
  },
  {
    id: "alternative",
    title: "I found a better alternative or another product",
    helper: "Compare quality and convenience before making the final call.",
    treatment: "comparison",
    headline: "Compare before you leave",
    body: "OMNI is tested for quality, designed for consistency, and built around convenience in a daily routine.",
    ctas: [
      { label: "Learn more", branch: "education" },
      { label: "Get my personalized plan", branch: "plan" },
    ],
    reminder: "A quick comparison may help before you give up member benefits.",
  },
  {
    id: "sugar",
    title: "Too much sugar or too sweet",
    helper: "Try sugar free stick packs instead.",
    treatment: "product-fit",
    headline: "Switch to a sugar free format",
    body: "Electrolyte stick packs are sugar free and support the same daily creatine habit with added hydration support.",
    ctas: [
      { label: "Swap product", branch: "product" },
      { label: "Contact support", branch: "support" },
    ],
    reminder: "A product swap may be a better fit than cancelling the full subscription.",
  },
  {
    id: "editing",
    title: "I'm having trouble editing my subscription",
    helper: "Get help with the portal controls.",
    treatment: "portal-help",
    headline: "Your controls are still here",
    body: "Changing frequency, skipping, pausing, or rescheduling can all happen from the portal.",
    ctas: [
      { label: "Update delivery frequency", branch: "cadence" },
      { label: "Skip next order", branch: "skip" },
      { label: "Pause subscription", branch: "pause" },
    ],
    reminder: "Portal controls can fix most subscription timing issues.",
  },
  {
    id: "other",
    title: "Other reason",
    helper: "Tell us what's missing.",
    treatment: "general",
    headline: "Tell us what is going on",
    body: "Leave a short note or choose a flexible option before you make the final decision.",
    noteField: true,
    ctas: [
      { label: "Contact support", branch: "support" },
      { label: "Pause subscription", branch: "pause" },
      { label: "Skip next order", branch: "skip" },
    ],
    reminder: "Support can review your note before you cancel.",
  },
];

const branchConfig = {
  plan: {
    title: "Personalize your OMNI plan",
    body: "Pick the routine support that best matches your day.",
    options: ["Morning routine", "Workout days", "With meals", "Travel schedule"],
    cta: "Save plan",
  },
  cadence: {
    title: "Update delivery frequency",
    body: "Choose a slower cadence so deliveries match your supply.",
    options: ["Every 4 weeks", "Every 8 weeks", "Every 12 weeks", "Custom date"],
    cta: "Save frequency",
  },
  skip: {
    title: "Skip your next order",
    body: "Keep your subscription active and move the next shipment out.",
    options: ["Skip 1 week", "Skip 2 weeks", "Skip 4 weeks"],
    cta: "Skip next order",
  },
  pause: {
    title: "Pause subscription",
    body: "Take a break while keeping your OMNI member setup active.",
    options: ["Pause 2 weeks", "Pause 4 weeks", "Pause 8 weeks"],
    cta: "Pause subscription",
  },
  savings: {
    title: "Apply member savings",
    body: "Keep your subscription and reduce the next few orders.",
    options: ["50% off next 3 orders", "Skip and keep offer", "Keep current plan"],
    cta: "Apply savings",
  },
  product: {
    title: "Swap product",
    body: "Choose a product direction that may fit your routine better.",
    options: ["Electrolyte stick packs", "Peach gummies", "Watermelon gummies"],
    cta: "Save product swap",
  },
  support: {
    title: "Contact support",
    body: "Send the team the details and keep the subscription open while they help.",
    options: ["Product issue", "Portal help", "Account question"],
    cta: "Contact support",
  },
  education: {
    title: "Learn more about OMNI",
    body: "Review quality, testing, and routine guidance before you decide.",
    options: ["Quality testing", "How to take OMNI", "Routine tips"],
    cta: "Learn more",
  },
};

function CancellationReasonSelect({ selectedReasonId, onSelect, onContinue, onClose }) {
  return (
    <div className="cancel-step">
      <div className="cancel-step-head">
        <span className="cancel-kicker">Cancellation flow</span>
        <h2>Before you cancel, what's the main reason?</h2>
        <p>This helps us show the right option before you make a final decision.</p>
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
  const [selectedIssueType, setSelectedIssueType] = useState("");
  const isIssueFlow = Boolean(reason.issueFields);
  const engineLabel = isIssueFlow ? "Issue resolution route" : "Retention engine match";

  return (
    <div className="cancel-step cancel-save-step">
      <div className="cancel-step-meta">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to reasons</button>
        <span className="cancel-selected-label">{reason.title}</span>
      </div>
      <h2>{reason.headline}</h2>
      <p>{reason.body}</p>

      {reason.offer && <p className="cancel-offer-note">{reason.offer}</p>}

      {isIssueFlow && (
        <>
          <div className="cancel-issue-type-grid" aria-label="Issue type">
            {reason.issueOptions.map((issueType) => (
              <button
                key={issueType}
                type="button"
                className={`cancel-issue-type ${selectedIssueType === issueType ? "selected" : ""}`}
                onClick={() => setSelectedIssueType(issueType)}
              >
                {issueType}
              </button>
            ))}
          </div>

          {selectedIssueType && (
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
                <textarea rows="3" placeholder={`Tell us about: ${selectedIssueType}`} />
              </label>
            </div>
          )}
        </>
      )}

      {reason.noteField && (
        <label className="cancel-note-field">
          Short note
          <textarea rows="3" placeholder="Tell us what is missing" />
        </label>
      )}

      <div className={`cancel-save-card cancel-treatment-${reason.treatment}`}>
        <span className="cancel-kicker">{engineLabel}</span>
        <h3>{reason.ctas[0].label}</h3>
        {isIssueFlow && !selectedIssueType && <p>Select an issue type above to continue with support.</p>}
        <div className="cancel-save-grid">
          {reason.ctas.map((action, index) => (
            <button
              key={`${reason.id}-${action.label}`}
              type="button"
              className={index === 0 ? "cancel-save-primary" : "cancel-save-secondary"}
              disabled={isIssueFlow && !selectedIssueType}
              onClick={() => onAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="cancel-text-link" onClick={onCancel}>
        Continue cancellation
      </button>
    </div>
  );
}

function CancellationBranchScreen({ branch, reason, onBack, onDone, onCancel }) {
  const [choice, setChoice] = useState("");
  const config = branchConfig[branch] || branchConfig.support;

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

      <div className="cancel-flow-actions">
        <Button variant="outline" onClick={onCancel}>Continue cancellation</Button>
        <Button variant="primary" onClick={onDone}>{config.cta}</Button>
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

      <div className="cancel-flow-actions">
        <Button variant="outline" onClick={onKeep}>Keep subscription</Button>
        <Button variant="primary" onClick={onConfirm}>Confirm cancellation</Button>
      </div>
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

export default function CancellationFlow({ open, onClose, onKept }) {
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [step, setStep] = useState("reason");
  const [branch, setBranch] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const selectedReason = useMemo(
    () => reasonConfig.find((reason) => reason.id === selectedReasonId),
    [selectedReasonId]
  );

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const closeFlow = () => {
    setSelectedReasonId("");
    setStep("reason");
    setBranch("");
    setSubmitted(false);
    onClose();
  };

  const handleBackdrop = () => {
    if (step === "reason" && !submitted) closeFlow();
  };

  const handleAction = (action) => {
    setBranch(action.branch || "support");
    setStep("branch");
  };

  const keepSubscription = () => {
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

        {!submitted && step === "reason" && (
          <CancellationReasonSelect
            selectedReasonId={selectedReasonId}
            onSelect={setSelectedReasonId}
            onContinue={() => setStep("save")}
            onClose={closeFlow}
          />
        )}
        {!submitted && step === "save" && selectedReason && (
          <CancellationSavePage
            reason={selectedReason}
            onBack={() => setStep("reason")}
            onAction={handleAction}
            onCancel={() => setStep("confirm")}
          />
        )}
        {!submitted && step === "branch" && selectedReason && (
          <CancellationBranchScreen
            branch={branch}
            reason={selectedReason}
            onBack={() => setStep("save")}
            onDone={keepSubscription}
            onCancel={() => setStep("confirm")}
          />
        )}
        {!submitted && step === "confirm" && selectedReason && (
          <CancellationFinalConfirm
            reason={selectedReason}
            onBack={() => setStep("save")}
            onKeep={keepSubscription}
            onConfirm={() => setSubmitted(true)}
          />
        )}
        {submitted && <CancellationCompleteScreen onDone={closeFlow} />}
      </section>
    </div>
  );
}
