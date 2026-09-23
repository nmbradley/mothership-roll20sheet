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

  <div class="pc-status-notes">
    <Attribute field={stress_effect} />
  </div>

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

    <div class="pc-status-actions__item">
      <ButtonAction action="take_damage" label="Take Damage" />
    </div>

    <div class="pc-status-actions__item">
      <ButtonAction action="take_wound" label="Take a Wound" />
    </div>

    <div class="pc-status-actions__item pc-status-actions__item--initiative">
      <ButtonAction action="pc-initiative" label="Initiative" />
    </div>
  </div>

  <div class="pc-conditions">
    <div class="pc-conditions__label" data-i18n="Conditions &amp; Afflictions">
      Conditions &amp; Afflictions
    </div>
    <RepeatingSection
      section={pcAfflictions}
      fields={[affliction_name, affliction_treated]}
      columns="1fr auto auto"
      trailing={1}>
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

.pc-status-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--ms-space-md);

  margin-top: var(--ms-space-lg);
}

.pc-status-actions__item {
  display: flex;
  justify-content: center;

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

.pc-sheet:not(:has(input[name="attr_speed_initiative"]:checked))
  .pc-status-actions__item:nth-child(5) {
  grid-column: 1 / -1;

  .button {
    width: calc(50% - var(--ms-space-md) / 2);
  }
}

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
