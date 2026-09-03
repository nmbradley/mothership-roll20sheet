import {
  describe, it, expect, vi,
} from "vitest";

import { classes } from "../src/game/data/classes";
import { Skills } from "../src/game/enums";
import {
  advanceSkillChoice, applyClass, maxWounds, statModifiers,
} from "../src/ts/charactermancer/3-class";

/** Stubs the globals `applyClass` needs and returns the `setAttrs` spy. */
function stubApplyClassGlobals(): ReturnType<typeof vi.fn> {
  const mockSetAttrs = vi.fn();
  vi.stubGlobal("getCharmancerData", () => ({}));
  vi.stubGlobal("clearRepeatingSections", vi.fn());
  vi.stubGlobal("setAttrs", mockSetAttrs);
  vi.stubGlobal("setCharmancerText", vi.fn());
  return mockSetAttrs;
}

describe("Charactermancer Class Step (Mothership 1e)", () => {
  describe("statModifiers", () => {
    it("should apply only the flat stat bonus when nothing is chosen", () => {
      const mods = statModifiers(classes.marine);
      expect(mods).toEqual({
        strength: 0,
        speed: 0,
        intellect: 0,
        combat: 10,
      });
    });

    it("should leave a class without a floating bonus unaffected by a choice", () => {
      const mods = statModifiers(classes.marine, "speed");
      expect(mods["speed"]).toBe(0);
    });

    it("should apply the Android's -10 to the stat the player chose", () => {
      const mods = statModifiers(classes.android, "strength");
      expect(mods["strength"]).toBe(-10);
      expect(mods["intellect"]).toBe(20);
    });

    it("should leave the Android's floating bonus unapplied until a stat is chosen", () => {
      const mods = statModifiers(classes.android);
      expect(mods).toEqual({
        strength: 0,
        speed: 0,
        intellect: 20,
        combat: 0,
      });
    });

    it("should apply the Scientist's +5 on top of an already-bonused stat", () => {
      const mods = statModifiers(classes.scientist, "intellect");
      expect(mods["intellect"]).toBe(15);
    });

    it("should apply the Scientist's +5 to an unrelated stat", () => {
      const mods = statModifiers(classes.scientist, "speed");
      expect(mods["speed"]).toBe(5);
      expect(mods["intellect"]).toBe(10);
    });

    it("should give the Teamster a uniform bonus regardless of any choice", () => {
      const mods = statModifiers(classes.teamster, "combat");
      expect(mods).toEqual({
        strength: 5,
        speed: 5,
        intellect: 5,
        combat: 5,
      });
    });
  });

  describe("maxWounds", () => {
    it("should be the printed base of 2 for a class with no wound bonus", () => {
      expect(maxWounds(classes.teamster)).toBe(2);
      expect(maxWounds(classes.scientist)).toBe(2);
    });

    it("should add the Marine's +1 wound bonus", () => {
      expect(maxWounds(classes.marine)).toBe(3);
    });

    it("should add the Android's +1 wound bonus", () => {
      expect(maxWounds(classes.android)).toBe(3);
    });
  });

  describe("applyClass", () => {
    it("should write only the Wound maximum, leaving current Wounds untouched (#179)", () => {
      const mockSetAttrs = stubApplyClassGlobals();

      applyClass(classes.marine);

      expect(mockSetAttrs).toHaveBeenCalledWith(expect.objectContaining({ wounds_max: 3 }));
      const written = mockSetAttrs.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(written).not.toHaveProperty("wounds");

      vi.unstubAllGlobals();
    });

    it("should update the maximum without resetting current Wounds when the class changes", () => {
      const mockSetAttrs = stubApplyClassGlobals();

      applyClass(classes.marine);
      applyClass(classes.teamster);

      expect(mockSetAttrs).toHaveBeenLastCalledWith(expect.objectContaining({ wounds_max: 2 }));
      for (const call of mockSetAttrs.mock.calls) {
        expect(call[0] as Record<string, unknown>).not.toHaveProperty("wounds");
      }

      vi.unstubAllGlobals();
    });
  });

  describe("advanceSkillChoice (#187)", () => {
    it("should do nothing when nothing was actually chosen yet", () => {
      const mockGetRepeatingSections = vi.fn();
      vi.stubGlobal("getRepeatingSections", mockGetRepeatingSections);

      advanceSkillChoice("row1", "choose");
      advanceSkillChoice(undefined, Skills.Hyperspace);

      expect(mockGetRepeatingSections).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it("should add a picker row when the chosen skill's own prerequisite is a choice", () => {
      const mockAddRepeatingSection = vi.fn((
        _section: string,
        _data: string,
        callback?: (rowId: string) => void,
      ) => {
        callback?.("row2");
      });
      const mockSetCharmancerOptions = vi.fn();
      vi.stubGlobal("getRepeatingSections", (_section: string, callback: (details: { list: string[] }) => void) => {
        callback({ list: ["row1"] });
      });
      vi.stubGlobal("removeRepeatingRow", vi.fn());
      vi.stubGlobal("addRepeatingSection", mockAddRepeatingSection);
      vi.stubGlobal("setCharmancerOptions", mockSetCharmancerOptions);

      // Hyperspace's Expert prerequisites are Piloting, Physics or Mysticism --
      // a real choice, so a picker row follows the Master pick.
      advanceSkillChoice("row1", Skills.Hyperspace);

      expect(mockAddRepeatingSection).toHaveBeenCalledWith(
        "sheet-t__skill_choice",
        "skillselection",
        expect.any(Function),
      );
      expect(mockSetCharmancerOptions).toHaveBeenCalledWith(
        "row2_skill",
        [Skills.Piloting, Skills.Physics, Skills.Mysticism],
      );
      vi.unstubAllGlobals();
    });

    it("should add nothing further once the chosen skill grants its prerequisite outright", () => {
      const mockAddRepeatingSection = vi.fn();
      vi.stubGlobal("getRepeatingSections", (_section: string, callback: (details: { list: string[] }) => void) => {
        callback({ list: ["row1", "row2"] });
      });
      vi.stubGlobal("removeRepeatingRow", vi.fn());
      vi.stubGlobal("addRepeatingSection", mockAddRepeatingSection);
      vi.stubGlobal("setCharmancerOptions", vi.fn());

      // Piloting's only Trained prerequisite is Zero-G: nothing to ask.
      advanceSkillChoice("row2", Skills.Piloting);

      expect(mockAddRepeatingSection).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it("should remove every row after the one that changed, invalidating stale downstream picks", () => {
      const mockRemoveRepeatingRow = vi.fn();
      vi.stubGlobal("getRepeatingSections", (_section: string, callback: (details: { list: string[] }) => void) => {
        callback({ list: ["row1", "row2", "row3"] });
      });
      vi.stubGlobal("removeRepeatingRow", mockRemoveRepeatingRow);
      vi.stubGlobal("addRepeatingSection", vi.fn());
      vi.stubGlobal("setCharmancerOptions", vi.fn());

      // Re-picking the Master row invalidates whatever the Expert and Trained
      // tier rows below it had chosen.
      advanceSkillChoice("row1", Skills.Command);

      expect(mockRemoveRepeatingRow).toHaveBeenCalledWith("row2");
      expect(mockRemoveRepeatingRow).toHaveBeenCalledWith("row3");
      vi.unstubAllGlobals();
    });
  });
});
