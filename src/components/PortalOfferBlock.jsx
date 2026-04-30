import React from "react";

export default function PortalOfferBlock({ imageUrl, alt, hotspot, onOpen, isAnimated = false, animationDelay = "0s", variant = "hero" }) {
  return (
    <div className={`portal-offer-block portal-offer-${variant} ${isAnimated ? "animated" : ""}`} style={{ animationDelay }}>
      <div className="portal-offer-media">
        <img className="portal-offer-image" src={imageUrl} alt={alt} draggable="false" />
        {hotspot && (
          <button
            type="button"
            className="offer-hotspot"
            aria-label="Open offer"
            style={{
              left: hotspot.left,
              top: hotspot.top,
              width: hotspot.width,
              height: hotspot.height,
            }}
            onClick={onOpen}
          />
        )}
      </div>
    </div>
  );
}
