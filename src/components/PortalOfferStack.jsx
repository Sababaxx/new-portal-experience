import React, { useState } from "react";
import ActionModal from "./ActionModal.jsx";
import PortalOfferBlock from "./PortalOfferBlock.jsx";

const offers = [
  {
    id: "stack",
    imageUrl: "/assets/omni-static-1.png",
    alt: "OMNI Creatine Gummies and Electrolytes stack offer",
    modalTitle: "Try the stack",
    actionLabel: "Add stack",
    offerCopy: {
      eyebrow: "Gummies + electrolytes",
      image: "/assets/omni-static-1.png",
      imageAlt: "OMNI Creatine Gummies with OMNI Creatine and Electrolytes",
      body: "Add OMNI Creatine Gummies and OMNI Creatine + Electrolytes stick packs to your next shipment. This stack is built for a simple daily routine: creatine support from the gummies, hydration support from electrolytes, and one delivery instead of a separate reorder.",
      bullets: ["Includes peach creatine gummies", "Adds pear electrolyte stick packs", "Ships with your next subscription order"],
      note: "Prototype only: final pricing, flavor selection, and inventory rules can be connected later.",
    },
    hotspot: { left: "60.5%", top: "50.7%", width: "13.7%", height: "9.8%" },
    variant: "hero",
  },
  {
    id: "upgrade",
    imageUrl: "/assets/omni-offer-2.png",
    alt: "Save 30 percent every month OMNI subscription upgrade offer",
    modalTitle: "Upgrade order",
    actionLabel: "Upgrade order",
    offerCopy: {
      eyebrow: "Subscription upgrade",
      image: "/assets/omni-offer-2.png",
      imageAlt: "Three OMNI Creatine Gummies pouches subscription offer",
      body: "Upgrade your next OMNI delivery to a larger subscription supply and keep creatine gummies stocked without coming back to reorder each time. This offer is designed for members who want a consistent routine and better subscription value.",
      bullets: ["Save 30% on the upgraded subscription offer", "Three pouches queued for recurring delivery", "Cancel or adjust from Manage Subscriptions"],
      note: "Your current next order date stays in place unless you choose to change it.",
    },
    hotspot: { left: "61.5%", top: "70.0%", width: "24.0%", height: "12.0%" },
    variant: "campaign",
  },
];

const homeOffers = [
  {
    id: "home-upgrade",
    imageUrl: "/assets/omni-home-upgrade.jpg",
    alt: "Save 30 percent every month OMNI subscription upgrade offer",
    modalTitle: "Upgrade order",
    actionLabel: "Upgrade order",
    offerCopy: {
      eyebrow: "Member savings",
      image: "/assets/omni-offer-2.png",
      imageAlt: "OMNI Creatine Gummies subscription upgrade offer",
      body: "Move your next delivery into the OMNI subscription upgrade and save on a larger recurring supply. It is the cleanest option if creatine gummies are already part of your daily routine.",
      bullets: ["Save 30% every month", "Keep gummies stocked on schedule", "Edit, skip, or cancel from the portal"],
      note: "This prototype would update the next order after confirmation.",
    },
    hotspot: { left: "63.7%", top: "60.7%", width: "29.8%", height: "7.0%" },
    variant: "hero",
    isAnimated: false,
  },
  {
    id: "home-body-needs",
    imageUrl: "/assets/omni-home-body-needs.jpg",
    alt: "Your body needs creatine OMNI makes it easy offer",
    modalTitle: "Try OMNI today",
    actionLabel: "Add gummies",
    offerCopy: {
      eyebrow: "Daily creatine gummies",
      image: "/assets/omni-product-peach.png",
      imageAlt: "OMNI Creatine Monohydrate Gummies peach pouch",
      body: "Add one pouch of OMNI Creatine Monohydrate Gummies to your next order. No scoops, no shaker, no messy powder; just a simple gummy format for a consistent creatine routine.",
      bullets: ["Choose peach or watermelon", "30 servings per pouch", "Designed for daily strength, performance, and consistency"],
      note: "Flavor choice can be wired into the final add-product flow.",
    },
    hotspot: { left: "2.4%", top: "83.2%", width: "29.5%", height: "7.6%" },
    variant: "campaign",
    isAnimated: true,
    animationDelay: ".12s",
  },
  {
    id: "home-stack",
    imageUrl: "/assets/omni-home-stack.jpg",
    alt: "OMNI Creatine Gummies and Electrolytes stack offer",
    modalTitle: "Try the stack",
    actionLabel: "Add stack",
    offerCopy: {
      eyebrow: "New routine stack",
      image: "/assets/omni-static-1.png",
      imageAlt: "OMNI Creatine Gummies and Electrolytes stack",
      body: "Pair OMNI Creatine Gummies with OMNI Creatine + Electrolytes for a next-order stack focused on consistency and hydration. It is a practical add-on for members who want the gummy routine plus stick packs in the same delivery.",
      bullets: ["Creatine gummies for daily use", "Electrolyte stick packs for hydration support", "Ships together with your next OMNI order"],
      note: "Final checkout can confirm flavor, quantity, and exact add-on price.",
    },
    hotspot: { left: "67.7%", top: "39.3%", width: "29.7%", height: "7.3%" },
    variant: "campaign",
    isAnimated: true,
    animationDelay: ".28s",
  },
];

export default function PortalOfferStack({
  customerName = "Debbie",
  email = "buy@omnicreatine.com",
  memberSince = "January 2026",
  showIntro = true,
  compact = false,
  variant = "manage",
}) {
  const [activeOffer, setActiveOffer] = useState(null);
  const activeOffers = variant === "home" ? homeOffers : offers;

  const renderOfferCopy = (offer) => (
    <div className="offer-modal-copy">
      {offer.offerCopy.image && (
        <div className="offer-modal-image">
          <img src={offer.offerCopy.image} alt={offer.offerCopy.imageAlt} />
        </div>
      )}
      <span className="modal-eyebrow">{offer.offerCopy.eyebrow}</span>
      <p>{offer.offerCopy.body}</p>
      <ul>
        {offer.offerCopy.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="modal-note">{offer.offerCopy.note}</p>
    </div>
  );

  return (
    <section className={`portal-offer-panel portal-offer-panel-${variant} ${compact ? "portal-offer-panel-compact" : ""}`} aria-label="Member offer blocks">
      {showIntro && (
        <div className="portal-offer-intro">
          <h2>
            Hello, {customerName}
            <span> logged in as {email}</span>
          </h2>
          <p>Thank you for being a member since {memberSince}!</p>
        </div>
      )}

      <div className="portal-offer-stack">
        {activeOffers.map((offer, index) => (
          <PortalOfferBlock
            key={offer.id}
            {...offer}
            isAnimated={offer.isAnimated ?? index === 0}
            onOpen={() => setActiveOffer(offer)}
          />
        ))}
      </div>

      {activeOffer && (
        <ActionModal title={activeOffer.modalTitle} onClose={() => setActiveOffer(null)} actionLabel={activeOffer.actionLabel}>
          {renderOfferCopy(activeOffer)}
        </ActionModal>
      )}
    </section>
  );
}
