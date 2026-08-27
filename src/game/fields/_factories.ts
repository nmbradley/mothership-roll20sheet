import type { EntryOf } from "#game/enums";

/**
 * Control types backed by an `attr_`-prefixed input.
 *
 * Roll20 also supports `radio`, `range`, and attribute-backed `<span>`s for
 * read-only display. They are absent here because no component renders them yet.
 */
export const Controls = {
  Text: "text",
  Textarea: "textarea",
  Number: "number",
  Select: "select",
  Checkbox: "checkbox",
  Hidden: "hidden",
} as const;
export type Control = EntryOf<typeof Controls>;

/** Controls whose stored value is free text. */
type TextControl =
  | typeof Controls.Text
  | typeof Controls.Textarea
  | typeof Controls.Hidden;

export type SelectOption =
  | string
  | {
    label?: string;
    value: string | number;
  };

type Named<TName extends string> = {
  name: TName;
  label: string;
};

type Localized = {
  /** Translation key for `data-i18n` on the label. */
  i18nLabel: string;
  /** Set by {@link section}; absent on top-level attributes. */
  section?: string;
};

export type TextArgs<TName extends string = string> = Named<TName> & {
  control: TextControl;
  value: string;
  placeholder?: string;
};
export type TextAttribute<TName extends string = string> =
  TextArgs<TName> & Localized & {
    /** Translation key for `data-i18n-placeholder`. */
    i18nPlaceholder?: string;
  };

export type NumberArgs<TName extends string = string> = Named<TName> & {
  control: typeof Controls.Number;
  value: number;
  /** Seeds a companion `attr_<name>_max` input. Omit for a plain number field. */
  max?: number;
  placeholder?: number;
};
export type NumberAttribute<TName extends string = string> =
  NumberArgs<TName> & Localized;

export type SelectArgs<TName extends string = string> = Named<TName> & {
  control: typeof Controls.Select;
  options: readonly SelectOption[];
  /** Must match one option's value; rendered as `selected="selected"`. */
  value: string | number;
};
export type SelectAttribute<TName extends string = string> =
  SelectArgs<TName> & Localized;

export type CheckboxArgs<TName extends string = string> = Named<TName> & {
  control: typeof Controls.Checkbox;
  /** Stored when checked. Roll20 stores `"0"` when unchecked. */
  checkedValue: string | number;
  checked?: boolean;
};
export type CheckboxAttribute<TName extends string = string> =
  CheckboxArgs<TName> & Localized;

export type AttributeArgs<TName extends string = string> =
  | TextArgs<TName>
  | NumberArgs<TName>
  | SelectArgs<TName>
  | CheckboxArgs<TName>;

export type Attribute<TName extends string = string> =
  | TextAttribute<TName>
  | NumberAttribute<TName>
  | SelectAttribute<TName>
  | CheckboxAttribute<TName>;

/**
 * Words Roll20's security filter rejects anywhere in sheet code, including
 * attribute and class names.
 */
const FORBIDDEN_WORDS = [
  "data:",
  "eval",
  "cookie",
  "window",
  "parent",
  "this",
  "behaviour",
  "behavior",
  "expression",
  "moz-binding",
];

function assertAllowed(value: string, kind: string): void {
  const forbidden = FORBIDDEN_WORDS.find((word) => value.includes(word));
  if (forbidden) {
    throw new Error(
      `${kind} "${value}" contains "${forbidden}", which Roll20's security filter rejects`,
    );
  }
}

function assertAttributeName(name: string): void {
  if (!/^[a-z0-9_-]+$/.test(name)) {
    throw new Error(
      `Attribute name "${name}" must be lowercase alphanumerics, "_" or "-"`,
    );
  }
  assertAllowed(name, "Attribute name");
}

function assertSectionName(name: string): void {
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error(
      `Repeating section name "${name}" must be lowercase alphanumerics or "-"; `
      + "an underscore stops the section from saving",
    );
  }
  assertAllowed(name, "Repeating section name");
}

