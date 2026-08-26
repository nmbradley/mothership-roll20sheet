<script lang="ts">
  import { settings_toggle, speed_initiative } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import SettingsPanel from "#svelte/components/SettingsPanel.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";
</script>

<SettingsPanel field={settings_toggle}>
  <SettingsRow field={speed_initiative}>
    <Attribute field={speed_initiative} isLabelHidden />
  </SettingsRow>
</SettingsPanel>
