import { useEffect } from "react";
import { useParams } from "react-router-dom";

/**
 * /mobile route — production phone view.
 *
 * The mobile experience is implemented as a single self-contained vanilla
 * JS page at /public/mobile_mockup.html so the same file ships to V1.9
 * (Flask), V2.0 (FastAPI + React), and any future controller without a
 * React rebuild.  This React route is a thin redirect so the URL
 * `https://<host>/mobile` resolves cleanly from QR codes, navigation
 * links and bookmarks.
 *
 * `replace: true` keeps the address bar at /mobile_mockup.html after
 * redirect, which is what the share/QR URLs already point at.  When the
 * caller deep-links via /mobile/:kind/:id (react-router path params,
 * NOT a hash) we re-encode the target as a hash route so the vanilla
 * mockup's hash-driven router picks it up.
 */
export default function Mobile() {
  const { kind, id } = useParams();
  useEffect(() => {
    const deepLink = (kind && id)
      ? `#/${kind}/${encodeURIComponent(id)}`
      : (window.location.hash || "");
    window.location.replace("/mobile_mockup.html" + deepLink);
  }, [kind, id]);
  return (
    <div
      data-testid="mobile-route-redirect"
      style={{
        minHeight: "100vh",
        background: "#050912",
        color: "#94a3b8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "ui-monospace, monospace",
        fontSize: "12px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      Loading mobile view…
    </div>
  );
}
