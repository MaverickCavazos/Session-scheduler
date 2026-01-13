import Link from "next/link";
import { findFacilityBySlug } from "../../../../facilities";
import { findSessionInMockRange } from "../../../../mockData";
import SessionActions from "../../../../sessions/[id]/SessionActions";

function formatTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const startStr = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const endStr = end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${startStr} – ${endStr}`;
}

export default async function FacilitySessionDetailsPage({
  params,
}: {
  params: Promise<{ facilitySlug: string; id: string }>;
}) {
  const { facilitySlug, id } = await params;
  const facility = findFacilityBySlug(facilitySlug);

  if (!facility) {
    return (
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px" }}>
        <h1>Facility not found</h1>
      </main>
    );
  }

  const sessionId = decodeURIComponent(id);
  const session = findSessionInMockRange(facilitySlug, sessionId);

  if (!session) {
    return (
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px" }}>
        <Link href={`/pickle-pass/f/${facilitySlug}`} style={{ textDecoration: "none" }}>
          ← Back to {facility.name}
        </Link>
        <h1 style={{ marginTop: 16 }}>Session not found</h1>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px" }}>
      <Link href={`/pickle-pass/f/${facilitySlug}`} style={{ textDecoration: "none" }}>
        ← Back to {facility.name}
      </Link>

      <h1 style={{ marginTop: 14 }}>{session.title}</h1>
      <div style={{ opacity: 0.85 }}>{formatTimeRange(session.startISO, session.endISO)}</div>

      <div style={{ marginTop: 12 }}>
        <div><strong>Courts:</strong> {session.courtGroup}</div>
        <div><strong>Level:</strong> {session.levelLabel}</div>
        <div><strong>DUPR:</strong> {session.duprGated ? "Gated" : "Not gated"}</div>
      </div>

      <div
        style={{
          marginTop: 14,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 16,
          padding: 14,
          background: "white",
          color: "rgba(0,0,0,0.9)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Who’s going</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {session.roster.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 12,
                padding: "10px 12px",
                background: "rgba(0,0,0,0.02)",
              }}
            >
              <div>{p.displayName}</div>
              <div style={{ opacity: 0.8 }}>{typeof p.dupr === "number" ? `DUPR ${p.dupr}` : "DUPR —"}</div>
            </div>
          ))}
        </div>
      </div>
 
      <div style={{ marginTop: 14 }}>
        <SessionActions
          bookHref={`/pickle-pass/sessions/${encodeURIComponent(session.id)}/book`}
        />

      </div>
    </main>
  );
}
