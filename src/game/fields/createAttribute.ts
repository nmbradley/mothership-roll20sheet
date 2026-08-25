import { resolveTypeAndSeed } from "./createSection";

export type AttributeArgs = {
  name: string;
  label: string;
  type?: "number" | "string" | "boolean";
  seed?: number | string | boolean;
  max: boolean;
};

export type Attribute = {
  name: string;
  label: string;
  i18nlabel: string;
  type: "number" | "string" | "boolean";
  seed: number | string | boolean;
  i18nSeed: string;
  max: boolean;
};

/**
 * Constructs a fully qualified Attribute object for Roll20.
 * Automatically generates i18n translation keys and infers missing
 * type or seed information.
 */
export function createAttribute({
  name, label, type, seed, max,
}: AttributeArgs): Attribute {
  const resolved = resolveTypeAndSeed(type, seed, name);
  return {
    name,
    label,
    i18nlabel: `label-${name}`,
    type: resolved.type,
    seed: resolved.seed,
    i18nSeed: `default-${name}`,
    max,
  };
}
