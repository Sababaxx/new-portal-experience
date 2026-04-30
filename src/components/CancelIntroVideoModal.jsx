import React, { useState } from "react";
import Button from "./Button.jsx";
import { subscription } from "../data/subscription.js";

const skipOptions = ["Skip 1 week", "Skip 2 weeks", "Skip 4 weeks"];
const founderVideoSrc = "/assets/omni-founder-message.mp4";

export default function CancelIntroVideoModal({ open, onClose, onContinue, onSkipNextOrder }) {
  const [selectedSkip, setSelectedSkip] = useState(skipOptions[0]);

  if (!open) return null;

  return (
    <div className="cancel-intro-backdrop" role="presentation" onClick={onClose}>
      <section
        className="cancel-intro-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-intro-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="cancel-intro-close" type="button" aria-label="Close" onClick={onClose}>×</button>

        <div className="cancel-intro-copy">
          <span>Before you cancel</span>
          <h2 id="cancel-intro-title">A quick note from OMNI</h2>
          <p>Watch this short founder message, or skip the next order and keep your member setup active.</p>
        </div>

        <div className="cancel-intro-plan">
          <img src="/assets/omni-product-peach.png" alt="" />
          <div>
            <strong>Every 4 weeks</strong>
            <span>Next on {subscription.nextOrderDate.replace(", 2026", "")}</span>
          </div>
          <strong>${subscription.total.toFixed(2)}</strong>
        </div>

        <video
          className="cancel-intro-video"
          controls
          playsInline
          preload="metadata"
          poster="/assets/omni-product-peach.png"
        >
          <source src={founderVideoSrc} type="video/mp4" />
        </video>

        <div className="cancel-intro-options" aria-label="Skip options">
          {skipOptions.map((option) => (
            <label className={`cancel-intro-option ${selectedSkip === option ? "selected" : ""}`} key={option}>
              <input
                type="radio"
                name="cancel-intro-skip"
                value={option}
                checked={selectedSkip === option}
                onChange={() => setSelectedSkip(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="cancel-intro-actions">
          <Button variant="outline" onClick={onContinue}>Continue to cancellation</Button>
          <Button variant="primary" onClick={() => onSkipNextOrder(selectedSkip)}>Skip next order</Button>
        </div>
      </section>
    </div>
  );
}
