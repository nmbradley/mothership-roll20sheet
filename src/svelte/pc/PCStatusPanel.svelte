<script lang="ts">
  import {
    affliction_effect,
    affliction_name,
    affliction_settings,
    affliction_treated,
    health,
    pcAfflictions,
    stress,
    stress_effect,
    stress_min,
    wounds,
  } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import DisplayValue from "#svelte/components/DisplayValue.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
  import SettingsDrawer from "#svelte/components/SettingsDrawer.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";

  /** Health and Wounds are tracked as a current/maximum pair. */
  const ranged = [health, wounds];
</script>

<!--
  The printed sheet calls this the Status Report: Health, Wounds and Stress on
  one row, then a free area for Conditions. Armor Points is not here -- it sits
  with Equipment, where the printed sheet keeps it.
-->
<Panel title="Status Report" corner="large">
  <div class="pc-status-grid">
    {#each ranged as vital (vital.name)}
      <div class="pc-status-card">
        <div class="pc-status-card__label" data-i18n={vital.i18nLabel}>{vital.label}</div>
        <Attribute field={vital} isLabelHidden />
        <div class="pc-status-card__sublabels">
          <span data-i18n="Current">Current</span>
          <span data-i18n="Maximum">Maximum</span>
        </div>
      </div>
    {/each}

    <!-- Stress's Minimum/Maximum are fixed rule constants (#42), not a
         per-character range shown as current/max like Health and Wounds --
         so unlike those two, the bounds stay read-only. They still render
         (#154), so a player can see 2 is the floor rather than 0; the hidden
         twins keep seeding the actual attribute value checks.ts reads via
         getAttrs. Only the Minimum is shown, and only it is an attribute:
         the Maximum is the same 20 for every character, so it lives as
         STRESS_MAX in checks.ts rather than costing an attribute. No
         steppers: the field opens like any other number field. -->
    <div class="pc-status-card">
      <div class="pc-status-card__label" data-i18n={stress.i18nLabel}>{stress.label}</div>
      <div class="pc-status-card__stress-row">
        <DisplayValue field={stress_min} isLabelHidden />
        <Attribute field={stress} isLabelHidden />
      </div>
      <div class="pc-status-card__sublabels">
        <span data-i18n="Minimum">Minimum</span>
        <span data-i18n="Current">Current</span>
      </div>
      <Attribute field={stress_min} />
    </div>
  </div>

  <!-- #132: the class's Trauma Response, what a failed Panic Check now points
       to instead of a rolled table entry. Sits above the actions (#155): it
       is reference text read when a Panic Check fails, so it belongs with
       the vitals it explains rather than after the controls. -->
  <div class="pc-status-notes">
    <Attribute field={stress_effect} />
  </div>

  <!-- The six actions live on the PC sheet's Status Report (#111): Panic
       Check, Rest Save and Death Save, Take Damage and Take a Wound (#113),
       and Initiative (#50), moved in from PCStatsPanel since it is an action
       like the rest of this row rather than a stat. Initiative is gated by
       speed_initiative and must stay the last item here -- see the CSS
       below, which depends on that DOM order. -->
  <div class="pc-status-actions">
    <div class="pc-status-actions__item">
      <ButtonAction action="panic" label="Panic Check" />
    </div>

    <div class="pc-status-actions__item">
      <ButtonAction action="rest_save" label="Rest Save" />
    </div>

    <div class="pc-status-actions__item">
      <ButtonAction action="death_save" label="Death Save" />
    </div>

    <!-- #52: an ordinary hit, resolved against Health, Armor and DR. -->
    <div class="pc-status-actions__item">
      <ButtonAction action="take_damage" label="Take Damage" />
    </div>

    <!-- #52: for attacks that deal a Wound directly, bypassing Health. -->
    <div class="pc-status-actions__item">
      <ButtonAction action="take_wound" label="Take a Wound" />
    </div>

    <!-- Optional 1e rule (#50): a Speed Check doubles as Initiative, rolled
         into the Turn Tracker. Hidden unless speed_initiative is on -- a
         sheet cannot run JS outside its sheetworkers, so this rereads the
         checkbox via :has() rather than script. CharacterSheet mirrors the
         checkbox (its own control lives on the settings page) into
         .pc-sheet so :has() can still find it, the same trick NPCSheet uses. -->
    <div class="pc-status-actions__item pc-status-actions__item--initiative">
      <ButtonAction action="pc-initiative" label="Initiative" />
    </div>
  </div>

  <!-- #55: lasting Conditions from a failed Panic Check and lingering
       Injuries from Wounds, replacing the old flat conditions textarea. -->
  <div class="pc-conditions">
    <div class="pc-conditions__label" data-i18n="Conditions &amp; Afflictions">
      Conditions &amp; Afflictions
    </div>
    <RepeatingSection
      section={pcAfflictions}
      fields={[affliction_name, affliction_treated]}
      columns="1fr auto auto"
      trailing={1}
    >
      <!-- #156: directly editable on the row, as PCEquipmentPanel does for
           equipment_name and PCAttacksPanel does for attack_name, so a
           collapsed row is still labelled. It has no roll/action trigger of
           its own to displace -- afflictions are just a name and an effect. -->
      <Attribute field={affliction_name} isLabelHidden />
      <Attribute field={affliction_treated} isLabelHidden />

      <SettingsDrawer field={affliction_settings}>
        <SettingsRow field={affliction_effect} isFullWidth>
          <Attribute field={affliction_effect} isLabelHidden />
        </SettingsRow>
      </SettingsDrawer>
    </RepeatingSection>
  </div>
</Panel>

<style lang="scss">
// One row: Health, Wounds and Stress side by side.
.pc-status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 0.75fr;
  gap: var(--ms-space-lg);
  align-items: start;
}

.pc-status-card {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-sm);

  .attribute--number .attribute__input,
  .attribute__minmax-wrapper .attribute__input {
    border-radius: var(--ms-radius-pill);
    padding: var(--ms-space-md) 0;

    font-size: var(--ms-text-lg);
    font-weight: 700;
    text-align: center;
  }

  // A fixed label row keeps the three cards on the same baseline whether the
  // label is text or a button.
  &__label {
    display: flex;
    align-items: center;
    justify-content: center;

    min-height: 1.75rem;

    font-size: var(--ms-text-sm);
    font-family: var(--ms-font-header);
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
  }

  &__sublabels {
    display: flex;
    gap: var(--ms-space-sm);
    align-items: center;
    justify-content: space-around;

    min-height: 2rem;

    font-size: var(--ms-text-sm);
    color: var(--ms-fg-muted);
  }

  // Stress's fixed Minimum and Maximum (#154) flank the editable Current
  // value rather than sharing its input the way Health/Wounds' editable max
  // does -- these two are read-only rule constants, not a per-character pair.
  &__stress-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--ms-space-sm);
    align-items: center;

    .attribute__value--display {
      min-width: 1.5em;

      font-size: var(--ms-text-lg);
      font-weight: 700;
      text-align: center;
      color: var(--ms-fg-muted);
    }
  }
}

// Panic Check, Rest Save, Death Save, Take Damage, Take a Wound and
// Initiative, two to a row.
.pc-status-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--ms-space-md);

  margin-top: var(--ms-space-lg);
}

