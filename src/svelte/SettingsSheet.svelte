<script lang="ts">
  import {
    attack_modifier, save_skill_select, sheet_toggle_select, speed_initiative,
  } from "#game/fields/pcFields.js";
  import { ship_npc } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Button from "#svelte/components/Button.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";

  // Grouped so the page can absorb more settings without turning back into a
  // flat list. A group with no rows renders nothing -- see the {#if} in the
  // markup below -- rather than an empty box; NPC is a placeholder until
  // settings land there, and Roll is sheet-agnostic so it carries no gate.
  const groups = [
    {
      title: "PC",
      slug: "pc",
      // #6: attack_modifier is added to every attack regardless of which
      // sheet view is active -- repeating_attacks and its click handler are
      // shared with the NPC sheet (#90), and this is one attribute per
      // character rather than per view.
      rows: [speed_initiative, save_skill_select, attack_modifier],
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
  <!-- Sheet type sits outside the groups below -- it picks which sheet you're on. -->
  <Panel title="Settings" corner="small">
    <!--
      The page's two navigation actions, paired on one row inside the frame
      rather than floating above it. The back control drives settings_open
      through a <label for>, which needs the stable id Sheet.svelte declares
      on the hidden checkbox -- settings is a view layered over whichever
      sheet is active, not a fourth value of sheet_toggle, so this unchecks
      the box rather than touching the sheet type.
    -->
    <div class="settings-sheet__nav">
      <label for="attr_settings_open" class="settings-sheet__back button">
        <span aria-hidden="true">&larr;</span>
        <span data-i18n="Back">Back</span>
      </label>

      <!--
        An action button, not a `back`-type one. `type="back"` is the
        charactermancer's own page-to-page navigation and only binds inside a
        <charmancer> block -- on the sheet itself it does nothing at all,
        which is how this arrived silently broken. Launching from outside
        goes through startCharactermancer() in the sheetworker instead.
      -->
      <ButtonAction action="launch_charmancer" label="Launch Charactermancer" />
    </div>

    <div class="settings-sheet__rows">
      <SettingsRow field={sheet_toggle_select}>
        <Attribute field={sheet_toggle_select} isLabelHidden />
      </SettingsRow>
    </div>
  </Panel>

  <div class="settings-sheet__groups">
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

            {#if group.slug === "pc"}
              <!--
                #163: Military Training is a one-time, Warden-run event with
                its own Combat Check, not an on/off preference -- moved here
                from PCSkillsPanel and boxed apart from the rows above so it
                reads as an action rather than a setting.
              -->
              <div class="settings-sheet__military-panel">
                <Panel mode="light-grey" title="Military Training" corner="small">
                  <div class="settings-sheet__military">
                    <Button action="military_training" label="Military Training" />
                    <p
                      class="settings-sheet__military-desc"
                      data-i18n="Military Training Description"
                    >
                      6 years, free. Rolls a Combat Check: on a success, gain Military Training,
                      Athletics, 2 Trained Skills (1 Expert on a Critical Success), +10 Combat,
                      -10 to a chosen Stat and Marine Trauma Response. On a failure, gain Military
                      Training, Athletics, 1 Trained Skill and Marine Trauma Response. A Critical
                      Failure kills the character in action.
                    </p>
                  </div>
                </Panel>
              </div>
            {/if}
          </Panel>
        </div>
      {/if}
    {/each}
  </div>
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

  &__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: var(--ms-space-lg);
  }

  &__rows {
    display: flex;
    flex-direction: column;
    gap: var(--ms-space-lg);
  }

  &__groups {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--ms-space-lg);
  }

  &__group--pc,
  &__group--npc,
  &__group--ship {
    display: none;
  }

  &__military-panel {
    margin-top: var(--ms-space-lg);
  }

  &__military {
    display: flex;
    flex-direction: column;
    gap: var(--ms-space-sm);
    align-items: flex-start;
  }

  &__military-desc {
    margin: 0;

    font-size: var(--ms-text-xs);
    line-height: 1.4;
    color: var(--ms-fg-muted);
  }
}

// The standard button treatment, sized up from the shared .button --
// combined with it for the specificity to win regardless of declaration
// order (see scripts/collect-styles.js, which compiles every component's
// styles into one document).
.settings-sheet__back.button {
  gap: var(--ms-space-sm);

  padding: var(--ms-space-md) var(--ms-space-lg);

  font-size: var(--ms-text-md);
}

// Each group only makes sense for the sheet type it configures -- gated off
// sheet_toggle the same way Sheet.svelte gates the sheet views themselves,
// since a sheet cannot run JS to hide it instead. Gated on the whole group,
// not just its rows, so switching sheet type doesn't leave an empty panel
// box behind. Roll is sheet-agnostic, so it carries no gate and stays
// visible throughout.
input[name="attr_sheet_toggle"][value="pc"] ~ .sheet-view--settings .settings-sheet__group--pc,
input[name="attr_sheet_toggle"][value="npc"] ~ .sheet-view--settings .settings-sheet__group--npc,
input[name="attr_sheet_toggle"][value="ship"] ~ .sheet-view--settings .settings-sheet__group--ship {
  display: block;
}
</style>