/**
 * Translation keys in this sheet are the display text itself, verbatim.
 *
 * Transforming the text was a steady source of bugs: a key that does not match
 * what the element shows lets two different labels collide on one entry, and
 * the sheet then renders one under the other's text. Keeping them identical
 * makes that impossible to express.
 */
export function i18nKey(text: string): string {
  return text;
}

/**
 * Builds an attribute for a Roll20 sheet, usable standalone or as a member of a
 * repeating section. The control determines which fields are required, so no
 * type or default is ever inferred.
 */
export function attribute<TName extends string>(args: TextArgs<TName>): TextAttribute<TName>;
export function attribute<TName extends string>(args: NumberArgs<TName>): NumberAttribute<TName>;
export function attribute<TName extends string>(args: SelectArgs<TName>): SelectAttribute<TName>;
export function attribute<TName extends string>(
  args: CheckboxArgs<TName>,
): CheckboxAttribute<TName>;
/**
 * Implementation signature; callers resolve to one of the overloads above.
 */
export function attribute<TName extends string>(
  args: AttributeArgs<TName>,
): Attribute<TName> {
  assertAttributeName(args.name);

  const localized: Attribute<TName> = {
    ...args,
    i18nLabel: i18nKey(args.label),
  };

  if ("placeholder" in args && typeof args.placeholder === "string") {
    return {
      ...localized,
      i18nPlaceholder: i18nKey(args.placeholder),
    } as TextAttribute<TName>;
  }

  return localized;
}

/**
 * A hidden twin of an existing attribute, for CSS to read.
 *
 * Conditional visibility on this sheet is CSS-driven, because a sheet runs no
 * JS outside its sheetworkers, so a selector has to match the current value as
 * an HTML attribute. A `<select>` never exposes one: its selection lives on
 * the chosen `<option>`, so `[value="x"]` matches nothing however the player
 * sets it. A `<textarea>` has the same problem, its content sitting between
 * the tags rather than in an attribute.
 *
 * Rendering this twin alongside the real control gives those selectors
 * something to bite on. Both carry the same `name`, so Roll20 treats them as
 * one attribute and keeps them in step; only the hidden one carries a `value`
 * attribute a selector can match.
 *
 * Render it inside whichever element the `:has()` is anchored on. Every row of
 * a repeating section emits the same `name`, so an unanchored selector lets
 * one row's value gate every row.
 */
export function cssMirror<TName extends string>(
  source: Attribute<TName>,
): TextAttribute<TName> {
  if (source.control === Controls.Checkbox) {
    throw new Error(
      `Attribute "${source.name}" is a checkbox, whose state CSS already reads `
      + "with :checked; mirroring it would only add an input that never matches",
    );
  }

  const mirror = attribute({
    name: source.name,
    label: source.label,
    control: Controls.Hidden,
    value: String(source.value),
  });

  return mirror;
}

export type SectionArgs<
  TName extends string = string,
  TAttributes extends Record<string, Attribute> = Record<string, Attribute>,
> = {
  name: TName;
  attributes: TAttributes;
};

export type Section<
  TName extends string = string,
  TAttributes extends Record<string, Attribute> = Record<string, Attribute>,
> = {
  name: `repeating_${TName}`;
  attributes: TAttributes;
};

/**
 * Wraps attributes into a Roll20 repeating section, prefixing the name with
 * "repeating_" and stamping it onto each member so callers never repeat it.
 */
export function section<
  TName extends string,
  TAttributes extends Record<string, Attribute>,
>({
  name,
  attributes,
}: SectionArgs<TName, TAttributes>): Section<TName, TAttributes> {
  assertSectionName(name);

  const sectionName = `repeating_${name}` as const;
  const members = Object.entries(attributes);
  const scopedEntries = members.map(([key, member]) => [
    key,
    {
      ...member,
      section: sectionName,
    },
  ]);
  const scoped = Object.fromEntries(scopedEntries) as TAttributes;

  return {
    name: sectionName,
    attributes: scoped,
  };
}

/** Fully qualified attribute name for one row of a repeating section. */
export type RowAttributeName<TSection extends Section> =
  `${TSection["name"]}_${string}_${keyof TSection["attributes"] & string}`;
