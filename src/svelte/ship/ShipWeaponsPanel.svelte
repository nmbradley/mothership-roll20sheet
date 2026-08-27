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
// Base/Total/MDMG/Hardpoints used to be forced into equal thirds of the
// panel's width, squeezing every label down to fit -- letting each stat hug
// its own content instead gives the labels room and reads as one compact
// strip rather than a cramped row.
.ship-weapons-totals {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ms-space-xl);
  align-items: end;

  margin-bottom: var(--ms-space-lg);

  .attribute__input--number {
    width: 3.5rem;

    text-align: center;
  }
}

.ship-weapons-pair {
  display: flex;
  gap: var(--ms-space-md);
}
</style>
