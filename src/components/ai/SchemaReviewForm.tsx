"use client";
import type {
  JsonObject,
  JsonValue,
  ToolSchema,
} from "../../types/ai-integration/generic-tool.contract";
import { Button } from "../ui/button";
import { compileBrowserContract } from "../../services/ai-v2.browser";
import { technicalField } from "./chat-presentation";

const label = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ");
export function SchemaReviewForm({
  schema,
  value,
  onChange,
  disabled,
}: {
  schema: ToolSchema;
  value: JsonObject;
  onChange: (value: JsonObject) => void;
  disabled: boolean;
}) {
  const field = (
    definition: ToolSchema,
    current: JsonValue | undefined,
    change: (next: JsonValue | undefined) => void,
    name: string,
    depth = 0,
  ): React.ReactNode => {
    if (depth > 8) return <p>Create a new request to edit this field.</p>;
    let rule = definition;
    const variants = (rule.anyOf ?? rule.oneOf) as ToolSchema[] | undefined;
    if (variants)
      rule =
        variants.find(
          (s) =>
            s.type !== "null" &&
            current !== undefined &&
            compileBrowserContract(s)(current),
        ) ??
        variants.find((s) => s.type !== "null") ??
        rule;
    if (rule.type === "object") {
      const object = (
        current && typeof current === "object" && !Array.isArray(current)
          ? current
          : {}
      ) as JsonObject;
      const properties = (rule.properties ?? {}) as Record<string, ToolSchema>;
      const required = (rule.required ?? []) as string[];
      return (
        <fieldset className="space-y-3 rounded-xl border border-border p-3">
          <legend className="px-1 text-xs font-semibold text-muted-foreground">
            {name}
          </legend>
          {Object.entries(properties)
            .filter(([key]) => !technicalField(key))
            .map(([key, sub]) => (
              <div key={key}>
                {field(
                  sub,
                  object[key],
                  (next) => {
                    const copy = { ...object };
                    if (next === undefined) delete copy[key];
                    else copy[key] = next;
                    change(copy);
                  },
                  (depth ? name + " / " : "") + String(sub.title ?? label(key)),
                  depth + 1,
                )}
                {!required.includes(key) && object[key] !== undefined && (
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      const copy = { ...object };
                      delete copy[key];
                      change(copy);
                    }}
                  >
                    Clear {label(key)}
                  </Button>
                )}
              </div>
            ))}
        </fieldset>
      );
    }
    if (rule.type === "array") {
      const items = Array.isArray(current) ? current : [];
      const itemSchema = rule.items as ToolSchema;
      return (
        <fieldset className="space-y-3 rounded-xl border border-border p-3">
          <legend className="px-1 text-xs font-semibold text-muted-foreground">
            {name}
          </legend>
          {items.map((item, index) => (
            <div key={index}>
              {field(
                itemSchema,
                item,
                (next) =>
                  change(
                    items.map((v, i) => (i === index ? (next ?? null) : v)),
                  ),
                name + " " + (index + 1),
                depth + 1,
              )}
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={disabled}
                onClick={() => change(items.filter((_, i) => i !== index))}
              >
                Remove {index + 1}
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={disabled || items.length >= Number(rule.maxItems ?? 20)}
            onClick={() =>
              change([
                ...items,
                itemSchema.type === "object"
                  ? {}
                  : ["number", "integer"].includes(String(itemSchema.type))
                    ? 0
                    : itemSchema.type === "boolean"
                      ? false
                      : itemSchema.type === "array"
                        ? []
                        : "",
              ])
            }
          >
            Add {name}
          </Button>
        </fieldset>
      );
    }
    if (rule.enum)
      return (
        <label className="block text-xs font-medium text-muted-foreground">
          {name}
          <select
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={name}
            disabled={disabled}
            value={String(current ?? "")}
            onChange={(e) =>
              change(
                (rule.enum as JsonValue[]).find(
                  (v) => String(v) === e.target.value,
                ),
              )
            }
          >
            <option value="">Select a value</option>
            {(rule.enum as JsonValue[]).map((v) => (
              <option key={String(v)} value={String(v)}>
                {String(v)}
              </option>
            ))}
          </select>
        </label>
      );
    if (rule.type === "boolean")
      return (
        <label className="block text-xs font-medium text-muted-foreground">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4 accent-primary"
            disabled={disabled}
            checked={current === true}
            onChange={(e) => change(e.target.checked)}
          />
          {name}
        </label>
      );
    if (["string", "number", "integer"].includes(String(rule.type))) {
      const numeric = rule.type !== "string";
      return (
        <label className="block text-xs font-medium text-muted-foreground">
          {name}
          <input
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            aria-label={name}
            disabled={disabled}
            type={numeric ? "number" : "text"}
            step={rule.type === "integer" ? 1 : "any"}
            min={
              numeric
                ? Number(rule.minimum ?? -Number.MAX_SAFE_INTEGER)
                : undefined
            }
            max={
              numeric
                ? Number(rule.maximum ?? Number.MAX_SAFE_INTEGER)
                : undefined
            }
            maxLength={Number(rule.maxLength ?? 4000)}
            value={
              typeof current === "number" || typeof current === "string"
                ? current
                : ""
            }
            onChange={(e) =>
              change(
                e.target.value === ""
                  ? undefined
                  : numeric
                    ? Number(e.target.value)
                    : e.target.value,
              )
            }
          />
        </label>
      );
    }
    return (
      <p>
        {name}: {JSON.stringify(current)} — This field is read-only.
      </p>
    );
  };
  return (
    <div>
      {field(
        schema,
        value,
        (next) => onChange(next as JsonObject),
        "Edit details",
      )}
    </div>
  );
}
