<script lang="ts">
  import {
    attack_ammunition,
    attack_crit_damage,
    attack_crit_effect,
    attack_damage,
    attack_name,
    attack_notes,
    attack_range,
    attack_settings,
    attack_shots,
    attack_type,
    pcAttacks,
  } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import DisplayValue from "#svelte/components/DisplayValue.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
  import SettingsDrawer from "#svelte/components/SettingsDrawer.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";

  // Written as a plain string so the Roll20 braces need no entity escaping.

  const pairs = [
    [attack_crit_damage, attack_crit_effect],
    [attack_shots, attack_ammunition],
  ];
</script>

<Panel title="Attacks">
  <RepeatingSection
    section={pcAttacks}
    fields={[attack_name, attack_type, attack_damage]}
    columns="2fr 1fr 1fr auto"
    trailing={1}
  >
    <ButtonAction action="attack" label="">
      <DisplayValue field={attack_name} isLabelHidden />
    </ButtonAction>

    <Attribute field={attack_type} isLabelHidden />
    <Attribute field={attack_damage} isLabelHidden />

    <SettingsDrawer field={attack_settings}>
      <SettingsRow field={attack_name}>
        <Attribute field={attack_name} isLabelHidden />
      </SettingsRow>

      <SettingsRow field={attack_range}>
        <Attribute field={attack_range} isLabelHidden />
      </SettingsRow>

      {#each pairs as pair (pair[0].name)}
        <div class="npc-attack-pair">
          {#each pair as field (field.name)}
            <SettingsRow {field}>
              <Attribute {field} isLabelHidden />
            </SettingsRow>
          {/each}
        </div>
      {/each}

      <SettingsRow field={attack_notes} isFullWidth>
        <Attribute field={attack_notes} isLabelHidden />
      </SettingsRow>
    </SettingsDrawer>
  </RepeatingSection>
</Panel>

<style lang="scss">
.npc-attack-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column: 1 / -1;
  gap: var(--ms-space-md);
}
</style>
