export type UiType =
  | "text"
  | "number"
  | "number-max"
  | "textarea"
  | "select"
  | "checkbox"
  | "hidden";

export type UIType = UiType;

export type FieldOption =
  | string
  | {
    label?: string;
    value: string | number;
  };

export type FieldArgs<TName extends string = string> = {
  name: TName;
  section: string;
  label: string;
  type?: "number" | "string" | "boolean";
  seed?: number | string | boolean;
  max?: boolean;
  uiType?: UiType;
  options?: readonly FieldOption[];
};

export type Field<TName extends string = string> = {
  name: TName;
  section: string;
  label: string;
  i18nlabel: string;
  type: "number" | "string" | "boolean";
  seed: number | string | boolean;
  i18nSeed: string;
  max: boolean;
  uiType: UiType;
  options?: readonly FieldOption[];
};

export type ResolvedFieldData = {
  type: "number" | "string" | "boolean";
  seed: number | string | boolean;
  uiType: UiType;
  max: boolean;
  options?: readonly FieldOption[];
};

function inferType(
  type?: FieldArgs["type"],
  seed?: FieldArgs["seed"],
  uiType?: UiType,
  options?: readonly FieldOption[],
): "number" | "string" | "boolean" {
  if (type) return type;

  if (seed !== undefined) {
    if (typeof seed === "number") return "number";
    if (typeof seed === "boolean") return "boolean";
    return "string";
  }

  if (uiType) {
    if (uiType === "number" || uiType === "number-max") return "number";
    if (uiType === "checkbox") return "boolean";
    return "string";
  }

  if (options && options.length > 0) {
    const firstOption = options[0];
    const val = typeof firstOption === "object" ? firstOption.value : firstOption;
    return typeof val === "number" ? "number" : "string";
  }

  return "string"; // Default fallback
}

function inferUiType(
  type: "number" | "string" | "boolean",
  uiType?: UiType,
  options?: readonly FieldOption[],
  max?: boolean,
): UiType {
  if (uiType) return uiType;
  if (type === "boolean") return "checkbox";
  if (options && options.length > 0) return "select";
  if (type === "number") return max ? "number-max" : "number";
  return "text";
}

function inferSeed(
  type: "number" | "string" | "boolean",
  seed?: FieldArgs["seed"],
  uiType?: UiType,
  options?: readonly FieldOption[],
): string | number | boolean {
  if (seed !== undefined && !(seed === false && type === "boolean")) return seed;

  if (type === "boolean") return "off";
  if (uiType === "select" && options && options.length > 0) {
    const firstOption = options[0];
    return typeof firstOption === "object" ? firstOption.value : firstOption;
  }

  return type === "number" ? 0 : "";
}

/**
 * Resolves the underlying data type, default seed value, and UI type for a field.
 * Safely infers missing type, seed, or UI type information with sound fallbacks.
 */
export function resolveTypeAndSeed(
  type: FieldArgs["type"],
  seed: FieldArgs["seed"],
  name: string,
  section?: string,
  uiType?: UiType,
  options?: readonly FieldOption[],
  max = false,
): ResolvedFieldData {
  if (!type && seed === undefined && !uiType && (!options || options.length === 0)) {
    const prefix = section ? `${section} field` : "Attribute";
    throw new Error(`${prefix} ${name} has neither type nor seed`);
  }

  const resolvedType = inferType(type, seed, uiType, options);
  const resolvedUiType = inferUiType(resolvedType, uiType, options, max);
  const resolvedSeed = inferSeed(resolvedType, seed, resolvedUiType, options);
  const isNumberMax = max || resolvedUiType === "number-max";

  return {
    type: resolvedType,
    seed: resolvedSeed,
    uiType: resolvedUiType,
    max: isNumberMax,
    ...(options !== undefined ? { options } : {}),
  };
}

/**
 * Constructs a fully qualified Field object for Roll20 repeating sections.
 * Automatically generates i18n translation keys and infers missing
 * type, seed, or UI type information.
 */
export function createField<TName extends string>({
  name,
  section,
  label,
  type,
  seed,
  max = false,
  uiType,
  options,
}: FieldArgs<TName>): Field<TName> {
  const resolved = resolveTypeAndSeed(type, seed, name, section, uiType, options, max);
  return {
    name,
    section,
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

export type SectionArgs<
  TName extends string = string,
  TFields extends Record<string, Field> = Record<string, Field>,
> = {
  name: TName;
  fields: TFields;
};

export type Section<
  TName extends string = string,
  TFields extends Record<string, Field> = Record<string, Field>,
> = {
  name: TName;
  fields: TFields;
};

/**
 * Wraps an object of fields into a Roll20 repeating section.
 * Automatically prefixes the section name with "repeating_".
 */
export function createSection<
  TName extends string,
  TFields extends Record<string, Field>,
>({
  name,
  fields,
}: SectionArgs<TName, TFields>): Section<`repeating_${TName}`, TFields> {
  return {
    name: `repeating_${name}`,
    fields,
  };
}
