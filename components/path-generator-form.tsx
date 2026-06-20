"use client";

/**
 * DevAtlas Path Generator form (Req 10).
 *
 * Client component that renders:
 * - A select for the learning goal (from the 12 career paths, Req 10.1)
 * - A number input for available hours/week (1-80, whole number, Req 10.6)
 * - A select for current skill level (4 levels, Req 10.1)
 * - A submit button
 *
 * On submit, calls validatePathInput. On failure, shows field-specific
 * validation messages next to the offending fields (Req 10.4, 10.5, 10.6).
 * On success, calls buildPath and renders a GeneratedPathView.
 */

import { useState } from "react";

import { GeneratedPathView } from "@/components/generated-path-view";
import { Button } from "@/components/ui/button";
import {
  validatePathInput,
  buildPath,
  SKILL_LEVEL_ORDER,
} from "@/lib/domain/path-generator";
import type { CareerPath, GeneratedPath, RawPathInput, SkillLevel } from "@/lib/domain/types";
import type { PathInputError } from "@/lib/domain/path-generator";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PathGeneratorPageProps {
  /** The loaded career paths for the goal dropdown. */
  careerPaths: CareerPath[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PathGeneratorPage({ careerPaths }: PathGeneratorPageProps) {
  const [goal, setGoal] = useState<string>("");
  const [hoursPerWeek, setHoursPerWeek] = useState<string>("");
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [errors, setErrors] = useState<PathInputError[]>([]);
  const [generatedPath, setGeneratedPath] = useState<GeneratedPath | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const getFieldError = (field: string): string | undefined =>
    errors.find((e) => e.field === field)?.message;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const raw: RawPathInput = {
      goal: goal || null,
      hoursPerWeek,
      skillLevel: (skillLevel || null) as SkillLevel | null,
    };

    const result = validatePathInput(raw);

    if (!result.ok) {
      setErrors(result.errors);
      setGeneratedPath(null);
      setGenerateError(null);
      return;
    }

    // Validation passed — generate the path
    setErrors([]);
    const pathResult = buildPath(result.value);

    if (!pathResult.ok) {
      setGenerateError(pathResult.error);
      setGeneratedPath(null);
      return;
    }

    setGenerateError(null);
    setGeneratedPath(pathResult.data);
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        {/* Goal select (Req 10.1, 10.4) */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="path-goal"
            className="text-sm font-medium text-foreground"
          >
            Learning Goal
          </label>
          <select
            id="path-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-describedby={getFieldError("goal") ? "path-goal-error" : undefined}
            aria-invalid={!!getFieldError("goal")}
          >
            <option value="">Select a career path…</option>
            {careerPaths.map((cp) => (
              <option key={cp.id} value={cp.id}>
                {cp.name}
              </option>
            ))}
          </select>
          {getFieldError("goal") && (
            <p
              id="path-goal-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {getFieldError("goal")}
            </p>
          )}
        </div>

        {/* Hours per week input (Req 10.1, 10.6) */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="path-hours"
            className="text-sm font-medium text-foreground"
          >
            Available Hours per Week
          </label>
          <input
            id="path-hours"
            type="number"
            min={1}
            max={80}
            step={1}
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            placeholder="e.g. 10"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-describedby={
              getFieldError("hoursPerWeek") ? "path-hours-error" : undefined
            }
            aria-invalid={!!getFieldError("hoursPerWeek")}
          />
          {getFieldError("hoursPerWeek") && (
            <p
              id="path-hours-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {getFieldError("hoursPerWeek")}
            </p>
          )}
        </div>

        {/* Skill level select (Req 10.1, 10.5) */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="path-skill-level"
            className="text-sm font-medium text-foreground"
          >
            Current Skill Level
          </label>
          <select
            id="path-skill-level"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-describedby={
              getFieldError("skillLevel") ? "path-skill-level-error" : undefined
            }
            aria-invalid={!!getFieldError("skillLevel")}
          >
            <option value="">Select your skill level…</option>
            {SKILL_LEVEL_ORDER.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {getFieldError("skillLevel") && (
            <p
              id="path-skill-level-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {getFieldError("skillLevel")}
            </p>
          )}
        </div>

        {/* Submit button */}
        <Button type="submit" size="lg" className="self-start">
          Generate Learning Path
        </Button>
      </form>

      {/* Generation error */}
      {generateError && (
        <p role="alert" className="text-sm text-destructive">
          {generateError}
        </p>
      )}

      {/* Generated path view */}
      {generatedPath && (
        <GeneratedPathView
          path={generatedPath}
          hoursPerWeek={Number(hoursPerWeek) || 10}
        />
      )}
    </div>
  );
}
