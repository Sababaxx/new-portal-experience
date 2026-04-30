import React from "react";

/**
 * Status pill used for subscription status & "Free" callouts.
 * kind: "active" | "free"
 */
export default function Badge({ kind = "active", children }) {
  return <span className={`badge badge-${kind}`}>{children}</span>;
}
