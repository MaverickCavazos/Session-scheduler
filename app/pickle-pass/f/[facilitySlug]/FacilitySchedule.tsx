"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { DayBlock, Session, generateMockDays } from "../../mockData";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function toDateISO(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDayHeading(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function formatTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const startStr = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const endStr = end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${startStr} – ${endStr}`;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        border: "1px solid rgba(0,0,0,0.12)",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        opacity: 0.9,
        background: "rgba(0,0,0,0.02)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function ProgressBar({ booked, capacity }: { booked: number; capacity: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((booked / capacity) * 100)));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          height: 8,
          width: 120,
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.12)",
          overflow: "hidden",
          background: "rgba(0,0,0,0.04)",
        }}
        aria-label={`Booked ${booked} of ${capacity}`}
      >
        <div style={{ height: "100%", width: `${pct}%`, background: "rgba(0,0,0,0.35)" }} />
      </div>
      <span style={{ fontSize: 12, opacity: 0.8 }}>
        {booked}/{capacity}
      </span>
    </div>
  );
}

function RosterPreview({
  roster,
  capacity,
}: {
  roster: { id: string; displayName: string; dupr?: number }[];
  capacity: number;
}) {
  const shown = roster.slice(0, 6);
  const remaining = Math.max(0, roster.length - shown.length);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
      {shown.map((p) => (
        <span
          key={p.id}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: "1px solid rgba(0,0,0,0.12)",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            background: "rgba(0,0,0,0.02)",
          }}
          title={p.dupr ? `DUPR ${p.dupr}` : "No DUPR shown"}
        >
          {p.displayName}
          {typeof p.dupr === "number" ? (
            <span style={{ opacity: 0.7 }}>• {p.dupr}</span>
          ) : (
            <span style={{ opacity: 0.5 }}>• —</span>
          )}
        </span>
      ))}
      {remaining > 0 && (
        <span style={{ fontSize: 12, opacity: 0.7, alignSelf: "center" }}>
          +{remaining} more (of {capacity})
        </span>
      )}
    </div>
  );
}

function SessionCard({ s, facilitySlug }: { s: Session; facilitySlug: string }) {
  return (
    <article
      style={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 16,
        padding: 14,
        background: "white",
        boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
        color: "rgba(0,0,0,0.9)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
            {formatTimeRange(s.startISO, s.endISO)}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.2 }}>{s.title}</h3>
            <span style={{ fontSize: 12, opacity: 0.75 }}>{s.type}</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <Chip>Level: {s.levelLabel}</Chip>
            <Chip>{s.courtGroup}</Chip>
            {s.duprGated ? <Chip>DUPR gated</Chip> : <Chip>Not DUPR gated</Chip>}
          </div>

          <p style={{ margin: "10px 0 0", fontSize: 13, opacity: 0.9, lineHeight: 1.35 }}>
            {s.description}
          </p>

          <RosterPreview roster={s.roster} capacity={s.capacity} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          <ProgressBar booked={s.booked} capacity={s.capacity} />
          <Link
            href={`/pickle-pass/f/${facilitySlug}/sessions/${encodeURIComponent(s.id)}`}
            style={{
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              padding: "10px 12px",
              fontSize: 13,
              cursor: "pointer",
              background: "rgba(0,0,0,0.03)",
              textDecoration: "none",
              color: "inherit",
              display: "inline-block",
            }}
          >
            View / Book
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function FacilitySchedule({ facilitySlug }: { facilitySlug: string }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [dayBlocks, setDayBlocks] = useState<DayBlock[]>(() =>
    generateMockDays(facilitySlug, today, 7)
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const io = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (isLoadingMore) return;

        setIsLoadingMore(true);
        await new Promise((r) => setTimeout(r, 350));

        setDayBlocks((prev) => {
          const last = prev[prev.length - 1];
          const lastDate = new Date(last.dateISO + "T00:00:00");
          const nextStart = addDays(lastDate, 1);
          const more = generateMockDays(facilitySlug, nextStart, 7);
          return [...prev, ...more];
        });

        setIsLoadingMore(false);
      },
      { root: null, rootMargin: "600px 0px", threshold: 0 }
    );

    io.observe(sentinel);
    return () => io.disconnect();
  }, [facilitySlug, isLoadingMore]);

  return (
    <section style={{ display: "grid", gap: 18 }}>
      {dayBlocks.map((day) => (
        <div key={day.dateISO}>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(255,255,255,0.85))",
              backdropFilter: "blur(6px)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              margin: "0 4px 12px",
              color: "rgba(0,0,0,0.9)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18 }}>{formatDayHeading(day.dateISO)}</h2>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
              {day.sessions.length} event{day.sessions.length === 1 ? "" : "s"}
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {day.sessions.map((s) => (
              <SessionCard key={s.id} s={s} facilitySlug={facilitySlug} />
            ))}
          </div>
        </div>
      ))}

      <div ref={sentinelRef} style={{ height: 1 }} />

      <div style={{ padding: "14px 0 6px", fontSize: 13, opacity: 0.8 }}>
        {isLoadingMore ? "Loading more days…" : "Scroll for more days"}
      </div>
    </section>
  );
}
