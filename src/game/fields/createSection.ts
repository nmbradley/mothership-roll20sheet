export type FieldArgs<TName extends string = string> = {
  name: TName;
  section: string;
  label: string;
  type?: "number" | "string" | "boolean";
  seed?: number | string | boolean;
  max?: boolean;
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
};

export type ResolvedFieldData = {
  type: "number" | "string" | "boolean";
  seed: number | string | boolean;
};

/**
 * Resolves the underlying data type and default seed value for a field.
 * Safely infers the type if only a seed is provided, and generates
 * an appropriate default seed if only a type is provided.
 */
export function resolveTypeAndSeed(
  type: FieldArgs["type"],
  seed: FieldArgs["seed"],
  name: string,
  section?: string,
): ResolvedFieldData {
  if (!type && seed === undefined) {
    const prefix = section ? `${section} field` : "Attribute";
    throw new Error(`${prefix} ${name} has neither type nor seed`);
  }

  let resolvedType = type;
  if (!resolvedType && seed !== undefined) {
    if (typeof seed === "string") resolvedType = "string";
    else if (typeof seed === "number") resolvedType = "number";
    else if (typeof seed === "boolean") resolvedType = "boolean";
  }

  let resolvedSeed = seed;
  if (!resolvedSeed) {
    if (resolvedType === "string") resolvedSeed = "";
    else if (resolvedType === "number") resolvedSeed = 0;
    else if (resolvedType === "boolean") resolvedSeed = "off";
  }

  if (!resolvedType || resolvedSeed === undefined) {
    throw new Error("Failed to resolve type or seed");
  }

  return {
    type: resolvedType,
    seed: resolvedSeed,
  };
}

/**
 * Constructs a fully qualified Field object for Roll20 repeating sections.
 * Automatically generates i18n translation keys and infers missing
 * type or seed information.
 */
export function createField<TName extends string>({
  name, section, label, type, seed, max = false,
}: FieldArgs<TName>): Field<TName> {
  const resolved = resolveTypeAndSeed(type, seed, name, section);
  return {
    name,
    section,
    label,
    i18nlabel: `label-${name}`,
    type: resolved.type,
    seed: resolved.seed,
    i18nSeed: `default-${name}`,
    max,
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
  name, fields,
}: SectionArgs<TName, TFields>): Section<`repeating_${TName}`, TFields> {
  return {
    name: `repeating_${name}`,
    fields,
  };
};
