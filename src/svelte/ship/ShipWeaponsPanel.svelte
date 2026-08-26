<script lang="ts">
  import {
    shipWeapons,
    ship_weapon_damage,
    ship_weapon_name,
    ship_weapon_notes,
    ship_weapon_range,
  } from "#game/fields/shipFields.js";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
</script>

<Panel title="Ship Weapons">
  <RepeatingSection
    section={shipWeapons}
    fields={[ship_weapon_name, ship_weapon_damage, ship_weapon_range, ship_weapon_notes]}
    columns="2fr 1fr 1fr 2fr"
  />
</Panel>
