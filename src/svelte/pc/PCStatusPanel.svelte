<script lang="ts">
  import {
    conditions, health, stress, stress_panic, wounds,
  } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import Panel from "#svelte/components/Panel.svelte";

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

    <!-- Stress has no maximum, so the Panic roll takes the cell beside it. -->
    <div class="pc-status-card">
      <div class="pc-status-card__label" data-i18n={stress.i18nLabel}>{stress.label}</div>
      <Attribute field={stress} isLabelHidden />
    </div>

    <div class="pc-status-card pc-status-card--action">
      <ButtonAction action="panic" label="Panic Check" />
    </div>

    <div class="pc-status-card pc-status-card--action">
      <ButtonAction action="rest_save" label="Rest Save" />
    </div>
  </div>

  <div class="pc-status-notes">
    <Attribute field={stress_panic} />
  </div>

  <div class="pc-conditions">
    <div class="pc-conditions__label" data-i18n={conditions.i18nLabel}>{conditions.label}</div>
    <Attribute field={conditions} isLabelHidden />
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
