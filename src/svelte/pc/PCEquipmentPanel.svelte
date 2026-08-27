<script lang="ts">
  import {
    armor_points,
    credits,
    damage_reduction,
    equipment_name,
    equipment_notes,
    equipment_settings,
    equipment_type,
    pcEquipment,
  } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import DisplayValue from "#svelte/components/DisplayValue.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
  import SettingsDrawer from "#svelte/components/SettingsDrawer.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";

  /** Carried at the foot of the equipment list, as the printed sheet has them. */
  const totals = [damage_reduction, credits];
</script>

<Panel title="Equipment" corner="large">
  <RepeatingSection
    section={pcEquipment}
    fields={[equipment_name, equipment_type]}
    columns="1fr 100px auto"
    trailing={1}
  >
    <DisplayValue field={equipment_name} isLabelHidden />
    <Attribute field={equipment_type} isLabelHidden />

    <SettingsDrawer field={equipment_settings}>
      <SettingsRow field={equipment_name}>
        <Attribute field={equipment_name} isLabelHidden />
      </SettingsRow>
      <SettingsRow field={equipment_notes} isFullWidth>
        <Attribute field={equipment_notes} isLabelHidden />
      </SettingsRow>
    </SettingsDrawer>
  </RepeatingSection>

  <div class="pc-equipment-totals">
    <div class="pc-equipment-totals__cell">
      <div class="pc-equipment-totals__label" data-i18n={armor_points.i18nLabel}>
        {armor_points.label}
      </div>
      <div class="pc-equipment-totals__well pc-equipment-totals__well--armor">
        <Attribute field={armor_points} isLabelHidden />
        <ButtonAction action="destroy_armor" label="Destroy" />
      </div>
    </div>
    {#each totals as total (total.name)}
      <div class="pc-equipment-totals__cell">
        <div class="pc-equipment-totals__label" data-i18n={total.i18nLabel}>{total.label}</div>
        <div class="pc-equipment-totals__well">
          <Attribute field={total} isLabelHidden />
        </div>
      </div>
    {/each}
  </div>
</Panel>

<style lang="scss">
.pc-equipment-totals {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ms-space-lg);

  margin-top: var(--ms-space-lg);

  &__label {
    @extend %ms-caption;

    margin-bottom: var(--ms-space-sm);
  }

  &__well {
    border: var(--ms-border-width-thick) solid var(--ms-border);
    border-radius: var(--ms-radius-lg);
    padding: var(--ms-space-md) var(--ms-space-lg);

    .attribute {
      grid-template-columns: 1fr;
    }

    // Two classes deep so Roll20's own `.charsheet input[type=...]` sizing does
    // not put a second border inside the pill.
    .attribute .attribute__input {
      border: none;
      width: 100%;

      background: none;

      text-align: center;
    }

    // The Destroy button sits beside the AP input rather than under it.
    &--armor {
      display: flex;
      gap: var(--ms-space-sm);
      align-items: center;

      .attribute {
        flex: 1;
      }

      .button {
        flex-shrink: 0;

        white-space: nowrap;
      }
    }
  }
}
</style>
