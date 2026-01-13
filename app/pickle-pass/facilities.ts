export type Facility = {
  id: string;          // internal id (stable)
  slug: string;        // url-friendly
  name: string;
  city?: string;
  state?: string;
  courtsLabel?: string; // optional display
};

const FACILITIES: Facility[] = [
  {
    id: "fac_cranky",
    slug: "the-cranky-pickle",
    name: "The Cranky Pickle",
    city: "Austin",
    state: "TX",
    courtsLabel: "Courts 1–8",
  },
  {
    id: "fac_ranch",
    slug: "austin-pickle-ranch",
    name: "Austin Pickle Ranch",
    city: "Austin",
    state: "TX",
    courtsLabel: "Courts 1–16",
  },
  {
    id: "fac_eastside",
    slug: "eastside-pickleball-club",
    name: "Eastside Pickleball Club",
    city: "Austin",
    state: "TX",
    courtsLabel: "Courts 1–10",
  },
];

export function listFacilities() {
  return FACILITIES;
}

export function findFacilityBySlug(slug: string): Facility | null {
  return FACILITIES.find((f) => f.slug === slug) ?? null;
}
