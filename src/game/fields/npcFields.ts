import {
  Controls,
  attribute,
  section,
  type RowAttributeName,
} from "./_factories";

export const character_name = attribute({
  name: "character_name",
  label: "Name",
  control: Controls.Text,
  value: "",
});
export const instinct = attribute({
  name: "instinct",
  label: "Instinct",
  control: Controls.Number,
  value: 0,
});
export const description = attribute({
  name: "description",
  label: "Description",
  control: Controls.Textarea,
  value: "",
});
export const gear_notes = attribute({
  name: "gear_notes",
  label: "Equipment",
  control: Controls.Textarea,
  value: "",
});

export const npcAttributes = {
  character_name,
  instinct,
  description,
  gear_notes,
} as const;

export const trait_name = attribute({
  name: "trait_name",
  label: "Trait Name",
  control: Controls.Text,
  value: "",
});
export const trait_description = attribute({
  name: "trait_description",
  label: "Description",
  control: Controls.Textarea,
  value: "",
});

export const trait_settings = attribute({
  name: "trait_settings",
  label: "Settings",
  control: Controls.Checkbox,
  checkedValue: "on",
  checked: true,
});

export const npcTraits = section({
  name: "npctraits",
  attributes: {
    trait_name,
    trait_description,
    trait_settings,
  } as const,
});

export type NPCAttributeNames = keyof typeof npcAttributes;
export type NPCTraitFields = keyof typeof npcTraits.attributes;
export type NPCTraitAttributes = RowAttributeName<typeof npcTraits>;

export type AllNPCAttributes = NPCAttributeNames | NPCTraitAttributes;
