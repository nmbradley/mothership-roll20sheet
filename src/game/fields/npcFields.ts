import {
  Controls,
  attribute,
  section,
  type RowAttributeName,
} from "./_factories";

// A PC and an NPC model the same kind of entity, so combat, wounds, health,
// armor_points and the attack row are the same attributes the PC sheet writes
// (see #90) -- statting an NPC and promoting it to a PC then keeps the data.
// Those fields live in pcFields.ts; only what has no PC equivalent is
// declared here. character_name is the longstanding exception: Roll20 links
// it to the journal entry, so both sheets write the same attribute.
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
// Renamed from `equipment`: the PC charactermancer writes attr_equipment as
// JSON'd loadout items, so an unprefixed name here would collide and the
// charactermancer would silently overwrite this free-text field (#90).
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

// Traits have no PC equivalent, so the section keeps its own name; only its
// member fields drop the npc_ prefix. Repeating section names cannot contain
// an underscore or Roll20 silently drops every row, which is also why the
// segment after "repeating_" stays concatenated.
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
