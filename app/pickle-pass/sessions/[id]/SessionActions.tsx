"use client";

import Link from "next/link";

export default function SessionActions({
  bookHref,
  waitlistHref,
}: {
  bookHref: string;          // ✅ REQUIRED
  waitlistHref?: string;
}) {
  if (!bookHref) {
    // ✅ prevents runtime crash if a page forgets to pass bookHref
    return (
      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
        Missing <code>bookHref</code> for SessionActions.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <Link
        href={bookHref}
        style={{
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.18)",
          padding: "12px 14px",
          fontSize: 14,
          fontWeight: 700,
          background: "rgba(255,255,255,0.18)",
          color: "white",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Book this session
      </Link>

      <Link
        href={waitlistHref ?? "#"}
        style={{
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.18)",
          padding: "12px 14px",
          fontSize: 14,
          fontWeight: 700,
          background: "rgba(0,0,0,0.35)",
          color: "white",
          textDecoration: "none",
          display: "inline-block",
          opacity: waitlistHref ? 1 : 0.6,
          pointerEvents: waitlistHref ? "auto" : "none",
        }}
        aria-disabled={!waitlistHref}
      >
        Join waitlist
      </Link>
    </div>
  );
}
