import Link from "next/link";
import { findSessionInMockRange } from "../../../mockData";
import GuestBookingForm from "./GuestBookingForm";

function formatTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const startStr = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const endStr = end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${startStr} – ${endStr}`;
}

export default async function BookSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ facilitySlug?: string }>;
}) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const facilitySlugFromQuery = sp.facilitySlug;

  const sessionId = decodeURIComponent(id);

  // Legacy booking page still uses Cranky Pickle mock window
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

  // ✅ Where "Cancel" should go:
  const fallbackDetailsHref = `/pickle-pass/sessions/${encodeURIComponent(session.id)}`;
  const facilityDetailsHref = facilitySlugFromQuery
    ? `/pickle-pass/f/${facilitySlugFromQuery}/sessions/${encodeURIComponent(session.id)}`
    : undefined;

  const detailsHref = facilityDetailsHref ?? fallbackDetailsHref;

  // ✅ After account auth later, bring them back here
  const redirectTo = `/pickle-pass/sessions/${encodeURIComponent(session.id)}/book${
    facilitySlugFromQuery ? `?facilitySlug=${encodeURIComponent(facilitySlugFromQuery)}` : ""
  }`;

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px", color: "white" }}>
      <Link href={detailsHref} style={{ textDecoration: "none", color: "white" }}>
        ← Back to session details
      </Link>

      <header style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{facilityName}</div>
        <h1 style={{ margin: "8px 0 6px", fontSize: 30, lineHeight: 1.15 }}>
          Choose how to book
        </h1>

        <div
          style={{
            marginTop: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 14,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800 }}>{session.title}</div>
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
        {/* Account option (we'll wire Supabase next) */}
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 14,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16 }}>Use an account</h2>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: 13, opacity: 0.8 }}>
            Create an account to manage passes, memberships, and your booking history.
          </p>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href={`/pickle-pass/auth?redirectTo=${encodeURIComponent(redirectTo)}`}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                padding: "12px 14px",
                fontSize: 14,
                fontWeight: 800,
                background: "rgba(255,255,255,0.18)",
                color: "white",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Create account / Log in
            </Link>

            <Link
              href={detailsHref}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                padding: "12px 14px",
                fontSize: 14,
                fontWeight: 800,
                background: "rgba(0,0,0,0.35)",
                color: "white",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Guest option (works now) */}
        <GuestBookingForm
  sessionId={session.id}
  facilitySlug={facilitySlugFromQuery}
  priceCents={1000} // $10.00 beta drop-in (adjust per facility/session later)
  currency="USD"
  detailsHref={detailsHref}
/>

      </section>
    </main>
  );
}
