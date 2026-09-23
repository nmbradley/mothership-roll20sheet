<script lang="ts">
  import { sheet_toggle, settings_open } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";

  import CharacterSheet from "./CharacterSheet.svelte";
  import NPCSheet from "./NPCSheet.svelte";
  import SettingsSheet from "./SettingsSheet.svelte";
  import ShipSheet from "./ShipSheet.svelte";
</script>

<div class="sheet-wrapper">
  <Attribute field={sheet_toggle} />

  <input
    type="checkbox"
    id="attr_settings_open"
    class="settings-open-toggle"
    name="attr_{settings_open.name}"
    value={settings_open.checkedValue} />

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

.sheet-view {
  display: none;
}

input[name="attr_sheet_toggle"][value="pc"] ~ .sheet-view--pc,
input[name="attr_sheet_toggle"][value="npc"] ~ .sheet-view--npc,
input[name="attr_sheet_toggle"][value="ship"] ~ .sheet-view--ship {
  display: block;
}

input[name="attr_settings_open"]:checked ~ .sheet-view--settings {
  display: block;
}

input[name="attr_settings_open"]:checked ~ .sheet-view:not(.sheet-view--settings) {
  display: none;
}

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