.pc-status-actions__item {
  display: flex;
  justify-content: center;

  // The item is a grid item and already stretches to its cell; it is the
  // button inside that has to be told to fill, or it sizes to its label and
  // the rows read ragged.
  .button {
    border-radius: var(--ms-radius-pill);
    width: 100%;
    padding: var(--ms-space-md) var(--ms-space-lg);
  }
}

.pc-status-actions__item--initiative {
  display: none;
}

.pc-sheet:has(input[name="attr_speed_initiative"]:checked) .pc-status-actions__item--initiative {
  display: flex;
}

// Layout rule: where the grid can't fill evenly, the lone trailing button
// spans and centres rather than sitting flush in the first column with a gap
// beside it. This can't be driven off :nth-child/:last-child, because
// display:none takes Initiative out of layout flow but NOT out of that
// counting -- with the toggle off, Initiative (6th) is still :last-child, so
// the visible 5th button would never match. The :has() gate is the only
// thing that actually knows what's rendered, so drive it off that instead.
// NOTE: this hardcodes "5" as the index of the last visible item when
// Initiative is hidden, and depends on Initiative being the last DOM child
// above -- update both if the button order changes.
.pc-sheet:not(:has(input[name="attr_speed_initiative"]:checked))
  .pc-status-actions__item:nth-child(5) {
  grid-column: 1 / -1;

  // Spanning the row would otherwise make this button twice the width of
  // every other one. Holding it to a single column's width keeps it matching
  // its neighbours while still sitting centred across the pair.
  .button {
    width: calc(50% - var(--ms-space-md) / 2);
  }
}

// Its label sits above the field rather than beside it.
.pc-status-notes {
  margin-top: var(--ms-space-lg);

  .attribute {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ms-space-sm);
    align-items: stretch;
  }
}

.pc-conditions {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-sm);

  margin-top: var(--ms-space-lg);

  &__label {
    font-family: var(--ms-font-header);
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
  }
}
</style>
