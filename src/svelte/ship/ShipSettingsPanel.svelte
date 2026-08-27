<script lang="ts">
  // settings_toggle lives in pcFields.js and is shared across all three sheet
  // views (see PCSettingsPanel), so the ship view reuses it rather than
  // declaring its own cog attribute.
  import { settings_toggle } from "#game/fields/pcFields.js";
  import SettingsPanel from "#svelte/components/SettingsPanel.svelte";

  // #62 adds a `npc_ship` row here, in shipFields.ts, to reveal the Morale
  // Check button. Left empty until that field exists.
</script>

<SettingsPanel field={settings_toggle} />
