<script lang="ts">
  import {
    ship_armor,
    ship_bankruptcy_save,
    ship_battle,
    ship_hull,
    ship_hull_25,
    ship_hull_50,
    ship_hull_75,
    ship_systems,
    ship_thrusters,
    ship_wounds,
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

  const thresholds = [ship_hull_25, ship_hull_50, ship_hull_75];
</script>

<section class="ship-stats-panel">
  <Panel title="Ship Stats (1e)">
    {#each checks as check (check.field.name)}
      <ShipStatRow field={check.field} action={check.action} />
    {/each}
  </Panel>

  <Panel title="Saves & Defenses">
    <ShipStatRow field={ship_armor} />
    <ShipStatRow field={ship_bankruptcy_save} action="bankruptcy_save" />
  </Panel>

  <Panel title="Hull & Wounds">
    <div class="ship-hull-wounds">
      <Attribute field={ship_wounds} />
      <Attribute field={ship_hull} />

      <div class="ship-hull-thresholds">
        {#each thresholds as threshold (threshold.name)}
          <Attribute field={threshold} />
        {/each}
      </div>
    </div>
  </Panel>
</section>

<style lang="scss">
.ship-stats-panel {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-lg);
}

.ship-hull-wounds {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-lg);
}

.ship-hull-thresholds {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ms-space-md);

  margin-top: var(--ms-space-md);
}
</style>
