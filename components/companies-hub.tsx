"use client";

/**
 * CompaniesHub — Company Demand page.
 *
 * Three-level drill-down:
 * 1. Company grid (filterable by global/india tags)
 * 2. Roles list for a selected company
 * 3. Full learning roadmap for a selected role (phases, skills, videos, resources)
 */

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Building2,
  ChevronRight,
  ExternalLink as ExternalLinkIcon,
  GraduationCap,
  Layers,
  PlayCircle,
  Search,
  Target,
  Timer,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COMPANIES, type Company, type CompanyRole, type RoadmapPhase } from "@/lib/data/companies";

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CompaniesHub() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRole, setSelectedRole] = useState<CompanyRole | null>(null);
  const [filter, setFilter] = useState<"all" | "global" | "india">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = useMemo(() => {
    let result = COMPANIES;
    if (filter === "india") result = result.filter((c) => c.tags.includes("india"));
    if (filter === "global") result = result.filter((c) => c.tags.includes("global"));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.roles.some((r) => r.title.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [filter, searchQuery]);

  // --- Navigation handlers ---
  function goBack() {
    if (selectedRole) {
      setSelectedRole(null);
    } else if (selectedCompany) {
      setSelectedCompany(null);
    }
  }

  // --- Level 3: Role Roadmap ---
  if (selectedRole && selectedCompany) {
    return (
      <RoleRoadmapView
        company={selectedCompany}
        role={selectedRole}
        onBack={goBack}
      />
    );
  }

  // --- Level 2: Company Roles ---
  if (selectedCompany) {
    return (
      <CompanyRolesView
        company={selectedCompany}
        onBack={goBack}
        onSelectRole={setSelectedRole}
      />
    );
  }

  // --- Level 1: Company Grid ---
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search companies or roles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Filter:</span>
        {(["all", "global", "india"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium transition-all",
              filter === f
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            {f === "all" ? "All Companies" : f === "india" ? "🇮🇳 Indian" : "🌍 Global"}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">
          {filteredCompanies.length} companies
        </span>
      </div>

      {/* Company Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <button
            key={company.id}
            onClick={() => setSelectedCompany(company)}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{company.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <div className="flex gap-1 mt-0.5">
                  {company.tags.includes("india") && (
                    <span className="rounded-full bg-gradient-to-r from-orange-500/20 via-white/20 to-green-500/20 border border-orange-300/30 px-1.5 py-0.5 text-[9px] font-bold text-orange-700 dark:text-orange-400">
                      🇮🇳 India
                    </span>
                  )}
                  {company.tags.includes("faang") && (
                    <span className="rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-medium text-blue-600">
                      FAANG
                    </span>
                  )}
                  {company.tags.includes("fresher-friendly") && (
                    <span className="rounded-full bg-green-500/10 px-1.5 py-0.5 text-[9px] font-medium text-green-600">
                      Fresher Friendly
                    </span>
                  )}
                  {company.tags.includes("startup") && (
                    <span className="rounded-full bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-medium text-purple-600">
                      Startup
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {company.description}
            </p>
            <div className="flex items-center gap-2 mt-auto pt-1 border-t border-border">
              <Briefcase className="size-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">
                {company.roles.length} role{company.roles.length !== 1 ? "s" : ""} hiring
              </span>
            </div>
          </button>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">No companies match your search.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => { setFilter("all"); setSearchQuery(""); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Level 2: Company Roles View
// ---------------------------------------------------------------------------

function CompanyRolesView({
  company,
  onBack,
  onSelectRole,
}: {
  company: Company;
  onBack: () => void;
  onSelectRole: (role: CompanyRole) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to companies
      </button>

      {/* Company header */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/10 p-6">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{company.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">{company.name}</h2>
              {company.tags.includes("india") && (
                <span className="rounded-full bg-gradient-to-r from-orange-500 via-white to-green-600 px-2 py-0.5 text-[10px] font-bold text-gray-900 shadow-sm">
                  🇮🇳 Indian Company
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{company.description}</p>
            <a
              href={company.careersUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
            >
              <ExternalLinkIcon className="size-3" />
              Visit careers page
            </a>
          </div>
        </div>
      </div>

      {/* Roles list */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Briefcase className="size-5 text-primary" />
          Open Roles ({company.roles.length})
        </h3>
        <div className="space-y-3">
          {company.roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role)}
              className="group w-full flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Target className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {role.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {role.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[11px] font-medium text-green-600 bg-green-500/10 rounded-full px-2 py-0.5">
                    {role.salary}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    · {role.roadmap.length} phases · {role.requirements.length} requirements
                  </span>
                </div>
                {/* Requirements preview */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {role.requirements.slice(0, 4).map((req) => (
                    <Badge key={req} variant="outline" className="text-[10px] py-0">
                      {req}
                    </Badge>
                  ))}
                  {role.requirements.length > 4 && (
                    <Badge variant="outline" className="text-[10px] py-0">
                      +{role.requirements.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Level 3: Role Roadmap View
// ---------------------------------------------------------------------------

function RoleRoadmapView({
  company,
  role,
  onBack,
}: {
  company: Company;
  role: CompanyRole;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to {company.name} roles
      </button>

      {/* Role header */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/10 p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Target className="size-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{company.name}</p>
            <h2 className="text-xl font-bold text-foreground">{role.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
            <span className="inline-block mt-2 text-sm font-medium text-green-600 bg-green-500/10 rounded-full px-3 py-0.5">
              💰 {role.salary}
            </span>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col items-center rounded-lg bg-card border border-border px-4 py-2">
              <Layers className="size-4 text-primary mb-1" />
              <span className="text-lg font-bold text-foreground">{role.roadmap.length}</span>
              <span className="text-[10px] text-muted-foreground">Phases</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-card border border-border px-4 py-2">
              <Timer className="size-4 text-primary mb-1" />
              <span className="text-lg font-bold text-foreground">{role.roadmap.length * 4}</span>
              <span className="text-[10px] text-muted-foreground">Weeks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <section>
        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <GraduationCap className="size-5 text-primary" />
          What This Role Requires
        </h3>
        <div className="flex flex-wrap gap-2">
          {role.requirements.map((req) => (
            <span
              key={req}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground"
            >
              {req}
            </span>
          ))}
        </div>
      </section>

      {/* Roadmap Phases */}
      <section>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          Complete Learning Roadmap
        </h3>
        <div className="space-y-4">
          {role.roadmap.map((phase, index) => (
            <PhaseCard key={index} phase={phase} phaseNumber={index + 1} />
          ))}
        </div>
      </section>

      {/* Completion */}
      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
        <Trophy className="size-10 mx-auto text-primary mb-2" />
        <h3 className="text-lg font-bold text-foreground">
          🎉 Ready for {role.title} at {company.name}!
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Complete this roadmap in ~{role.roadmap.length * 4} weeks and you&apos;ll be prepared
          for the interview process.
        </p>
        <a
          href={company.careersUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ExternalLinkIcon className="size-3.5" />
          Apply at {company.name}
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PhaseCard — A single roadmap phase with skills, resources, videos
// ---------------------------------------------------------------------------

function PhaseCard({
  phase,
  phaseNumber,
}: {
  phase: RoadmapPhase;
  phaseNumber: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Phase header */}
      <div className="flex items-center gap-3 bg-accent/30 px-5 py-3 border-b border-border">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
          {phaseNumber}
        </span>
        <h4 className="font-semibold text-foreground">{phase.title}</h4>
      </div>

      <div className="p-5 space-y-4">
        {/* Skills */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Skills to Learn
          </p>
          <div className="flex flex-wrap gap-1.5">
            {phase.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Free Resources */}
        {phase.resources.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
              <BookOpen className="size-3" />
              Free Resources
            </p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {phase.resources.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs hover:bg-accent transition-colors"
                >
                  <ExternalLinkIcon className="size-3 text-primary shrink-0" />
                  <span className="flex-1 text-foreground group-hover:text-primary transition-colors truncate">
                    {resource.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Videos */}
        {phase.videos.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
              <PlayCircle className="size-3 text-red-500" />
              Video Tutorials
            </p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {phase.videos.map((video) => (
                <a
                  key={video.url}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs hover:bg-accent transition-colors"
                >
                  <PlayCircle className="size-3.5 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-foreground group-hover:text-primary transition-colors truncate">
                      {video.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {video.channel} · {video.duration}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
