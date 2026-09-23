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

  const groups = [
    {
      title: "PC",
      slug: "pc",
      rows: [speed_initiative, save_skill_select, attack_modifier],
    },
    {
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

<div class="settings-sheet">
  <Panel title="Settings" corner="small">
    <div class="settings-sheet__nav">
      <label for="attr_settings_open" class="settings-sheet__back button">
        <span aria-hidden="true">&larr;</span>
        <span data-i18n="Back">Back</span>
      </label>

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
              <div class="settings-sheet__military-panel">
                <Panel mode="light-grey" title="Military Training" corner="small">
                  <div class="settings-sheet__military">
                    <Button action="military_training" label="Military Training" />
                    <p
                      class="settings-sheet__military-desc"
                      data-i18n="Military Training Description">
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

.settings-sheet__back.button {
  gap: var(--ms-space-sm);

  padding: var(--ms-space-md) var(--ms-space-lg);

  font-size: var(--ms-text-md);
}

input[name="attr_sheet_toggle"][value="pc"] ~ .sheet-view--settings .settings-sheet__group--pc,
input[name="attr_sheet_toggle"][value="npc"] ~ .sheet-view--settings .settings-sheet__group--npc,
input[name="attr_sheet_toggle"][value="ship"] ~ .sheet-view--settings .settings-sheet__group--ship {
  display: block;
}
</style>
