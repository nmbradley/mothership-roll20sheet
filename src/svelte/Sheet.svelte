<script lang="ts">
  import { sheet_toggle, settings_open } from "#game/fields/pcFields.js";
    import Attribute from "#svelte/components/Attribute.svelte";

  import CharacterSheet from "./CharacterSheet.svelte";
  import NPCSheet from "./NPCSheet.svelte";
  import SettingsSheet from "./SettingsSheet.svelte";
  import ShipSheet from "./ShipSheet.svelte";
</script>

<div class="sheet-wrapper">
  <!--
    The hidden input is what the CSS switches on, and it has to sit here as a
    sibling of the three sheets for the general-sibling selector to reach them.
    A <select> cannot stand in for it: its selection lives on the chosen option,
    not as a `value` attribute on the select itself, so an attribute selector
    would never match. The two share an attribute name and Roll20 keeps them in
    step.
  -->
  <Attribute field={sheet_toggle} />

  <!--
    Written directly rather than through <Attribute>: the logo in each header
    and the back button on the settings page all need to toggle this box from
    elsewhere in the markup, which only works with a stable id a <label for>
    can target. AttributeCheckbox never emits one, since a repeating-row
    checkbox would duplicate that id across rows and every label would then
    drive the first row's box. settings_open is a top-level attribute, so one
    id is safe here.
  -->
  <input
    type="checkbox"
    id="attr_settings_open"
    class="settings-open-toggle"
    name="attr_{settings_open.name}"
    value={settings_open.checkedValue}
  />

  <div class="sheet-view sheet-view--pc">
    <CharacterSheet />
  </div>

  <div class="sheet-view sheet-view--ship">
    <ShipSheet />
  </div>

  <div class="sheet-view sheet-view--npc">
    <NPCSheet />
  </div>

  <div class="sheet-view sheet-view--settings">
    <SettingsSheet />
  </div>
</div>

<style lang="scss">
.sheet-wrapper {
  font-family: var(--ms-font-body);
}

.sheet-picker {
  display: flex;
  gap: var(--ms-space-sm);
  align-items: center;

  margin-bottom: var(--ms-space-md);

  &__label {
    font-size: var(--ms-text-sm);
    font-family: var(--ms-font-header);
    font-weight: 700;
    text-transform: uppercase;
    color: var(--ms-fg-muted);
  }
}

// Sheet switching happens in CSS because a sheet cannot run JS outside its
// sheetworkers. Roll20 keeps the hidden input's `value` attribute in step with
// the stored attribute, so these selectors re-evaluate whenever it changes.
.sheet-view {
  display: none;
}

// Written flat rather than nested under the input: `&[value=...] ~ .x` inside
// a parent selector crashes svelte/valid-compile when it remaps warning
// positions, and the flat form reads more plainly anyway.
input[name="attr_sheet_toggle"][value="pc"] ~ .sheet-view--pc,
input[name="attr_sheet_toggle"][value="npc"] ~ .sheet-view--npc,
input[name="attr_sheet_toggle"][value="ship"] ~ .sheet-view--ship {
  display: block;
}

// Settings is a fourth view layered over whichever sheet is active rather
// than a fourth value of sheet_toggle -- see settings_open in pcFields.ts.
// Checking it swaps Settings in for every other view without touching
// sheet_toggle, so backing out (unchecking) reveals that sheet unchanged.
input[name="attr_settings_open"]:checked ~ .sheet-view--settings {
  display: block;
}

input[name="attr_settings_open"]:checked ~ .sheet-view:not(.sheet-view--settings) {
  display: none;
}

// The checkbox itself never renders; only the labels bound to its id do.
.settings-open-toggle {
  position: absolute;

  overflow: hidden;
  clip: rect(0 0 0 0);

  width: 1px;
  height: 1px;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
}
</style>
