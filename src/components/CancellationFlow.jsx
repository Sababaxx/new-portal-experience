import React, { useMemo, useState } from "react";
import Button from "./Button.jsx";

const reasons = [
  {
    id: "fast",
    title: "Orders ship too fast/frequently",
    helper: "Adjust timing so your next pouch arrives when you actually need it.",
    type: "cadence",
    headline: "Slow down your deliveries instead",
    body: "Keep your OMNI routine active and give yourself more space between shipments.",
    primary: "Move to 8 weeks",
    secondary: "Move to 12 weeks",
    extra: "Skip next order",
    reminder: "You can slow deliveries down without losing subscription access.",
  },
  {
    id: "too-much",
    title: "I have too much product",
    helper: "Skip or slow down delivery without losing your subscription.",
    type: "overstock",
    headline: "Keep it active, just pause the flow",
    body: "If you have enough gummies right now, you can skip, pause, or change cadence.",
    primary: "Skip next order",
    secondary: "Pause subscription",
    extra: "Change cadence",
    reminder: "Skipping or pausing gives you time to use what you already have.",
  },
  {
    id: "issue",
    title: "There's an issue with my gummies",
    helper: "Let support help before you cancel.",
    type: "support",
    headline: "Let us fix the issue first",
    body: "Tell support what happened with your gummies so the team can help before you leave.",
    primary: "Contact support",
    secondary: "Keep subscription active",
    extra: "Continue to cancel",
    reminder: "Support can review product issues before you make a final cancellation.",
  },
  {
    id: "editing",
    title: "I'm having trouble editing my subscription",
    helper: "Get help with the portal controls.",
    type: "portal-help",
    headline: "Subscription controls are all in one place",
    body: "Most timing, flavor, skip, pause, and product changes can happen from this portal.",
    primary: "Go to subscription controls",
    secondary: "Contact support",
    extra: "Continue to cancel",
    reminder: "You can get help with portal controls before ending the subscription.",
  },
  {
    id: "sugar",
    title: "Too much sugar",
    helper: "Explore a better fit before canceling.",
    type: "product-fit",
    headline: "Try a better fit before canceling",
    body: "If gummies are not the right fit, another OMNI product direction may work better.",
    primary: "Explore OMNI Electrolytes",
    secondary: "Pause subscription",
    extra: "Continue to cancel",
    reminder: "A product-fit change may be better than canceling the whole account.",
  },
  {
    id: "expensive",
    title: "It's too expensive",
    helper: "Check member savings before leaving.",
    type: "savings",
    headline: "Unlock member savings before you leave",
    body: "Review available member savings before canceling your recurring OMNI order.",
    primary: "Apply savings",
    secondary: "Keep current plan",
    extra: "Continue to cancel",
    reminder: "Savings may lower the cost of keeping your subscription active.",
  },
  {
    id: "retail",
    title: "I decided to purchase in retail",
    helper: "Keep portal control if online timing works better later.",
    type: "retail",
    headline: "Keep your online control active",
    body: "If you are buying in store for now, pause or skip online deliveries without losing your portal setup.",
    primary: "Pause subscription",
    secondary: "Skip next order",
    extra: "Continue to cancel",
    reminder: "A pause keeps online subscription control ready if retail timing changes.",
  },
  {
    id: "alternative",
    title: "I found a better alternative / another product",
    helper: "Compare options before making the final call.",
    type: "comparison",
    headline: "Keep your benefits while you decide",
    body: "You can keep member savings or pause while you compare products.",
    primary: "Apply savings",
    secondary: "Pause subscription",
    extra: "Continue to cancel",
    reminder: "Pausing keeps your account benefits available while you compare.",
  },
  {
    id: "stomach",
    title: "Upset stomach or other body complications",
    helper: "Pause and get support instead of canceling immediately.",
    type: "health",
    headline: "Pause and get support first",
    body: "Take a break from shipments and contact support before deciding what to do next.",
    primary: "Pause subscription",
    secondary: "Contact support",
    extra: "Continue to cancel",
    reminder: "Pausing gives you time to evaluate fit before final cancellation.",
  },
  {
    id: "taste",
    title: "I don't like taste of the gummies",
    helper: "Try a different flavor or product direction.",
    type: "flavor",
    headline: "Switch the flavor before leaving",
    body: "A different flavor or product format may be a better fit for your OMNI routine.",
    primary: "Swap flavor",
    secondary: "Pause subscription",
    extra: "Continue to cancel",
    reminder: "A flavor swap may solve the issue without ending the subscription.",
  },
  {
    id: "other",
    title: "Other reason",
    helper: "Tell us what's missing.",
    type: "general",
    headline: "Let us help before you cancel",
    body: "If something else is missing, support can help review your account before you make the final call.",
    primary: "Contact support",
    secondary: "Pause subscription",
    extra: "Continue to cancel",
    reminder: "Support can help with account-specific issues before cancellation.",
  },
];

