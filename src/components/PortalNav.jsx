import React from "react";

const navItems = [
  { id: "home", label: "Home" },
  { id: "orders", label: "Order History" },
  { id: "refer", label: "Refer a Friend" },
  { id: "manage", label: "Manage Subscriptions" },
  { id: "account", label: "Account" },
];

export default function PortalNav({ activeView, onNavigate, onLogout }) {
  return (
    <aside className="portal-side-nav" aria-label="Portal navigation">
      {navItems.map((item) => (
        <a
          key={item.id}
          className={activeView === item.id ? "active" : ""}
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onNavigate(item.id);
          }}
        >
          {item.label}
        </a>
      ))}
      <a
        href="#"
        onClick={(event) => {
          event.preventDefault();
          onLogout();
        }}
      >
        Log out
      </a>
    </aside>
  );
}
