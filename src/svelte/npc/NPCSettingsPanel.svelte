<script lang="ts">
  // Reused from pcFields.js rather than redeclared here: like character_name,
  // these are attributes on the one shared character, and the NPC view needs
  // its own copy of the Speed Check Initiative toggle to gate its own
  // Initiative button (#50) without switching the sheet view to edit it.
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
