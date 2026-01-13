"use client";

export default function BookingActions() {
  return (
    <button
      type="button"
      onClick={() => alert("TODO: create booking, decrement capacity, add to roster")}
      style={{
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.18)",
        padding: "12px 14px",
        fontSize: 14,
        fontWeight: 700,
        background: "rgba(255,255,255,0.18)",
        color: "white",
        cursor: "pointer",
      }}
    >
      Confirm booking
    </button>
  );
}
