"use client";
import type {
  JsonObject,
  JsonValue,
  ToolSchema,
} from "../../types/ai-integration/generic-tool.contract";
import { compileBrowserContract } from "../../services/ai-v2.browser";

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
    if (depth > 8) return <p>এই field edit করতে নতুন request দিন।</p>;
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
        <fieldset className="space-y-3 rounded border p-3">
          <legend>{name}</legend>
          {Object.entries(properties).map(([key, sub]) => (
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
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    const copy = { ...object };
                    delete copy[key];
                    change(copy);
                  }}
                >
                  বাদ দিন / Clear {label(key)}
                </button>
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
        <fieldset className="space-y-2 rounded border p-3">
          <legend>{name}</legend>
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
              <button
                type="button"
                disabled={disabled}
                onClick={() => change(items.filter((_, i) => i !== index))}
              >
                মুছুন / Remove {index + 1}
              </button>
            </div>
          ))}
          <button
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
            যোগ করুন / Add {name}
          </button>
        </fieldset>
      );
    }
    if (rule.enum)
      return (
        <label className="block">
          {name}
          <select
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
            <option value="">নির্বাচন করুন / Select</option>
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
        <label className="block">
          <input
            type="checkbox"
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
        <label className="block">
          {name}
          <input
            className="mt-1 w-full rounded border p-2"
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
        {name}: {JSON.stringify(current)} — এই field read-only।
      </p>
    );
  };
  return (
    <div>
      {field(
        schema,
        value,
        (next) => onChange(next as JsonObject),
        "পরিবর্তন / Edit",
      )}
    </div>
  );
}
