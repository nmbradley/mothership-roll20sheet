<script lang="ts">
  import {
    ship_battle,
    ship_hull,
    ship_systems,
    ship_thrusters,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import ShipStatRow from "#svelte/ship/components/ShipStatRow.svelte";

  const checks = [
    {
      field: ship_systems,
      action: "systems_check",
    },
    {
      field: ship_thrusters,
      action: "thrusters_check",
    },
    {
      field: ship_battle,
      action: "battle_check",
    },
  ];
</script>

<!-- #58 section 2, Stats & Saves. Saves & Defenses dropped: 1e ships have no
     armor save, and Bankruptcy Save now lives with the operations grouping in
     ShipOperationsPanel. Hull stays here until #86 moves it out. -->
<section class="ship-stats-panel">
  <Panel title="Ship Stats (1e)">
    {#each checks as check (check.field.name)}
      <ShipStatRow field={check.field} action={check.action} />
    {/each}
  </Panel>

  <Panel title="Hull">
    <div class="ship-hull">
      <Attribute field={ship_hull} />
    </div>
  </Panel>
</section>

<style lang="scss">
.ship-stats-panel {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-lg);
}

.ship-hull {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-lg);
}
</style>
