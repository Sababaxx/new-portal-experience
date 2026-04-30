import React from "react";

export default function ActionModal({ title, children, onClose, actionLabel = "Continue" }) {
  if (!title) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="action-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close popup">
          ×
        </button>
        <h3 id="action-modal-title">{title}</h3>
        <div className="modal-body">
          {children || (
            <p>
              This prototype action is ready for the next step. Final pricing, inventory, and account rules can be connected
              when the subscription backend is available.
            </p>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="button" onClick={onClose}>{actionLabel}</button>
        </div>
      </div>
    </div>
  );
}
