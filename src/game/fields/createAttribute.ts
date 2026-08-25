import {
  type FieldOption,
  type UiType,
  type UIType,
  resolveTypeAndSeed,
} from "./createSection";

export type {
  FieldOption,
  UiType,
  UIType,
};

export type AttributeArgs<TName extends string = string> = {
  name: TName;
  label: string;
  type?: "number" | "string" | "boolean";
  seed?: number | string | boolean;
  max?: boolean;
  uiType?: UiType;
  options?: readonly FieldOption[];
};

export type Attribute<TName extends string = string> = {
  name: TName;
  label: string;
  i18nlabel: string;
  type: "number" | "string" | "boolean";
  seed: number | string | boolean;
  i18nSeed: string;
  max: boolean;
  uiType: UiType;
  options?: readonly FieldOption[];
};

/**
 * Constructs a fully qualified Attribute object for Roll20.
 * Automatically generates i18n translation keys and infers missing
 * type, seed, or UI type information.
 */
export function createAttribute<TName extends string>({
  name,
  label,
  type,
  seed,
  max = false,
  uiType,
  options,
}: AttributeArgs<TName>): Attribute<TName> {
  const resolved = resolveTypeAndSeed(type, seed, name, undefined, uiType, options, max);
  return {
    name,
    label,
    i18nlabel: `label-${name}`,
    type: resolved.type,
    seed: resolved.seed,
    i18nSeed: `default-${name}`,
    max: resolved.max,
    uiType: resolved.uiType,
    ...(resolved.options !== undefined ? { options: resolved.options } : {}),
  };
}
