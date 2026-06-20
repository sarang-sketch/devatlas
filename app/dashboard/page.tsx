import type { Metadata } from "next";

import { DashboardContent } from "@/components/dashboard-content";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";

// Per-page SEO metadata for "/dashboard" sourced from the shared route registry
// (Req 14.2, 14.5).
const dashboardRoute = ROUTE_REGISTRY.find(
  (route) => route.pattern === "/dashboard",
);
export const metadata: Metadata = buildMetadata(dashboardRoute ?? {});

export default function DashboardPage() {
  return <DashboardContent />;
}
