"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type GuestBooking = {
  bookingId: string;
  sessionId: string;
  facilitySlug?: string;
  guestName: string;
  guestEmail: string;
  createdAtISO: string;
  amountCents: number;
  currency: string;
};

function safeReadBookings(): GuestBooking[] {
  try {
    const raw = localStorage.getItem("pp_guest_bookings");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteBookings(bookings: GuestBooking[]) {
  localStorage.setItem("pp_guest_bookings", JSON.stringify(bookings));
}

function money(amountCents: number, currency = "USD") {
  const dollars = amountCents / 100;
  return dollars.toLocaleString(undefined, { style: "currency", currency });
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 13, opacity: 0.9, marginTop: 10 }}>
      {label}
      <div style={{ marginTop: 6 }}>{children}</div>
    </label>
  );
}

export default function GuestBookingForm({
  sessionId,
  facilitySlug,
  priceCents,
  currency = "USD",
  detailsHref,
}: {
  sessionId: string;
  facilitySlug?: string;
  priceCents: number;
  currency?: string;
  detailsHref: string;
}) {
  const bookingId = useMemo(() => crypto.randomUUID(), []);
  const [step, setStep] = useState<"info" | "confirm" | "paid">("info");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function normalizeEmail(v: string) {
    return v.trim().toLowerCase();
  }

  function goToConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!guestName.trim()) return setError("Please enter your name.");
    if (!guestEmail.trim()) return setError("Please enter your email.");

    setStep("confirm");
  }

  async function confirmAndPayMock() {
    setBusy(true);
    setError(null);

    try {
      const email = normalizeEmail(guestEmail);

      const existing = safeReadBookings();
      const already = existing.some((b) => b.sessionId === sessionId && b.guestEmail === email);
      if (already) throw new Error("You already booked this session with that email.");

      const booking: GuestBooking = {
        bookingId,
        sessionId,
        facilitySlug,
        guestName: guestName.trim(),
        guestEmail: email,
        createdAtISO: new Date().toISOString(),
        amountCents: priceCents,
        currency,
      };

      safeWriteBookings([booking, ...existing]);

      setStep("paid");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 14,
    background: "rgba(255,255,255,0.05)",
  };

  /* ---------------- CONFIRM STEP ---------------- */
  if (step === "confirm") {
    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 16 }}>Confirm Pickle Pass booking</h2>
          <button
            type="button"
            onClick={() => setStep("info")}
            style={{
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              padding: "8px 10px",
              fontSize: 13,
              fontWeight: 800,
              background: "rgba(0,0,0,0.35)",
              color: "white",
              cursor: "pointer",
            }}
          >
            ← Edit
          </button>
        </div>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
  {/* Row helper style */}
  {(() => {
    const row: React.CSSProperties = {
      display: "grid",
      gridTemplateColumns: "110px 1fr",
      alignItems: "center",
      gap: 14,
    };

    const label: React.CSSProperties = { opacity: 0.75, fontSize: 13 };
    const value: React.CSSProperties = {
      fontWeight: 800,
      fontSize: 14,
      overflowWrap: "anywhere",
      justifySelf: "start",
    };

    const priceValue: React.CSSProperties = {
      ...value,
      fontWeight: 900,
      fontSize: 16,
    };

    return (
      <>
        <div style={row}>
          <div style={label}>Name</div>
          <div style={value}>{guestName.trim()}</div>
        </div>

        <div style={row}>
          <div style={label}>Email</div>
          <div style={value}>{normalizeEmail(guestEmail)}</div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.10)", margin: "6px 0" }} />

        <div style={row}>
          <div style={label}>Price</div>
          <div style={priceValue}>{money(priceCents, currency)}</div>
        </div>

        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
          Payment handled by the facility during beta.
        </div>
      </>
    );
  })()}



          <div style={{ height: 1, background: "rgba(255,255,255,0.10)", margin: "6px 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ opacity: 0.75 }}>Price</div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>{money(priceCents, currency)}</div>
          </div>

          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Payment handled by the facility during beta.
          </div>
        </div>

        {error && <div style={{ marginTop: 10, fontSize: 13, color: "salmon" }}>{error}</div>}

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={busy}
            onClick={confirmAndPayMock}
            style={{
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              padding: "12px 14px",
              fontSize: 14,
              fontWeight: 900,
              background: "rgba(255,255,255,0.18)",
              color: "white",
              cursor: "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? "Starting checkout…" : "Pay & book"}
          </button>

          <Link
            href={detailsHref}
            style={{
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              padding: "12px 14px",
              fontSize: 14,
              fontWeight: 900,
              background: "rgba(0,0,0,0.35)",
              color: "white",
              textDecoration: "none",
            }}
          >
            Cancel
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- SUCCESS STEP ---------------- */
  if (step === "paid") {
    return (
      <div style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Booking saved (mock) ✅</h2>
        <p style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
          Stripe checkout will replace this step later.
        </p>

        <Link
          href={detailsHref}
          style={{
            display: "inline-block",
            marginTop: 12,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            padding: "12px 14px",
            fontSize: 14,
            fontWeight: 900,
            background: "rgba(255,255,255,0.18)",
            color: "white",
            textDecoration: "none",
          }}
        >
          Back to session
        </Link>
      </div>
    );
  }

  /* ---------------- INFO STEP ---------------- */
  return (
    <form onSubmit={goToConfirm} style={cardStyle}>
      <h2 style={{ margin: 0, fontSize: 16 }}>Book as guest</h2>
      <p style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
        Enter your info. You’ll confirm and pay on the next screen.
      </p>

      <Field label="Name">
        <input
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.35)",
            color: "white",
            outline: "none",
          }}
        />
      </Field>

      <Field label="Email">
        <input
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          type="email"
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.35)",
            color: "white",
            outline: "none",
          }}
        />
      </Field>

      {error && <div style={{ marginTop: 10, fontSize: 13, color: "salmon" }}>{error}</div>}

      <button
        type="submit"
        style={{
          marginTop: 12,
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.18)",
          color: "white",
          cursor: "pointer",
          fontWeight: 900,
        }}
      >
        Continue
      </button>
    </form>
  );
}
