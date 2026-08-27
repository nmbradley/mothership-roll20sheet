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
    trailing={1}
  >
    <Attribute field={equipment_name} isLabelHidden />
    <Attribute field={equipment_type} isLabelHidden />

    <SettingsDrawer field={equipment_settings}>
      <SettingsRow field={equipment_notes} isFullWidth>
        <Attribute field={equipment_notes} isLabelHidden />
      </SettingsRow>

      <!--
        Hidden mirror of equipment_type -- see its declaration in pcFields.ts.
        Placed inside the drawer so :has() below can gate the Armor-only
        fields on this row's own copy rather than any other row's.
      -->
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
    // #127: DisplayValue's span stays empty until Roll20 has an attribute
    // value to fill it with, which can be true on first render -- this floor
    // keeps the well from collapsing to a line while that's the case.
    min-height: calc(var(--ms-text-xl) + var(--ms-space-md) * 2);
    padding: var(--ms-space-md) var(--ms-space-lg);

    .attribute {
      grid-template-columns: 1fr;
      align-items: stretch;
    }

    // Two classes deep so Roll20's own `.charsheet input[type=...]` sizing does
    // not put a second border inside the pill. AP and DR are read-only
    // derived totals (a plain <span>, see DisplayValue); Credits stays an
    // editable input. Both are headline numbers, so both share the scale.
    .attribute .attribute__input,
    .attribute__value--display {
      display: block;

      border: none;
      width: 100%;

      background: none;

      font-size: var(--ms-text-xl);
      font-weight: 700;
      text-align: center;
    }
  }
}

// AP and DR only make sense on armour, so they -- and the button that
// destroys this item -- stay hidden until the row's own equipment_type_mirror
// says so. `:has()` reaches into the drawer's slotted content rather than
// relying on sibling order, the same trick PCStatsPanel uses for the
// sheet-wide speed_initiative gate.
.pc-equipment-armor {
  display: none;
  gap: var(--ms-space-lg);
  align-items: center;
}

.settings__drawer:has(input[name="attr_equipment_type"][value="Armor"]) .pc-equipment-armor {
  display: flex;
}
</style>
