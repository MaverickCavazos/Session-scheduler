import FacilityDirectory from "./FacilityDirectory";
import { listFacilities } from "./facilities";

export default function PicklePassHomePage() {
  const facilities = listFacilities();

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px", color: "white" }}>
      <header style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, letterSpacing: 0.6, textTransform: "uppercase", opacity: 0.7 }}>
          Pickle Pass
        </div>
        <h1 style={{ margin: "6px 0 4px", fontSize: 34, lineHeight: 1.1 }}>
          Facility Directory
        </h1>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Search facilities, bookmark your favorites, and view today’s sessions.
        </p>
      </header>

      <FacilityDirectory facilities={facilities} />
    </main>
  );
}
