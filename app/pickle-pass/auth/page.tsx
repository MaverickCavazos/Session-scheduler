import Link from "next/link";

export default function AuthPlaceholder() {
  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "28px 16px", color: "white" }}>
      <h1 style={{ margin: 0, fontSize: 30 }}>Account (coming next)</h1>
      <p style={{ marginTop: 10, opacity: 0.85 }}>
        Next step: we’ll wire real signup/login (Supabase). For now, use “Book as guest.”
      </p>

      <Link
        href="/pickle-pass"
        style={{
          display: "inline-block",
          marginTop: 14,
          color: "white",
          textDecoration: "none",
          border: "1px solid rgba(255,255,255,0.18)",
          padding: "10px 12px",
          borderRadius: 12,
          background: "rgba(0,0,0,0.35)",
          fontWeight: 800,
        }}
      >
        Back to Pickle Pass
      </Link>
    </main>
  );
}
