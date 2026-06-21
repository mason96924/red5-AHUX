import { useEffect } from "react";

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
 * redirect, which is what the share/QR URLs already point at.
 */
export default function Mobile() {
  useEffect(() => {
    const target = "/mobile_mockup.html" + (window.location.hash || "");
    window.location.replace(target);
  }, []);
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
