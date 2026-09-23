<script lang="ts">
  import {
    armor_points,
    credits,
    damage_reduction,
    equipment_armor_points,
    equipment_damage_reduction,
    equipment_name,
    equipment_notes,
    equipment_settings,
    equipment_type,
    equipment_type_mirror,
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
  const totals = [armor_points, damage_reduction];
</script>

<Panel title="Equipment" corner="large">
  <RepeatingSection
    section={pcEquipment}
    fields={[equipment_name, equipment_type]}
    columns="1fr 100px auto"
    trailing={1}>
    <Attribute field={equipment_name} isLabelHidden />
    <Attribute field={equipment_type} isLabelHidden />

    <SettingsDrawer field={equipment_settings}>
      <SettingsRow field={equipment_notes} isFullWidth>
        <Attribute field={equipment_notes} isLabelHidden />
      </SettingsRow>

      <Attribute field={equipment_type_mirror} />

      <div class="pc-equipment-armor">
        <Attribute field={equipment_armor_points} variant="round" />
        <Attribute field={equipment_damage_reduction} variant="round" />
        <ButtonAction action="destroy_armor" label="Destroy" />
      </div>
    </SettingsDrawer>
  </RepeatingSection>

  <div class="pc-equipment-totals">
    {#each totals as total (total.name)}
      <div class="pc-equipment-totals__cell">
        <div class="pc-equipment-totals__label" data-i18n={total.i18nLabel}>{total.label}</div>
        <div class="pc-equipment-totals__well">
          <DisplayValue field={total} isLabelHidden />
        </div>
      </div>
    {/each}
    <div class="pc-equipment-totals__cell">
      <div class="pc-equipment-totals__label" data-i18n={credits.i18nLabel}>{credits.label}</div>
      <div class="pc-equipment-totals__well">
        <Attribute field={credits} isLabelHidden />
      </div>
    </div>
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
    min-height: calc(var(--ms-text-xl) + var(--ms-space-md) * 2);
    padding: var(--ms-space-md) var(--ms-space-lg);

    .attribute {
      grid-template-columns: 1fr;
      align-items: stretch;
    }

    .attribute .attribute__input,
    .attribute__value--display {
      display: block;

      border: none;
      width: 100%;
      padding: 0;

      background: none;

      font-size: var(--ms-text-xl);
      font-weight: 700;
      text-align: center;
    }
  }
}

.pc-equipment-armor {
  display: none;
  gap: var(--ms-space-lg);
  align-items: center;
  justify-content: space-between;

  .attribute--round {
    align-items: stretch;
    justify-items: center;

    label {
      order: 0;

      font-size: var(--ms-text-sm);
      text-align: center;
    }

    .attribute__input[type="number"] {
      order: 1;

      width: 60px;
      height: 60px;

      font-size: var(--ms-text-lg);
      text-align: center;
    }
  }

  .button--action {
    align-self: center;

    border-color: var(--ms-accent);
    border-radius: var(--ms-radius-pill);
    padding: var(--ms-space-md) var(--ms-space-xl);

    background: var(--ms-accent);

    font-size: var(--ms-text-md);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ms-fg-inverse);
  }
}

.settings__drawer:has(input[name="attr_equipment_type"][value="Armor"]) .pc-equipment-armor {
  display: flex;
}
</style>
