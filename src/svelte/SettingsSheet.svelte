<script lang="ts">
  import {
    attack_modifier, military_training, save_skill_select, sheet_toggle_select, speed_initiative,
  } from "#game/fields/pcFields.js";
  import { ship_npc } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";

  // Grouped so the page can absorb more settings without turning back into a
  // flat list. A group with no rows renders nothing -- see the {#if} in the
  // markup below -- rather than an empty box; NPC and Roll are placeholders
  // until settings land there.
  const groups = [
    {
      title: "PC",
      slug: "pc",
      // #6: attack_modifier is added to every attack regardless of which
      // sheet view is active -- repeating_attacks and its click handler are
      // shared with the NPC sheet (#90), and this is one attribute per
      // character rather than per view.
      rows: [speed_initiative, save_skill_select, military_training, attack_modifier],
    },
    {
      // #62: only meaningful once a ship is the active sheet -- gated in CSS
      // below the same way Sheet.svelte gates the sheet views themselves.
      title: "Ship",
      slug: "ship",
      rows: [ship_npc],
    },
    {
      title: "NPC",
      slug: "npc",
      rows: [],
    },
    {
      title: "Roll",
      slug: "roll",
      rows: [],
    },
  ];
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

  <!-- Sheet type sits outside the groups below -- it picks which sheet you're on. -->
  <Panel title="Settings" corner="small">
    <div class="settings-sheet__rows">
      <SettingsRow field={sheet_toggle_select}>
        <Attribute field={sheet_toggle_select} isLabelHidden />
      </SettingsRow>
    </div>
  </Panel>

  {#each groups as group (group.slug)}
    {#if group.rows.length > 0}
      <div class="settings-sheet__group settings-sheet__group--{group.slug}">
        <Panel title={group.title} corner="small">
          <div class="settings-sheet__rows">
            {#each group.rows as field (field.name)}
              <SettingsRow {field}>
                <Attribute {field} isLabelHidden />
              </SettingsRow>
            {/each}
          </div>
        </Panel>
      </div>
    {/if}
  {/each}

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

  &__group--ship {
    display: none;
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

// The Ship group only makes sense once a ship is the active sheet -- gated
// off sheet_toggle the same way Sheet.svelte gates the sheet views
// themselves, since a sheet cannot run JS to hide it instead. Gated on the
// whole group, not just its row, so switching away from Ship doesn't leave
// an empty panel box behind.
input[name="attr_sheet_toggle"][value="ship"] ~ .sheet-view--settings .settings-sheet__group--ship {
  display: block;
}
</style>
