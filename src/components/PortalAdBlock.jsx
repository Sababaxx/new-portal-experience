import React, { useState, useEffect } from "react";
import Button from "./Button.jsx";

/**
 * PortalAdBlock — Reusable retention/upsell advertisement component for portal pages.
 * Inspired by Grüns portal advertising strategy.
 * 
 * Props:
 *   variant: "banner" (overlay text on image) | "split" (image + copy side by side)
 *   headline: main offer text (e.g., "Unlock up to 47% off")
 *   subtitle: supporting text
 *   ctaText: call-to-action button label
 *   smallNote: small disclaimer below CTA
 *   imageUrl: (optional) image URL; uses placeholder if missing
 *   onCtaClick: callback for CTA button
 */
export default function PortalAdBlock({
  variant = "banner",
  headline = "Unlock up to 47% off",
  subtitle = "Members get access to exclusive OMNI offers, gifts, and next order perks.",
  ctaText = "View offer",
  smallNote = "Available for active subscribers.",
  imageUrl,
  onCtaClick,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Trigger expand animation on mount
    const timer = setTimeout(() => setIsExpanded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (variant === "banner") {
    return (
      <div className={`portal-ad-block banner-variant ${isExpanded ? "expanded" : ""}`}>
        {/* Image placeholder or provided image */}
        <div className="ad-image-container">
          {imageUrl ? (
            <img src={imageUrl} alt="OMNI exclusive offer" />
          ) : (
            <div className="ad-image-placeholder">
              <span className="placeholder-text">OMNI Exclusive Offer</span>
            </div>
          )}
        </div>

        {/* Overlay text */}
        <div className="ad-overlay">
          <h2 className="ad-headline">{headline}</h2>
          <p className="ad-subtitle">{subtitle}</p>
          <Button variant="primary" onClick={onCtaClick} className="ad-cta">
            {ctaText}
          </Button>
          {smallNote && <p className="ad-note">{smallNote}</p>}
        </div>
      </div>
    );
  }

  if (variant === "split") {
    return (
      <div className={`portal-ad-block split-variant ${isExpanded ? "expanded" : ""}`}>
        {/* Image on left */}
        <div className="ad-image-container">
          {imageUrl ? (
            <img src={imageUrl} alt="OMNI exclusive offer" />
          ) : (
            <div className="ad-image-placeholder">
              <span className="placeholder-text">OMNI Offer Image</span>
            </div>
          )}
        </div>

        {/* Copy on right */}
        <div className="ad-content">
          <h2 className="ad-headline">{headline}</h2>
          <p className="ad-subtitle">{subtitle}</p>
          <Button variant="primary" onClick={onCtaClick} className="ad-cta">
            {ctaText}
          </Button>
          {smallNote && <p className="ad-note">{smallNote}</p>}
        </div>
      </div>
    );
  }

  return null;
}
