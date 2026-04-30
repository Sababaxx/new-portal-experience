import React, { useState } from "react";
import ActionModal from "../components/ActionModal.jsx";
import Button from "../components/Button.jsx";
import CancelIntroVideoModal from "../components/CancelIntroVideoModal.jsx";
import CancellationFlow from "../components/CancellationFlow.jsx";
import PortalNav from "../components/PortalNav.jsx";
import PortalOfferStack from "../components/PortalOfferStack.jsx";
import ProductWorkspace from "../components/ProductWorkspace.jsx";
import { ChevronLeft } from "../components/Icons.jsx";
import { subscription } from "../data/subscription.js";

export default function SubscriptionDetailPage({ activeView = "manage", onNavigate, onLogout, onBack }) {
  const sub = subscription;
  const [modal, setModal] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isCancelIntroOpen, setIsCancelIntroOpen] = useState(false);
  const [isCancellationOpen, setIsCancellationOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const openModal = (title) => {
    setMoreOpen(false);
    setModal(title);
  };

  const openCancelIntro = () => {
    setMoreOpen(false);
    setIsCancelIntroOpen(true);
  };

  const continueToCancellationFlow = () => {
    setIsCancelIntroOpen(false);
    setIsCancellationOpen(true);
  };

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2600);
  };

  return (
    <div className="portal-shell portal-shell-dashboard">
      <div className="portal-layout detail-layout">
        <PortalNav activeView={activeView} onNavigate={onNavigate} onLogout={onLogout} />

        <main className="portal-main">
          <section className="manage-hero" aria-label="Subscription controls">
            <div className="manage-title-area">
              <Button variant="outline" size="sm" className="back-btn" onClick={onBack}>
                <ChevronLeft /> Back
              </Button>
              <h1>Every 4 weeks</h1>
              <p><strong>${sub.total.toFixed(2)}</strong> · <span>Next on {sub.nextOrderDate.replace(", 2026", "")}</span></p>
            </div>

            <div className="manage-action-row">
              <Button variant="primary" onClick={() => openModal("Order now")}>Order now</Button>
              <Button variant="outline" onClick={() => openModal("Change next order date")}>Next order date</Button>
              <Button variant="outline" onClick={() => openModal("Skip next order")}>Skip</Button>
              <div className="more-menu-wrap">
                <Button variant="outline" onClick={() => setMoreOpen((open) => !open)}>More</Button>
                {moreOpen && (
                  <div className="more-menu">
                    <button type="button" onClick={() => openModal("Pause subscription")}>Pause subscription</button>
                    <button type="button" onClick={openCancelIntro}>Cancel subscription</button>
                    <button type="button" onClick={() => openModal("Manage payment")}>Manage payment</button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="manage-offers-card" aria-label="Featured subscription offers">
            <PortalOfferStack showIntro={false} compact />
          </section>

          <ProductWorkspace />
        </main>
      </div>

      {modal && (
        <ActionModal title={modal} onClose={() => setModal(null)}>
          {modal === "Order now" && <p>Your next OMNI order is ready to process today. This would charge the saved payment method and move the queued gummies into fulfillment.</p>}
          {modal === "Change next order date" && (
            <>
              <p>Choose a new delivery date for the next OMNI shipment. Your products and subscription frequency stay the same.</p>
              <div className="modal-option-row"><button type="button">May 15</button><button type="button">May 22</button><button type="button">May 29</button></div>
            </>
          )}
          {modal === "Skip next order" && <p>Skip the upcoming OMNI shipment and keep the subscription active for the following cycle. Your current products remain saved.</p>}
          {modal === "Pause subscription" && (
            <>
              <p>Pause deliveries for a short break without canceling your OMNI subscription. Pick a pause length for this prototype flow.</p>
              <div className="modal-option-row"><button type="button">2 weeks</button><button type="button">4 weeks</button><button type="button">8 weeks</button></div>
            </>
          )}
          {modal === "Manage payment" && <p>Update the saved payment method for future OMNI orders. No card changes are made in this prototype.</p>}
        </ActionModal>
      )}
      <CancelIntroVideoModal
        open={isCancelIntroOpen}
        onClose={() => setIsCancelIntroOpen(false)}
        onContinue={continueToCancellationFlow}
        onSkipNextOrder={(choice) => {
          setIsCancelIntroOpen(false);
          showToast(`${choice} selected. Next order stays controlled in this prototype.`);
        }}
      />
      <CancellationFlow
        open={isCancellationOpen}
        onClose={() => setIsCancellationOpen(false)}
        onKept={() => showToast("Subscription kept active.")}
      />
      {toastMessage && <div className="portal-toast" role="status">{toastMessage}</div>}
    </div>
  );
}
