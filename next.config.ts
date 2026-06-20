import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 *
 * Note: a public web app must serve its HTML/CSS/JS to the browser, so source
 * can always be viewed/saved. CSP does not hide code — it mitigates real
 * attacks (XSS/code injection, clickjacking, data exfiltration) by restricting
 * what origins the page may load and connect to.
 *
 * In development we must allow 'unsafe-eval' and websocket connections so
 * Next.js HMR / React Refresh work. Production is stricter.
 */
const csp = [
  "default-src 'self'",
  // Next.js injects a small inline bootstrap script; 'unsafe-inline' keeps
  // hydration working without a nonce pipeline. 'unsafe-eval' only in dev.
  // Clarity requires its script host (www.clarity.ms) in production.
  `script-src 'self' 'unsafe-inline' https://www.clarity.ms${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // External links navigate away (allowed); the page itself only talks to its
  // own origin. Clarity sends data to its collection endpoint. Allow ws/wss in dev for HMR.
  `connect-src 'self' https://www.clarity.ms${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Anti-clickjacking: forbid the site from being embedded in any frame.
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Belt-and-suspenders clickjacking protection for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  // Stop MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser features the app does not use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Force HTTPS for two years, including subdomains.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Isolate the browsing context (extra protection against cross-origin leaks).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Remove the "X-Powered-By: Next.js" fingerprint header.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
