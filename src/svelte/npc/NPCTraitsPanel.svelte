<script lang="ts">
  import {
    npcTraits,
    npc_trait_description,
    npc_trait_name,
    npc_trait_settings,
  } from "#game/fields/npcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import DisplayValue from "#svelte/components/DisplayValue.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
  import SettingsDrawer from "#svelte/components/SettingsDrawer.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";

</script>

<Panel title="Traits">
  <RepeatingSection
    section={npcTraits}
    fields={[npc_trait_name]}
    columns="1fr auto"
    trailing={1}
  >
    <ButtonAction action="npc-trait" label="">
      <DisplayValue field={npc_trait_name} isLabelHidden />
    </ButtonAction>

    <SettingsDrawer field={npc_trait_settings}>
      <SettingsRow field={npc_trait_name}>
        <Attribute field={npc_trait_name} isLabelHidden />
      </SettingsRow>
      <SettingsRow field={npc_trait_description} isFullWidth>
        <Attribute field={npc_trait_description} isLabelHidden />
      </SettingsRow>
    </SettingsDrawer>
  </RepeatingSection>
</Panel>
