<script lang="ts">
  import {
    shipLoadout,
    ship_loadout_item,
    ship_loadout_number,
  } from "#game/fields/shipFields.js";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
</script>

<Panel title="Cargo & Loadout">
  <RepeatingSection
    section={shipLoadout}
    fields={[ship_loadout_item, ship_loadout_number]}
    columns="3fr 1fr"
  />
</Panel>
