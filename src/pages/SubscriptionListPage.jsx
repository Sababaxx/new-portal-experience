import React from "react";
import Button from "../components/Button.jsx";
import PortalNav from "../components/PortalNav.jsx";
import PortalOfferStack from "../components/PortalOfferStack.jsx";
import { subscription } from "../data/subscription.js";

function SubscriptionListPage({ activeView = "home", onNavigate, onOpen, onAddNew, onLogout }) {
  return (
    <div className="portal-shell portal-shell-dashboard">
      <div className="portal-layout">
        <PortalNav activeView={activeView} onNavigate={onNavigate} onLogout={onLogout} />

        <main className="portal-main">
          <section className="home-card" aria-label="Account overview">
            <div className="home-topline">
              <div className="member-greeting">
                <h1>Hello, Saba</h1>
                <span>Logged in as buy@omnicreatine.com</span>
                <p>Thank you for being a member since January 2026!</p>
              </div>
              <div className="home-quick-actions" aria-label="Home quick actions">
                <Button variant="primary" onClick={onOpen}>Manage subscription</Button>
                <Button variant="outline" onClick={onAddNew}>Add product</Button>
              </div>
            </div>

            <div className="account-summary-strip">
              <div>
                <span className="mini-label">Active subscription</span>
                <strong>Next order: {subscription.nextOrderDate}</strong>
              </div>
              <div>
                <span className="mini-label">Current plan</span>
                <strong>{subscription.frequency.replace("Deliver ", "")}</strong>
              </div>
              <div>
                <span className="mini-label">Order value</span>
                <strong>${subscription.total.toFixed(2)} + ${subscription.shippingPerDelivery.toFixed(2)} shipping</strong>
              </div>
              <div>
                <span className="mini-label">Member savings</span>
                <strong>$80 saved this cycle</strong>
              </div>
            </div>

            <div className="home-command-card">
              <div>
                <span className="mini-label">Next OMNI order</span>
                <h2>Ships {subscription.nextOrderDate}</h2>
                <p>Three pouches are queued for your next delivery. You can adjust timing or edit products from Manage Subscriptions.</p>
              </div>
              <Button variant="outline" onClick={onOpen}>Open details</Button>
            </div>

            <div className="home-offer-heading">
              <span className="mini-label">Member offers</span>
              <h2>Fresh ways to upgrade your next order</h2>
            </div>

            <PortalOfferStack showIntro={false} variant="home" />
          </section>
        </main>
      </div>
    </div>
  );
}

SubscriptionListPage.Nav = PortalNav;

export default SubscriptionListPage;
