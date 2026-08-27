<script lang="ts">
  import {
    sheet_toggle_select, speed_initiative,
  } from "#game/fields/pcFields.js";
  import { ship_npc } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";
</script>

<!--
  Peer of CharacterSheet / NPCSheet / ShipSheet, shown by Sheet.svelte in
  place of whichever of those is active -- see settings_open in pcFields.ts.
  Rows specific to one sheet type are gated in CSS below, the same way
  Sheet.svelte gates the sheet views themselves off sheet_toggle.
-->
<div class="settings-sheet">
  <label for="attr_settings_open" class="settings-sheet__back" data-i18n="Back">
    &larr; Back
  </label>

  <Panel title="Settings" corner="small">
    <div class="settings-sheet__rows">
      <SettingsRow field={sheet_toggle_select}>
        <Attribute field={sheet_toggle_select} isLabelHidden />
      </SettingsRow>

      <SettingsRow field={speed_initiative}>
        <Attribute field={speed_initiative} isLabelHidden />
      </SettingsRow>

      <!-- #62: only meaningful once a ship is the active sheet. -->
      <div class="settings-sheet__gate settings-sheet__gate--ship">
        <SettingsRow field={ship_npc}>
          <Attribute field={ship_npc} isLabelHidden />
        </SettingsRow>
      </div>

      <!--
        #9 hasn't settled on an attribute name yet, so there is nothing to
        bind here -- this row is a placeholder, not a control.
      -->
      <div class="settings-sheet__row settings-sheet__row--placeholder">
        <span class="settings-sheet__label" data-i18n="Skill Select for Saves">
          Skill Select for Saves
        </span>
        <span class="settings-sheet__placeholder-note" data-i18n="Coming soon">
          Coming soon
        </span>
      </div>

      <!--
        Roll20's charactermancer navigation: a `back`-type button whose value
        names the page to jump to, usable from anywhere in the sheet, not
        only from inside a <charmancer> block.
      -->
      <button
        class="settings-sheet__charmancer-launch"
        type="back"
        value="intro"
        data-i18n="Launch Charactermancer"
      >
        Launch Charactermancer
      </button>
    </div>
  </Panel>
</div>

<style lang="scss">
.settings-sheet {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-lg);

  box-sizing: border-box;
  padding: var(--ms-space-lg);

  background-color: var(--ms-surface);

  color: var(--ms-fg);

  &__back {
    align-self: flex-start;

    cursor: pointer;

    font-size: var(--ms-text-sm);
    font-family: var(--ms-font-header);
    font-weight: 700;
    text-transform: uppercase;
    color: var(--ms-fg-muted);

    &:hover {
      color: var(--ms-accent);
    }
  }

  &__rows {
    display: flex;
    flex-direction: column;
    gap: var(--ms-space-lg);
  }

  &__gate {
    display: none;
  }

  &__row {
    display: flex;
    flex-direction: column;
    gap: var(--ms-space-sm);
  }

  &__label {
    font-size: var(--ms-text-sm);
    font-family: var(--ms-font-header);
    font-weight: 700;
    color: var(--ms-fg-muted);
  }

  &__placeholder-note {
    font-size: var(--ms-text-sm);
    font-style: italic;
    color: var(--ms-fg-muted);
  }

  &__charmancer-launch {
    @extend %ms-btn-reset;

    align-self: flex-start;

    border: var(--ms-border-width) solid var(--ms-border);
    border-radius: var(--ms-radius-sm);
    padding: var(--ms-space-sm) var(--ms-space-md);

    background: var(--ms-surface);
    cursor: pointer;

    color: var(--ms-fg);

    &:hover {
      background: var(--ms-sunken);
    }
  }
}

// Rows scoped to one sheet type only make sense once that sheet is the
// active one -- gated off sheet_toggle the same way Sheet.svelte gates the
// sheet views themselves, since a sheet cannot run JS to hide them instead.
input[name="attr_sheet_toggle"][value="ship"] ~ .sheet-view--settings .settings-sheet__gate--ship {
  display: block;
}
</style>
