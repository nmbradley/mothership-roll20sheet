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

  let resolvedType = type;
  if (!resolvedType) {
    if (seed !== undefined) {
      if (typeof seed === "string") resolvedType = "string";
      else if (typeof seed === "number") resolvedType = "number";
      else if (typeof seed === "boolean") resolvedType = "boolean";
    } else if (uiType) {
      if (uiType === "number" || uiType === "number-max") {
        resolvedType = "number";
      } else if (uiType === "checkbox") {
        resolvedType = "boolean";
      } else {
        resolvedType = "string";
      }
    } else if (options && options.length > 0) {
      const firstOption = options[0];
      if (typeof firstOption === "object" && typeof firstOption.value === "number") {
        resolvedType = "number";
      } else if (typeof firstOption === "number") {
        resolvedType = "number";
      } else {
        resolvedType = "string";
      }
    }
  }

  let resolvedUiType = uiType;
  if (!resolvedUiType) {
    if (resolvedType === "number") {
      resolvedUiType = max ? "number-max" : "number";
    } else if (resolvedType === "boolean") {
      resolvedUiType = "checkbox";
    } else if (options && options.length > 0) {
      resolvedUiType = "select";
    } else {
      resolvedUiType = "text";
    }
  }

  const isNumberMax = max || resolvedUiType === "number-max";

  let resolvedSeed = seed;
  if (resolvedSeed === undefined || (resolvedSeed === false && resolvedType === "boolean")) {
    if (resolvedType === "string") {
      if (resolvedUiType === "select" && options && options.length > 0) {
        const firstOption = options[0];
        if (typeof firstOption === "object") {
          resolvedSeed = firstOption.value;
        } else {
          resolvedSeed = firstOption;
        }
      } else {
        resolvedSeed = "";
      }
    } else if (resolvedType === "number") {
      if (resolvedUiType === "select" && options && options.length > 0) {
        const firstOption = options[0];
        if (typeof firstOption === "object") {
          resolvedSeed = firstOption.value;
        } else {
          resolvedSeed = firstOption;
        }
      } else {
        resolvedSeed = 0;
      }
    } else if (resolvedType === "boolean") {
      resolvedSeed = "off";
    }
  }

  if (!resolvedType || resolvedSeed === undefined) {
    throw new Error("Failed to resolve type or seed");
  }

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
