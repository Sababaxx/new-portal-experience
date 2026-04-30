import React from "react";
import Button from "../components/Button.jsx";

const details = [
  { title: "Name", body: "Saba Bakhtadze" },
  { title: "Email", body: "buy@omnicreatine.com", href: "mailto:buy@omnicreatine.com" },
  { title: "Shipping address", body: "595 North Main street\nHiawassee, Georgia 30546\nUnited States" },
  { title: "Payment method", body: "Card ending in 6047\nExpires 11/26" },
];

export default function AccountPage({ onOpenModal }) {
  return (
    <section className="portal-page-panel" aria-label="Account details">
      <div className="portal-page-head">
        <h1>Account</h1>
        <p>Manage profile, shipping, and payment details for this OMNI account.</p>
      </div>

      <div className="account-detail-grid">
        {details.map((item) => (
          <article className="portal-info-card account-detail-card" key={item.title}>
            <div>
              <span className="mini-label">{item.title}</span>
              {item.href ? <a href={item.href}>{item.body}</a> : <p>{item.body}</p>}
            </div>
            <Button variant="outline" onClick={() => onOpenModal(`Edit ${item.title.toLowerCase()}`)}>Edit</Button>
          </article>
        ))}
      </div>
    </section>
  );
}
