"use client";

import { useState, useMemo } from "react";
import { X, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  buildComparison,
  canAddTool,
  canRemoveTool,
} from "@/lib/domain/comparison";
import type { Tool } from "@/lib/domain/types";

interface ComparisonViewProps {
  /** All available tools the user can pick from. */
  tools: Tool[];
}

/**
 * ComparisonView — client component for the /compare page (Req 9).
 *
 * Allows a user to select 2–4 tools and compare them side by side in a table
 * with seven fixed rows. Enforces min-2 / max-4 bounds with messages.
 */
export function ComparisonView({ tools }: ComparisonViewProps) {
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [maxMessage, setMaxMessage] = useState(false);
  const [minMessage, setMinMessage] = useState(false);

  const selectedTools = useMemo(
    () =>
      selectedToolIds
        .map((id) => tools.find((t) => t.id === id))
        .filter((t): t is Tool => t !== undefined),
    [selectedToolIds, tools]
  );

  const comparison = useMemo(
    () => (selectedTools.length >= 2 ? buildComparison(selectedTools) : null),
    [selectedTools]
  );

  const availableTools = useMemo(
    () => tools.filter((t) => !selectedToolIds.includes(t.id)),
    [tools, selectedToolIds]
  );

  function handleAddTool(toolId: string) {
    if (!canAddTool(selectedToolIds.length)) {
      setMaxMessage(true);
      setTimeout(() => setMaxMessage(false), 3000);
      return;
    }
    setMaxMessage(false);
    setMinMessage(false);
    setSelectedToolIds((prev) => [...prev, toolId]);
  }

  function handleRemoveTool(toolId: string) {
    if (!canRemoveTool(selectedToolIds.length)) {
      setMinMessage(true);
      setTimeout(() => setMinMessage(false), 3000);
      return;
    }
    setMinMessage(false);
    setMaxMessage(false);
    setSelectedToolIds((prev) => prev.filter((id) => id !== toolId));
  }

  return (
    <div className="space-y-6">
      {/* Tool selector */}
      <div className="space-y-3">
        <label
          htmlFor="tool-select"
          className="block text-sm font-medium text-foreground"
        >
          Add a tool to compare
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <select
            id="tool-select"
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleAddTool(e.target.value);
                e.target.value = "";
              }
            }}
            disabled={availableTools.length === 0}
            aria-label="Select a tool to add to comparison"
          >
            <option value="">
              {availableTools.length === 0
                ? "No more tools available"
                : "Select a tool…"}
            </option>
            {availableTools.map((tool) => (
              <option key={tool.id} value={tool.id}>
                {tool.name} ({tool.category})
              </option>
            ))}
          </select>
        </div>

        {/* Boundary messages */}
        {maxMessage && (
          <p
            role="alert"
            className="text-sm text-destructive font-medium"
          >
            Maximum of 4 tools can be compared
          </p>
        )}
        {minMessage && (
          <p
            role="alert"
            className="text-sm text-destructive font-medium"
          >
            At least 2 tools are required
          </p>
        )}
      </div>

      {/* Selected tool chips */}
      {selectedToolIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTools.map((tool) => (
            <span
              key={tool.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium text-foreground"
            >
              {tool.name}
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleRemoveTool(tool.id)}
                aria-label={`Remove ${tool.name} from comparison`}
              >
                <X className="size-3" />
              </Button>
            </span>
          ))}
        </div>
      )}

      {/* Instruction text when less than 2 tools selected */}
      {selectedToolIds.length < 2 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <Scale className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Select at least 2 tools to compare
          </p>
        </div>
      )}

      {/* Comparison table */}
      {comparison && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-40">
                  Feature
                </th>
                {comparison.tools.map((tool) => (
                  <th
                    key={tool.id}
                    className="px-4 py-3 text-left font-semibold text-foreground"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{tool.name}</span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleRemoveTool(tool.id)}
                        aria-label={`Remove ${tool.name} from comparison`}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row, rowIdx) => (
                <tr
                  key={row.label}
                  className={cn(
                    "border-b last:border-b-0",
                    rowIdx % 2 === 0 ? "bg-background" : "bg-muted/30"
                  )}
                >
                  <td className="px-4 py-3 font-medium text-muted-foreground">
                    {row.label}
                  </td>
                  {row.values.map((value, colIdx) => (
                    <td
                      key={`${row.label}-${colIdx}`}
                      className="px-4 py-3 text-foreground"
                    >
                      {value !== null ? (
                        value
                      ) : (
                        <span className="text-muted-foreground italic">
                          N/A
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
