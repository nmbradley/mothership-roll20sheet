<script lang="ts">
  import {
    bankruptcy_save,
    battle,
    hull,
    systems,
    thrusters,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import ShipStatRow from "#svelte/ship/components/ShipStatRow.svelte";

  const checks = [
    {
      field: systems,
      action: "systems_check",
    },
    {
      field: thrusters,
      action: "thrusters_check",
    },
    {
      field: battle,
      action: "battle_check",
    },
  ];
</script>

<section class="ship-stats-panel">
  <Panel title="Ship Stats (1e)">
    {#each checks as check (check.field.name)}
      <ShipStatRow field={check.field} action={check.action} />
    {/each}
  </Panel>

  <Panel title="Saves & Defenses">
    <ShipStatRow field={bankruptcy_save} action="bankruptcy_save" />
  </Panel>

  <Panel title="Hull">
    <div class="ship-hull">
      <Attribute field={hull} />
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