function branchForAction(reason, action) {
  if (["Move to 8 weeks", "Move to 12 weeks", "Change cadence", "Skip next order"].includes(action)) return "cadence";
  if (action === "Pause subscription") return "pause";
  if (["Apply savings", "Keep current plan"].includes(action)) return "savings";
  if (["Contact support", "Keep subscription active", "Go to subscription controls"].includes(action)) return "support";
  if (["Explore OMNI Electrolytes", "Swap flavor"].includes(action)) return "product";
  if (reason.type === "health") return "support";
  return null;
}

function CancellationReasonScreen({ selectedReasonId, onSelect, onContinue, onClose }) {
  return (
    <div className="cancel-step">
      <div className="cancel-step-head">
        <span className="cancel-kicker">Cancellation flow</span>
        <h2>Before you cancel, what's the main reason?</h2>
        <p>This helps us show the right option before you make a final decision.</p>
      </div>

      <div className="cancel-reason-list">
        {reasons.map((reason) => (
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

function CancellationSaveScreen({ reason, onBack, onAction, onCancel }) {
  const actions = [reason.primary, reason.secondary, reason.extra].filter(Boolean);

  return (
    <div className="cancel-step cancel-save-step">
      <div className="cancel-step-meta">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to reasons</button>
        <span className="cancel-selected-label">{reason.title}</span>
      </div>
      <h2>{reason.headline}</h2>
      <p>{reason.body}</p>

      <div className="cancel-save-card">
        <span className="cancel-kicker">Recommended next step</span>
        <h3>{reason.primary}</h3>
        <p>{reason.helper}</p>
        <div className="cancel-save-grid">
          {actions.map((action, index) => (
            <button
              key={action}
              type="button"
              className={index === 0 ? "cancel-save-primary" : "cancel-save-secondary"}
              onClick={() => (action === "Continue to cancel" ? onCancel() : onAction(action))}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="cancel-text-link" onClick={onCancel}>Still want to cancel</button>
    </div>
  );
}

function CancellationBranchScreen({ branch, reason, onBack, onDone, onCancel }) {
  const [choice, setChoice] = useState("");
  const branchConfig = {
    cadence: {
      title: "Choose a new cadence",
      body: "Slow deliveries down so your next order arrives when you need it.",
      options: ["Every 4 weeks", "Every 8 weeks", "Every 12 weeks", "Custom date"],
      cta: "Save cadence",
    },
    pause: {
      title: "Pause your subscription",
      body: "Take a short break while keeping your OMNI subscription active.",
      options: ["Pause 2 weeks", "Pause 4 weeks", "Pause 8 weeks"],
      cta: "Pause subscription",
    },
    savings: {
      title: "Apply member savings",
      body: "Keep your routine and review available subscription savings before leaving.",
      options: ["Member savings", "Up to 47% off"],
      cta: "Apply savings",
    },
    support: {
      title: "Contact support",
      body: "Send support a short note so the team can help with your account or product issue.",
      options: ["Product issue", "Portal help", "Account question"],
      cta: "Contact support",
    },
    product: {
      title: "Find a better product fit",
      body: "Try a different flavor or product direction before canceling.",
      options: ["Swap flavor", "Explore Electrolytes"],
      cta: choice || "Choose option",
    },
  }[branch];

  return (
    <div className="cancel-step">
      <div className="cancel-step-meta">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to offer</button>
        <span className="cancel-selected-label">{reason.title}</span>
      </div>
      <h2>{branchConfig.title}</h2>
      <p>{branchConfig.body}</p>

      <div className="cancel-branch-card">
        {branchConfig.options.map((option) => (
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
        <Button variant="outline" onClick={onCancel}>Continue to cancel</Button>
        <Button variant="primary" onClick={onDone}>{branchConfig.cta}</Button>
      </div>
    </div>
  );
}

function CancellationConfirmScreen({ reason, onBack, onKeep, onConfirm }) {
  return (
    <div className="cancel-step cancel-confirm-step">
      <div className="cancel-step-meta">
        <button type="button" className="cancel-back-link" onClick={onBack}>Back to offer</button>
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
    () => reasons.find((reason) => reason.id === selectedReasonId),
    [selectedReasonId]
  );

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
    const nextBranch = branchForAction(selectedReason, action);
    if (nextBranch) {
      setBranch(nextBranch);
      setStep("branch");
      return;
    }
    closeFlow();
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
          <CancellationReasonScreen
            selectedReasonId={selectedReasonId}
            onSelect={setSelectedReasonId}
            onContinue={() => setStep("save")}
            onClose={closeFlow}
          />
        )}
        {!submitted && step === "save" && selectedReason && (
          <CancellationSaveScreen
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
          <CancellationConfirmScreen
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
