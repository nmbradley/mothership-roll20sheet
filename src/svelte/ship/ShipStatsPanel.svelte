<script lang="ts">
  import {
    ship_battle,
    ship_systems,
    ship_thrusters,
  } from "#game/fields/shipFields.js";
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

<!-- #58 section 2, Stats & Saves. Saves & Defenses and Hull moved out: 1e
     ships have no armor save, Bankruptcy Save now lives with the operations
     grouping in ShipOperationsPanel, and Hull moved to ShipMegadamagePanel. -->
<section class="ship-stats-panel">
  <Panel title="Ship Stats (1e)">
    <div class="ship-stats-panel__checks">
      {#each checks as check (check.field.name)}
        <ShipStatRow field={check.field} action={check.action} />
      {/each}
    </div>
  </Panel>
</section>

<style lang="scss">
.ship-stats-panel__checks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ms-space-lg);
}
</style>
