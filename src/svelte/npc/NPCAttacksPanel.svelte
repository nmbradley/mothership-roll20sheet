<script lang="ts">
  import {
    npcAttacks,
    npc_attack_ammunition,
    npc_attack_crit_damage,
    npc_attack_crit_effect,
    npc_attack_damage,
    npc_attack_name,
    npc_attack_notes,
    npc_attack_range,
    npc_attack_settings,
    npc_attack_shots,
    npc_attack_type,
  } from "#game/fields/npcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import DisplayValue from "#svelte/components/DisplayValue.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
  import SettingsDrawer from "#svelte/components/SettingsDrawer.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";

  // Written as a plain string so the Roll20 braces need no entity escaping.

  const pairs = [
    [npc_attack_crit_damage, npc_attack_crit_effect],
    [npc_attack_shots, npc_attack_ammunition],
  ];
</script>

<Panel title="Attacks">
  <RepeatingSection
    section={npcAttacks}
    fields={[npc_attack_name, npc_attack_type, npc_attack_damage]}
    columns="2fr 1fr 1fr auto"
    trailing={1}
  >
    <ButtonAction action="npc-attack" label="">
      <DisplayValue field={npc_attack_name} isLabelHidden />
    </ButtonAction>

    <Attribute field={npc_attack_type} isLabelHidden />
    <Attribute field={npc_attack_damage} isLabelHidden />

    <SettingsDrawer field={npc_attack_settings}>
      <SettingsRow field={npc_attack_name}>
        <Attribute field={npc_attack_name} isLabelHidden />
      </SettingsRow>

      <SettingsRow field={npc_attack_range}>
        <Attribute field={npc_attack_range} isLabelHidden />
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

      <SettingsRow field={npc_attack_notes} isFullWidth>
        <Attribute field={npc_attack_notes} isLabelHidden />
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
