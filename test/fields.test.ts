import {
  describe,
  it,
  expect,
} from "vitest";
import { createAttribute } from "../src/game/fields/createAttribute";
import {
  createField,
  createSection,
  resolveTypeAndSeed,
} from "../src/game/fields/createSection";

describe("TypeScript Field Architecture", () => {
  describe("resolveTypeAndSeed", () => {
    it("should infer string type and default text uiType", () => {
      const result = resolveTypeAndSeed("string", undefined, "test");
      expect(result).toEqual({
        type: "string",
        seed: "",
        uiType: "text",
        max: false,
      });
    });

    it("should infer number type and default number uiType", () => {
      const result = resolveTypeAndSeed("number", undefined, "test");
      expect(result).toEqual({
        type: "number",
        seed: 0,
        uiType: "number",
        max: false,
      });
    });

    it("should infer number-max uiType when max is true", () => {
      const result = resolveTypeAndSeed("number", undefined, "test", undefined, undefined, undefined, true);
      expect(result).toEqual({
        type: "number",
        seed: 0,
        uiType: "number-max",
        max: true,
      });
    });

    it("should infer boolean type and default checkbox uiType", () => {
      const result = resolveTypeAndSeed("boolean", undefined, "test");
      expect(result).toEqual({
        type: "boolean",
        seed: "off",
        uiType: "checkbox",
        max: false,
      });
    });

    it("should infer type from seed when type is not provided", () => {
      const strResult = resolveTypeAndSeed(undefined, "hello", "test");
      expect(strResult).toEqual({
        type: "string",
        seed: "hello",
        uiType: "text",
        max: false,
      });

      const numResult = resolveTypeAndSeed(undefined, 42, "test");
      expect(numResult).toEqual({
        type: "number",
        seed: 42,
        uiType: "number",
        max: false,
      });

      const boolResult = resolveTypeAndSeed(undefined, true, "test");
      expect(boolResult).toEqual({
        type: "boolean",
        seed: true,
        uiType: "checkbox",
        max: false,
      });
    });

    it("should infer type from uiType when neither type nor seed are provided", () => {
      const textResult = resolveTypeAndSeed(undefined, undefined, "test", undefined, "textarea");
      expect(textResult).toEqual({
        type: "string",
        seed: "",
        uiType: "textarea",
        max: false,
      });

      const numResult = resolveTypeAndSeed(undefined, undefined, "test", undefined, "number-max");
      expect(numResult).toEqual({
        type: "number",
        seed: 0,
        uiType: "number-max",
        max: true,
      });

      const checkResult = resolveTypeAndSeed(undefined, undefined, "test", undefined, "checkbox");
      expect(checkResult).toEqual({
        type: "boolean",
        seed: "off",
        uiType: "checkbox",
        max: false,
      });
    });

    it("should infer select uiType and seed from options array", () => {
      const stringOptions = ["Option A", "Option B"];
      const result = resolveTypeAndSeed(
        undefined,
        undefined,
        "test",
        undefined,
        undefined,
        stringOptions,
      );
      expect(result).toEqual({
        type: "string",
        seed: "Option A",
        uiType: "select",
        max: false,
        options: stringOptions,
      });

      const objectOptions = [
        {
          label: "Alpha",
          value: "a",
        },
        {
          label: "Beta",
          value: "b",
        },
      ];
      const objResult = resolveTypeAndSeed(
        undefined,
        undefined,
        "test",
        undefined,
        undefined,
        objectOptions,
      );
      expect(objResult).toEqual({
        type: "string",
        seed: "a",
        uiType: "select",
        max: false,
        options: objectOptions,
      });
    });

    it("should throw an error if neither type, seed, nor uiType are provided", () => {
      expect(() => resolveTypeAndSeed(undefined, undefined, "invalid_field")).toThrow(
        "Attribute invalid_field has neither type nor seed",
      );
      expect(() => resolveTypeAndSeed(undefined, undefined, "invalid_field", "weapons")).toThrow(
        "weapons field invalid_field has neither type nor seed",
      );
    });
  });

  describe("createAttribute", () => {
    it("should construct a standard string attribute", () => {
      const attr = createAttribute({
        name: "character_name",
        label: "Character Name",
        type: "string",
      });
      expect(attr).toEqual({
        name: "character_name",
        label: "Character Name",
        i18nlabel: "label-character_name",
        type: "string",
        seed: "",
        i18nSeed: "default-character_name",
        max: false,
        uiType: "text",
      });
    });

    it("should construct a number-max attribute", () => {
      const attr = createAttribute({
        name: "health",
        label: "Health",
        type: "number",
        max: true,
      });
      expect(attr).toEqual({
        name: "health",
        label: "Health",
        i18nlabel: "label-health",
        type: "number",
        seed: 0,
        i18nSeed: "default-health",
        max: true,
        uiType: "number-max",
      });
    });

    it("should construct a select attribute with options", () => {
      const options = ["Marine", "Android", "Scientist", "Teamster"] as const;
      const attr = createAttribute({
        name: "character_class",
        label: "Class",
        uiType: "select",
        options,
      });
      expect(attr).toEqual({
        name: "character_class",
        label: "Class",
        i18nlabel: "label-character_class",
        type: "string",
        seed: "Marine",
        i18nSeed: "default-character_class",
        max: false,
        uiType: "select",
        options,
      });
    });

    it("should construct a hidden attribute", () => {
      const attr = createAttribute({
        name: "sheet_type",
        label: "Sheet Type",
        uiType: "hidden",
        seed: "character",
      });
      expect(attr).toEqual({
        name: "sheet_type",
        label: "Sheet Type",
        i18nlabel: "label-sheet_type",
        type: "string",
        seed: "character",
        i18nSeed: "default-sheet_type",
        max: false,
        uiType: "hidden",
      });
    });
  });

  describe("createField and createSection", () => {
    it("should construct repeating section fields with proper UI properties", () => {
      const weaponName = createField({
        name: "weapon_name",
        section: "weapons",
        label: "Weapon Name",
        type: "string",
      });
      const weaponType = createField({
        name: "weapon_type",
        section: "weapons",
        label: "Weapon Type",
        uiType: "select",
        options: ["Melee", "Ranged", "Heavy"],
      });
      const weaponAmmo = createField({
        name: "weapon_ammo",
        section: "weapons",
        label: "Ammo",
        type: "number",
        max: true,
      });

      expect(weaponName.uiType).toBe("text");
      expect(weaponType.uiType).toBe("select");
      expect(weaponType.seed).toBe("Melee");
      expect(weaponType.options).toEqual(["Melee", "Ranged", "Heavy"]);
      expect(weaponAmmo.uiType).toBe("number-max");
      expect(weaponAmmo.max).toBe(true);

      const section = createSection({
        name: "weapons",
        fields: {
          weaponName,
          weaponType,
          weaponAmmo,
        },
      });

      expect(section.name).toBe("repeating_weapons");
      expect(section.fields.weaponName).toBe(weaponName);
      expect(section.fields.weaponType).toBe(weaponType);
      expect(section.fields.weaponAmmo).toBe(weaponAmmo);
    });
  });
});
