import Link from "next/link";

export default function PicklePassLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Global Pickle Pass header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(10px)",
          background: "rgba(0,0,0,0.55)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Link
            href="/pickle-pass"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: 900,
              fontSize: 18,
              letterSpacing: 0.4,
            }}
          >
            Pickle Pass
          </Link>

          {/* Optional right-side placeholder */}
          <div style={{ fontSize: 12, opacity: 0.7, color: "white" }}>
            Beta
          </div>
        </div>
      </header>

      {/* Page content */}
      <main>{children}</main>
    </div>
  );
}
