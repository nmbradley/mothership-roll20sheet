<script lang="ts">
  import {
    affliction_effect,
    affliction_name,
    affliction_settings,
    affliction_treated,
    health,
    pcAfflictions,
    stress,
    stress_max,
    stress_min,
    stress_panic,
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
         per-character range shown as current/max like Health and Wounds, so
         they are rendered hidden and the Panic roll takes the cell beside it.
         #18: +/- tick Stress by 1 without opening the field, through the same
         applyStressDelta the rolls that change Stress already write through. -->
    <div class="pc-status-card">
      <div class="pc-status-card__label" data-i18n={stress.i18nLabel}>{stress.label}</div>
      <div class="pc-status-card__stress">
        <ButtonAction action="stress_down" label="−" />
        <Attribute field={stress} isLabelHidden />
        <ButtonAction action="stress_up" label="+" />
      </div>
      <Attribute field={stress_min} />
      <Attribute field={stress_max} />
    </div>

    <div class="pc-status-card pc-status-card--action">
      <ButtonAction action="panic" label="Panic Check" />
    </div>

    <div class="pc-status-card pc-status-card--action">
      <ButtonAction action="rest_save" label="Rest Save" />
    </div>

    <!-- #52: an ordinary hit, resolved against Health, Armor and DR. -->
    <div class="pc-status-card pc-status-card--action">
      <ButtonAction action="take_damage" label="Take Damage" />
    </div>

    <!-- #52: for attacks that deal a Wound directly, bypassing Health. -->
    <div class="pc-status-card pc-status-card--action">
      <ButtonAction action="take_wound" label="Take a Wound" />
    </div>

    <div class="pc-status-card pc-status-card--action">
      <ButtonAction action="death_save" label="Death Save" />
    </div>
  </div>

  <div class="pc-status-notes">
    <Attribute field={stress_panic} />
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
      <DisplayValue field={affliction_name} isLabelHidden />
      <Attribute field={affliction_treated} isLabelHidden />

      <SettingsDrawer field={affliction_settings}>
        <SettingsRow field={affliction_name}>
          <Attribute field={affliction_name} isLabelHidden />
        </SettingsRow>
        <SettingsRow field={affliction_effect} isFullWidth>
          <Attribute field={affliction_effect} isLabelHidden />
        </SettingsRow>
      </SettingsDrawer>
    </RepeatingSection>
  </div>
</Panel>

<style lang="scss">
// Two rows: Health and Wounds, then Stress with its Panic roll beside it.
.pc-status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--ms-space-lg);
  align-items: start;
}

.pc-status-card {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-sm);

  // Two to a row rather than three, so the capsules can run large.
  .attribute--number .attribute__input,
  .attribute__minmax-wrapper .attribute__input {
    border-radius: var(--ms-radius-pill);
    padding: var(--ms-space-md) 0;

    font-size: var(--ms-text-lg);
    font-weight: 700;
    text-align: center;
  }

  // The Panic roll reads as a capsule too, not a square control.
  &--action {
    justify-content: flex-end;

    .button {
      border-radius: var(--ms-radius-pill);
      padding: var(--ms-space-md) var(--ms-space-lg);
    }
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
    align-items: center;
    justify-content: space-around;

    min-height: 2rem;

    font-size: var(--ms-text-sm);
    color: var(--ms-fg-muted);
  }

  // The +/- buttons flank the Stress capsule rather than sitting in their own
  // card, so a tick stays one tap from the number it changes.
  &__stress {
    display: flex;
    gap: var(--ms-space-sm);
    align-items: center;

    .attribute {
      flex: 1;
    }

    .button--action {
      flex: none;

      border-radius: var(--ms-radius-pill);
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;

      font-weight: 700;
    }
  }
}

// Its label sits above the field rather than beside it.
.pc-status-notes {
  margin-top: var(--ms-space-lg);

  .attribute {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ms-space-sm);
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
