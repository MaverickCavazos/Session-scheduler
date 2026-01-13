import { findFacilityBySlug } from "../../facilities";
import FacilitySchedule from "./FacilitySchedule";

export default async function FacilityPage({
  params,
}: {
  params: Promise<{ facilitySlug: string }>;
}) {
  const { facilitySlug } = await params;
  const facility = findFacilityBySlug(facilitySlug);

  if (!facility) {
    return (
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px" }}>
        <h1>Facility not found</h1>
        <p style={{ opacity: 0.8 }}>
          We don’t have a facility registered for: <code>{facilitySlug}</code>
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px" }}>
      <header style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, letterSpacing: 0.6, textTransform: "uppercase", opacity: 0.7 }}>
          Facility
        </div>

        <h1 style={{ margin: "6px 0 4px", fontSize: 34, lineHeight: 1.1 }}>
          {facility.name}
        </h1>

        <p style={{ margin: 0, opacity: 0.8 }}>
          Scroll to browse open plays, leagues, DUPR sessions, and clinics — starting today.
        </p>
      </header>

      <FacilitySchedule facilitySlug={facility.slug} />
    </main>
  );
}
