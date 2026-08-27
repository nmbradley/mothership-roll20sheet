import {
  describe,
  it,
  expect,
} from "vitest";
import {
  Controls,
  attribute,
  cssMirror,
  section,
} from "../src/game/fields/_factories";

describe("TypeScript Field Architecture", () => {
  describe("attribute", () => {
    it("should construct a standard text attribute", () => {
      const attr = attribute({
        name: "character_name",
        label: "Character Name",
        control: Controls.Text,
        value: "",
      });
      expect(attr).toEqual({
        name: "character_name",
        label: "Character Name",
        i18nLabel: "Character Name",
        control: "text",
        value: "",
      });
    });

    it("should derive the translation key from the label verbatim", () => {
      const attr = attribute({
        name: "armor_points",
        label: "Armor Points",
        control: Controls.Number,
        value: 0,
      });
      expect(attr.i18nLabel).toBe("Armor Points");
    });

    it("should seed a companion _max input only when max is given", () => {
      const ranged = attribute({
        name: "health",
        label: "Health",
        control: Controls.Number,
        value: 3,
        max: 10,
      });
      expect(ranged.max).toBe(10);
      expect(ranged.value).toBe(3);

      const plain = attribute({
        name: "armor_points",
        label: "Armor Points",
        control: Controls.Number,
        value: 0,
      });
      expect(plain.max).toBeUndefined();
    });

    it("should translate a text placeholder but not a numeric one", () => {
      const text = attribute({
        name: "attack_name",
        label: "Attack",
        control: Controls.Text,
        value: "",
        placeholder: "Hand Axe",
      });
      expect(text.i18nPlaceholder).toBe("Hand Axe");

      const numeric = attribute({
        name: "combat",
        label: "Combat",
        control: Controls.Number,
        value: 0,
        placeholder: 0,
      });
      expect(numeric).not.toHaveProperty("i18nPlaceholder");
    });

    it("should keep the default option value for a select", () => {
      const options = ["Marine", "Android", "Scientist", "Teamster"] as const;
      const attr = attribute({
        name: "character_class",
        label: "Class",
        control: Controls.Select,
        options,
        value: "Marine",
      });
      expect(attr).toEqual({
        name: "character_class",
        label: "Class",
        i18nLabel: "Class",
        control: "select",
        options,
        value: "Marine",
      });
    });

    it("should store the checked value for a checkbox, defaulting to unchecked", () => {
      const attr = attribute({
        name: "has_shield",
        label: "Has Shield",
        control: Controls.Checkbox,
        checkedValue: 1,
      });
      expect(attr.checkedValue).toBe(1);
      expect(attr.checked).toBeUndefined();

      const preChecked = attribute({
        name: "has_shield",
        label: "Has Shield",
        control: Controls.Checkbox,
        checkedValue: 1,
        checked: true,
      });
      expect(preChecked.checked).toBe(true);
    });

    it("should construct a hidden attribute", () => {
      const attr = attribute({
        name: "sheet_type",
        label: "Sheet Type",
        control: Controls.Hidden,
        value: "character",
      });
      expect(attr).toEqual({
        name: "sheet_type",
        label: "Sheet Type",
        i18nLabel: "Sheet Type",
        control: "hidden",
        value: "character",
      });
    });
  });

  describe("attribute name validation", () => {
    it("should reject names that are not lowercase alphanumerics, _ or -", () => {
      expect(() => attribute({
        name: "Armor Points",
        label: "Armor Points",
        control: Controls.Text,
        value: "",
      })).toThrow("Attribute name \"Armor Points\" must be lowercase");
    });

    it("should reject names containing a word Roll20's security filter rejects", () => {
      expect(() => attribute({
        name: "parent_ship",
        label: "Parent Ship",
        control: Controls.Text,
        value: "",
      })).toThrow("contains \"parent\"");
    });
  });

  describe("cssMirror", () => {
    const equipment_type = attribute({
      name: "equipment_type",
      label: "Type",
      control: Controls.Select,
      options: ["Gear", "Armor"],
      value: "Gear",
    });

    it("shares the source's attribute name so Roll20 keeps the two in step", () => {
      const mirror = cssMirror(equipment_type);
      expect(mirror.name).toBe(equipment_type.name);
    });

    it("renders hidden, so it carries a value attribute CSS can match", () => {
      const mirror = cssMirror(equipment_type);
      expect(mirror.control).toBe(Controls.Hidden);
      expect(mirror.value).toBe("Gear");
    });

    it("stringifies a numeric source value, since a hidden input stores text", () => {
      const mirror = cssMirror(attribute({
        name: "range_band",
        label: "Range",
        control: Controls.Select,
        options: [1, 2],
        value: 2,
      }));
      expect(mirror.value).toBe("2");
    });

    it("leaves the source untouched", () => {
      cssMirror(equipment_type);
      expect(equipment_type.control).toBe(Controls.Select);
    });

    it("rejects a checkbox, whose state CSS already reads with :checked", () => {
      const settings_open = attribute({
        name: "settings_open",
        label: "Settings Open",
        control: Controls.Checkbox,
        checkedValue: "on",
      });
      expect(() => cssMirror(settings_open)).toThrow(/checkbox/);
    });
  });

  describe("section", () => {
    it("should prefix the section name with repeating_", () => {
      const weapons = section({
        name: "weapons",
        attributes: {
          weapon_name: attribute({
            name: "weapon_name",
            label: "Weapon Name",
            control: Controls.Text,
            value: "",
          }),
        },
      });
      expect(weapons.name).toBe("repeating_weapons");
    });

    it("should stamp the prefixed section name onto every member", () => {
      const weapons = section({
        name: "weapons",
        attributes: {
          weapon_name: attribute({
            name: "weapon_name",
            label: "Weapon Name",
            control: Controls.Text,
            value: "",
          }),
          weapon_ammo: attribute({
            name: "weapon_ammo",
            label: "Ammo",
            control: Controls.Number,
            value: 0,
            max: 0,
          }),
        },
      });
      expect(weapons.attributes.weapon_name.section).toBe("repeating_weapons");
      expect(weapons.attributes.weapon_ammo.section).toBe("repeating_weapons");
    });

    it("should reject a section name containing an underscore", () => {
      expect(() => section({
        name: "other_gear",
        attributes: {},
      })).toThrow("an underscore stops the section from saving");
    });

    it("should reject an uppercase section name", () => {
      expect(() => section({
        name: "shipWeapons",
        attributes: {},
      })).toThrow("Repeating section name \"shipWeapons\" must be lowercase");
    });
  });
});
