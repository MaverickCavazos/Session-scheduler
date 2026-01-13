"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Facility } from "./facilities";


const STORAGE_KEY = "picklepass_bookmarked_facilities_v1";

function loadBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBookmarks(slugs: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

function FacilityCard({
  facility,
  isBookmarked,
  onToggleBookmark,
}: {
  facility: Facility;
  isBookmarked: boolean;
  onToggleBookmark: (slug: string) => void;
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 16,
        padding: 14,
        background: "rgba(255,255,255,0.04)",
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
          {(facility.city || facility.state) ? (
            <>
              {facility.city ?? ""}{facility.city && facility.state ? ", " : ""}{facility.state ?? ""}
              {facility.courtsLabel ? ` • ${facility.courtsLabel}` : ""}
            </>
          ) : (
            <span style={{ opacity: 0.6 }}>Facility</span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
            {facility.name}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            /f/{facility.slug}
          </div>
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href={`/pickle-pass/f/${facility.slug}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.18)",
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(0,0,0,0.10)",
              fontSize: 13,
              display: "inline-block",
            }}
          >
            View schedule
          </Link>

          <button
            type="button"
            onClick={() => onToggleBookmark(facility.slug)}
            style={{
              border: "1px solid rgba(255,255,255,0.18)",
              padding: "10px 12px",
              borderRadius: 12,
              background: isBookmarked ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.10)",
              color: "inherit",
              cursor: "pointer",
              fontSize: 13,
            }}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark facility"}
          >
            {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FacilityDirectory({ facilities }: { facilities: Facility[] }) {
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return loadBookmarks();
  });

  const bookmarkedSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  function toggleBookmark(slug: string) {
    setBookmarks((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      saveBookmarks(next);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return facilities;

    return facilities.filter((f) => {
      const hay = `${f.name} ${f.slug} ${f.city ?? ""} ${f.state ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [facilities, query]);

  const bookmarkedFacilities = useMemo(
    () => facilities.filter((f) => bookmarkedSet.has(f.slug)),
    [facilities, bookmarkedSet]
  );

  return (
    <section style={{ display: "grid", gap: 16 }}>
      {/* Search */}
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          padding: 14,
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
          Search facilities
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a facility name (ex: Cranky, Ranch, Eastside)…"
          style={{
            width: "100%",
            padding: "12px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.18)",
            color: "white",
            outline: "none",
            fontSize: 14,
          }}
        />
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
          Tip: bookmarks are saved to this browser (localStorage).
        </div>
      </div>

      {/* Bookmarks */}
      <div style={{ display: "grid", gap: 10 }}>
        <h2 style={{ margin: "4px 0 0", fontSize: 18 }}>Bookmarked</h2>

        {bookmarkedFacilities.length === 0 ? (
          <div style={{ opacity: 0.75, fontSize: 14 }}>
            No bookmarks yet — click “☆ Bookmark” on a facility below.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {bookmarkedFacilities.map((f) => (
              <FacilityCard
                key={f.id}
                facility={f}
                isBookmarked={true}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </div>

      {/* Directory */}
      <div style={{ display: "grid", gap: 10 }}>
        <h2 style={{ margin: "4px 0 0", fontSize: 18 }}>All facilities</h2>

        {filtered.length === 0 ? (
          <div style={{ opacity: 0.75, fontSize: 14 }}>
            No matches. (Next step: let users submit a new facility request.)
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((f) => (
              <FacilityCard
                key={f.id}
                facility={f}
                isBookmarked={bookmarkedSet.has(f.slug)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
