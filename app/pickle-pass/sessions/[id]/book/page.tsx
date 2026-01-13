import Link from "next/link";
import { findSessionInMockRange } from "../../../mockData";
import BookingActions from "./BookingActions";

function formatTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const startStr = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const endStr = end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${startStr} – ${endStr}`;
}

export default async function BookSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionId = decodeURIComponent(id);

  // Legacy route: hard-code Cranky Pickle for now
  const facilitySlug = "the-cranky-pickle";
  const facilityName = "The Cranky Pickle";

  const session = findSessionInMockRange(facilitySlug, sessionId);

  if (!session) {
    return (
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px", color: "white" }}>
        <Link href="/pickle-pass" style={{ textDecoration: "none", color: "white" }}>
          ← Back to directory
        </Link>

        <h1 style={{ marginTop: 16 }}>Session not found</h1>
        <p style={{ opacity: 0.8 }}>
          This session ID wasn’t found in the current mock data window.
        </p>
        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          Requested ID: <code>{sessionId}</code>
        </div>
      </main>
    );
  }

  const detailsHref = `/pickle-pass/sessions/${encodeURIComponent(session.id)}`;

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px", color: "white" }}>
      <Link href={detailsHref} style={{ textDecoration: "none", color: "white" }}>
        ← Back to session details
      </Link>

      <header style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{facilityName}</div>
        <h1 style={{ margin: "8px 0 6px", fontSize: 30, lineHeight: 1.15 }}>Confirm booking</h1>

        <div
          style={{
            marginTop: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 14,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700 }}>{session.title}</div>
          <div style={{ marginTop: 6, opacity: 0.9 }}>
            {formatTimeRange(session.startISO, session.endISO)} • {session.courtGroup} • Level{" "}
            {session.levelLabel}
          </div>
          <div style={{ marginTop: 8, opacity: 0.8 }}>
            {session.duprGated ? "DUPR gated session" : "Not DUPR gated"}
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
            {session.booked}/{session.capacity} booked
          </div>
        </div>
      </header>

      <section style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {/* Payment method */}
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 14,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16 }}>Choose payment method</h2>

          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "10px 12px",
                background: "rgba(0,0,0,0.25)",
              }}
            >
              <input type="radio" name="pay" defaultChecked />
              <div>
                <div style={{ fontWeight: 700 }}>Use Pickle Pass</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>Costs 1 pass (mock)</div>
              </div>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "10px 12px",
                background: "rgba(0,0,0,0.25)",
              }}
            >
              <input type="radio" name="pay" />
              <div>
                <div style={{ fontWeight: 700 }}>Facility membership / Drop-in</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  Handled by facility (mock)
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Confirm */}
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 14,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16 }}>Confirm</h2>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* ✅ Client Component (so we can click) */}
            <BookingActions />

            <Link
              href={detailsHref}
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
              }}
            >
              Cancel
            </Link>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
            Next step: replace the alert with a real booking API / DB write.
          </div>
        </div>
      </section>
    </main>
  );
}
