"use client";

/**
 * CertificatesHub — Free Certificate discovery page.
 *
 * Two-level drill-down:
 * 1. Field cards grid (Cloud, AI/ML, Frontend, etc.)
 * 2. Certificate list for selected field — grouped by MNC first, then others
 */

import { useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  Clock,
  ExternalLink,
  GraduationCap,
  Search,
  Shield,
  Star,
  Trophy,
} from "lucide-react";

import {
  CERTIFICATE_FIELDS,
  type CertificateField,
  type Certificate,
} from "@/lib/data/certificates";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600",
  intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-600",
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CertificatesHub() {
  const [selectedField, setSelectedField] = useState<CertificateField | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // --- Level 2: Certificate List ---
  if (selectedField) {
    return (
      <CertificateListView
        field={selectedField}
        onBack={() => setSelectedField(null)}
      />
    );
  }

  // --- Level 1: Field Grid ---
  const filteredFields = searchQuery.trim()
    ? CERTIFICATE_FIELDS.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.certificates.some(
            (c) =>
              c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.provider.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    : CERTIFICATE_FIELDS;

  const totalCerts = CERTIFICATE_FIELDS.reduce(
    (sum, f) => sum + f.certificates.length,
    0,
  );
  const totalMnc = CERTIFICATE_FIELDS.reduce(
    (sum, f) => sum + f.certificates.filter((c) => c.isMnc).length,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<Award className="size-5 text-primary" />} value={totalCerts} label="Free Certificates" />
        <StatCard icon={<Building2 className="size-5 text-blue-500" />} value={totalMnc} label="From MNCs" />
        <StatCard icon={<GraduationCap className="size-5 text-green-500" />} value={CERTIFICATE_FIELDS.length} label="Fields Covered" />
        <StatCard icon={<Shield className="size-5 text-purple-500" />} value="100%" label="Verified Free" />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search certificates, fields, or providers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Field Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFields.map((field) => {
          const mncCount = field.certificates.filter((c) => c.isMnc).length;
          return (
            <button
              key={field.id}
              onClick={() => setSelectedField(field)}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{field.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {field.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {field.certificates.length} certificates
                    {mncCount > 0 && ` · ${mncCount} from MNCs`}
                  </p>
                </div>
                <Trophy className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {field.description}
              </p>
              {/* Provider logos preview */}
              <div className="flex gap-1 mt-auto pt-2 border-t border-border flex-wrap">
                {[...new Set(field.certificates.filter(c => c.isMnc).map(c => c.providerEmoji))]
                  .slice(0, 6)
                  .map((emoji, i) => (
                    <span
                      key={i}
                      className="flex size-6 items-center justify-center rounded-full bg-muted text-xs"
                    >
                      {emoji}
                    </span>
                  ))}
                <span className="text-[10px] text-muted-foreground self-center ml-1">
                  & more
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filteredFields.length === 0 && (
        <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">No fields match your search.</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-3 rounded-lg border border-border px-4 py-1.5 text-sm text-foreground hover:bg-accent transition-colors"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      {icon}
      <div>
        <p className="text-lg font-bold text-foreground">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Level 2: Certificate List View
// ---------------------------------------------------------------------------

function CertificateListView({
  field,
  onBack,
}: {
  field: CertificateField;
  onBack: () => void;
}) {
  const mncCerts = field.certificates.filter((c) => c.isMnc);
  const otherCerts = field.certificates.filter((c) => !c.isMnc);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to all fields
      </button>

      {/* Field header */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/10 p-6">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{field.emoji}</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{field.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {field.description}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <Award className="size-3" />
                {field.certificates.length} free certificates
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                <Building2 className="size-3" />
                {mncCerts.length} from MNCs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MNC Certificates */}
      {mncCerts.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Star className="size-5 text-yellow-500" />
            From Top Companies
          </h3>
          <div className="space-y-2">
            {mncCerts.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>
        </section>
      )}

      {/* Other Certificates */}
      {otherCerts.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="size-5 text-green-500" />
            From Learning Platforms
          </h3>
          <div className="space-y-2">
            {otherCerts.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>
        </section>
      )}

      {/* Tip */}
      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5 text-center">
        <GraduationCap className="size-8 mx-auto text-primary mb-2" />
        <p className="text-sm font-medium text-foreground">
          💡 Pro Tip: Add these certificates to your LinkedIn profile to stand out!
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Coursera &quot;audit&quot; mode is free for all course content — you just
          don&apos;t get the paid certificate, but you still learn everything.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CertificateCard — single certificate entry
// ---------------------------------------------------------------------------

function CertificateCard({ cert }: { cert: Certificate }) {
  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
    >
      {/* Provider emoji */}
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
        {cert.providerEmoji}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
          {cert.title}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {cert.provider}
        </p>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${LEVEL_COLORS[cert.level]}`}
          >
            {cert.level.charAt(0).toUpperCase() + cert.level.slice(1)}
          </span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
            <Clock className="size-2.5" />
            {cert.duration}
          </span>
          {cert.isMnc && (
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-600">
              MNC
            </span>
          )}
          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600">
            ✅ FREE
          </span>
        </div>

        {/* Note */}
        {cert.note && (
          <p className="text-[11px] text-muted-foreground mt-1.5 italic">
            {cert.note}
          </p>
        )}
      </div>

      {/* External link icon */}
      <ExternalLink className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
    </a>
  );
}
