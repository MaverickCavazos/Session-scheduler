import Link from "next/link";
import { findSessionInMockRange } from "../../mockData";
import SessionActions from "./SessionActions";

// Simple helpers
function formatTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  return `${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString(
    [],
    { hour: "numeric", minute: "2-digit" }
  )}`;
}

function formatDayHeading(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// ✅ params is a Promise in your Next version
export default async function SessionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionId = decodeURIComponent(id);

  // ✅ HARD-CODED for now
  const facilitySlug = "the-cranky-pickle";

  const session = findSessionInMockRange(facilitySlug, sessionId);

  if (!session) {
    return (
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px" }}>
        <Link href="/pickle-pass" style={{ textDecoration: "none" }}>
          ← Back to schedule
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

  const dateISO = session.startISO.slice(0, 10);

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px" }}>
      <Link href="/pickle-pass" style={{ textDecoration: "none" }}>
        ← Back to schedule
      </Link>

      <header style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          The Cranky Pickle • {formatDayHeading(dateISO)}
        </div>

        <h1 style={{ margin: "8px 0 6px", fontSize: 30 }}>{session.title}</h1>

        <div style={{ opacity: 0.85 }}>
          {formatTimeRange(session.startISO, session.endISO)}
        </div>
      </header>

      <section
        style={{
          marginTop: 16,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 16,
          padding: 14,
          background: "white",
          color: "rgba(0,0,0,0.9)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>What to expect</h2>
        <p>{session.description}</p>
      </section>

      {/* ✅ NEW: actions */}
      <div style={{ marginTop: 14 }}>
        <SessionActions bookHref={`/pickle-pass/sessions/${encodeURIComponent(session.id)}/book`} />
      </div>
    </main>
  );
}
