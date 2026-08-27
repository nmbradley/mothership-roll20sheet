<script lang="ts">
  import {
    shipWeapons,
    ship_hardpoints,
    ship_mdmg_base,
    ship_mdmg_total,
    ship_weapon_damage,
    ship_weapon_name,
    ship_weapon_notes,
    ship_weapon_range,
    ship_weapons_base,
    ship_weapons_total,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";

  // Weapons and Megadamage are two independent stats, not a current/max pair
  // like Hardpoints, so each renders as its own linked group rather than
  // going through AttributeNumberMax.
  const linkedPairs = [
    [ship_weapons_base, ship_weapons_total],
    [ship_mdmg_base, ship_mdmg_total],
  ];
</script>

<Panel title="Ship Weapons">
  <div class="ship-weapons-totals">
    {#each linkedPairs as pair (pair[0].name)}
      <div class="ship-weapons-pair">
        {#each pair as field (field.name)}
          <Attribute {field} />
        {/each}
      </div>
    {/each}
    <Attribute field={ship_hardpoints} />
  </div>

  <RepeatingSection
    section={shipWeapons}
    fields={[ship_weapon_name, ship_weapon_damage, ship_weapon_range, ship_weapon_notes]}
    columns="2fr 1fr 1fr 2fr"
  />
</Panel>

<style lang="scss">
.ship-weapons-totals {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ms-space-lg);

  margin-bottom: var(--ms-space-lg);
}

.ship-weapons-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--ms-space-md);
}
</style>
