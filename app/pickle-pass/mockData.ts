export type EventType = "Open Play" | "DUPR Night" | "League" | "Clinic" | "Drills";

export type Player = {
  id: string;
  displayName: string; // later: privacy rules
  dupr?: number; // optional
};

export type Session = {
  id: string;
  title: string;
  type: EventType;
  startISO: string;
  endISO: string;
  levelLabel: string;
  duprGated?: boolean;
  courtGroup: string;
  capacity: number;
  facilitySlug: string;
  booked: number;
  description: string;
  expectations?: {
    format: string;
    rotations: string;
    arrival: string;
    equipment: string;
    rules: string;
  };
  roster: Player[];
};

export type DayBlock = {
  dateISO: string; // YYYY-MM-DD
  sessions: Session[];
};

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

function makeRoster(booked: number, seed: string): Player[] {
  // Deterministic-ish roster generator
  const names = [
    "Lisa P.", "Maverick C.", "Jordan K.", "Ava R.", "Chris T.", "Noah B.", "Mia S.",
    "Ethan W.", "Sophia L.", "Diego M.", "Hannah G.", "Sam D.", "Priya N.", "Ben F.",
    "Olivia J.", "Andre Z.", "Kaitlyn H.", "Marcus V.", "Tina Q.", "Jay S.",
  ];

  const roster: Player[] = [];
  for (let i = 0; i < booked; i++) {
    const idx = (hash(seed) + i * 7) % names.length;
    const maybeDupr = ((hash(seed + i) % 240) + 260) / 100; // 2.60–4.99-ish
    roster.push({
      id: `${seed}-p${i}`,
      displayName: names[idx],
      dupr: i % 3 === 0 ? undefined : Math.round(maybeDupr * 100) / 100, // some missing
    });
  }
  return roster;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function generateMockDays(
  facilitySlug: string,
  startDate: Date,
  numDays: number
): DayBlock[] {

  const blocks: DayBlock[] = [];

  for (let i = 0; i < numDays; i++) {
    const day = addDays(startDate, i);
    const dateISO = toDateISO(day);
    const weekday = day.getDay(); // 0 Sun - 6 Sat

    const sessions: Session[] = [];

 const mk = (partial: Omit<Session, "id" | "facilitySlug">): Session => ({
  id: `${facilitySlug}__${dateISO}__${partial.title.replace(/\s+/g, "-").toLowerCase()}__${partial.startISO}`,
  facilitySlug,
  ...partial,
});



    sessions.push(
      mk({
        title: "Open Play (Level 1–3)",
        type: "Open Play",
        startISO: `${dateISO}T09:00:00`,
        endISO: `${dateISO}T11:00:00`,
        levelLabel: "1–3",
        duprGated: false,
        courtGroup: "Courts 1–4",
        capacity: 24,
        booked: 10 + (weekday % 6),
        description:
          "Social open play with quick rotations. Great for newer players. Expect mixed games and friendly vibes.",
        expectations: {
          format: "Round robin rotations",
          rotations: "Rotate every game; partners change frequently",
          arrival: "Arrive 10 minutes early for check-in and warm-up",
          equipment: "Balls provided; bring your own paddle + water",
          rules: "Be welcoming; if it’s crowded, keep games moving",
        },
        roster: makeRoster(10 + (weekday % 6), `op-${dateISO}`),
      })
    );

    if (weekday >= 1 && weekday <= 5) {
      const booked = 18 + weekday * 2;
      sessions.push(
        mk({
          title: "DUPR Rated Night (3.0–3.5)",
          type: "DUPR Night",
          startISO: `${dateISO}T18:00:00`,
          endISO: `${dateISO}T20:00:00`,
          levelLabel: "3.0–3.5",
          duprGated: true,
          courtGroup: "Courts 5–8",
          capacity: 32,
          booked,
          description:
            "Structured games intended for DUPR reporting. Players are expected to be within the level range.",
          expectations: {
            format: "Structured games for rating",
            rotations: "Games assigned by organizer; keep scores accurate",
            arrival: "Arrive 15 minutes early (warm-up + bracket assignment)",
            equipment: "Balls provided; bring paddle; rating required/expected",
            rules: "Stay within level range; respect organizer assignments",
          },
          roster: makeRoster(booked, `dupr-${dateISO}`),
        })
      );

      if (weekday === 3) {
        sessions.push(
          mk({
            title: "3.5+ League Night",
            type: "League",
            startISO: `${dateISO}T20:15:00`,
            endISO: `${dateISO}T22:00:00`,
            levelLabel: "3.5+",
            duprGated: false,
            courtGroup: "Courts 1–4",
            capacity: 24,
            booked: 22,
            description:
              "Competitive league matches. Fixed teams. Arrive 10 minutes early for check-in and warm-up.",
            expectations: {
              format: "League matches (fixed teams)",
              rotations: "Schedule-based; courts assigned by organizer",
              arrival: "Arrive 10 minutes early; late arrivals may forfeit",
              equipment: "Bring paddle; balls provided",
              rules: "Good sportsmanship; report scores promptly",
            },
            roster: makeRoster(22, `league-${dateISO}`),
          })
        );
      }
    }

    if (weekday === 6 || weekday === 0) {
      const booked = 7 + (weekday === 6 ? 3 : 1);
      sessions.push(
        mk({
          title: "Drills & Skills Clinic",
          type: "Clinic",
          startISO: `${dateISO}T12:00:00`,
          endISO: `${dateISO}T13:30:00`,
          levelLabel: "All Levels",
          duprGated: false,
          courtGroup: "Courts 5–6",
          capacity: 16,
          booked,
          description:
            "Coach-led fundamentals + situational drilling (dinks, drops, transitions). Bring water and a good attitude.",
          expectations: {
            format: "Coach-led drills + live reps",
            rotations: "Rotate through stations every 10–15 minutes",
            arrival: "Arrive 10 minutes early to stretch and warm-up",
            equipment: "Bring paddle; balls provided; wear court shoes",
            rules: "Be coachable; keep reps moving; ask questions",
          },
          roster: makeRoster(booked, `clinic-${dateISO}`),
        })
      );
    }

    sessions.sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());
    blocks.push({ dateISO, sessions });
  }

  return blocks;
}

/**
 * Helper for details page (for now we search mock data).
 * Later, replace this with DB lookup by session id.
 */
export function findSessionInMockRange(facilitySlug: string, sessionId: string): Session | null {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Search a 60-day window of mock data
  const blocks = generateMockDays(facilitySlug, today, 60);

  for (const day of blocks) {
    const found = day.sessions.find((s) => s.id === sessionId);
    if (found) return found;
  }
  return null;
}
