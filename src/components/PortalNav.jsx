import React, { useEffect, useRef } from "react";

const navItems = [
  { id: "home", label: "Home" },
  { id: "orders", label: "Order History" },
  { id: "refer", label: "Refer a Friend" },
  { id: "manage", label: "Manage Subscriptions" },
  { id: "account", label: "Account" },
];

export default function PortalNav({ activeView, onNavigate, onLogout }) {
  const itemRefs = useRef({});

  useEffect(() => {
    const activeItem = itemRefs.current[activeView];
    activeItem?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeView]);

  return (
    <aside className="portal-side-nav" aria-label="Portal navigation">
      {navItems.map((item) => (
        <a
          key={item.id}
          ref={(node) => {
            itemRefs.current[item.id] = node;
          }}
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
