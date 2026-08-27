<script lang="ts">
  import {
    npcTraits,
    trait_description,
    trait_name,
    trait_settings,
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
    fields={[trait_name]}
    columns="1fr auto"
    trailing={1}
  >
    <ButtonAction action="npc-trait" label="">
      <DisplayValue field={trait_name} isLabelHidden />
    </ButtonAction>

    <SettingsDrawer field={trait_settings}>
      <SettingsRow field={trait_name}>
        <Attribute field={trait_name} isLabelHidden />
      </SettingsRow>
      <SettingsRow field={trait_description} isFullWidth>
        <Attribute field={trait_description} isLabelHidden />
      </SettingsRow>
    </SettingsDrawer>
  </RepeatingSection>
</Panel>
