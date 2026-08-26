<script lang="ts">
  import {
    ship_cargo,
    ship_crew,
    ship_fuel,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import ShipOperationCard from "#svelte/ship/components/ShipOperationCard.svelte";
  import ShipStatRow from "#svelte/ship/components/ShipStatRow.svelte";
</script>

<section class="ship-operations-panel">
  <Panel title="Ship Operations & Maintenance" mode="light-grey">
    <div class="ship-operations">
      <ShipOperationCard action="starting_condition" label="Starting Condition">
        Rolls <strong>1d5+1</strong> to determine the number of starting issues.
      </ShipOperationCard>

      <ShipOperationCard action="annual_maintenance" label="Annual Maintenance Check">
        Rolls a <strong>Systems Check</strong>. Failure rolls once on the
        <em>Maintenance Issues Table</em> (everyone gains 1 Stress).
        Critical Failure rolls twice on the table (everyone makes a Panic Check).
      </ShipOperationCard>

      <ShipOperationCard action="bankruptcy_save" label="Bankruptcy Save">
        Rolls 1d100 under your <strong>Bankruptcy Save</strong> (defaults to 2d10+10)
        and resolves consequences from the <em>Bankruptcy Table</em>.
      </ShipOperationCard>
    </div>
  </Panel>

  <Panel title="Secondary Stats">
    <Attribute field={ship_crew} />
    <Attribute field={ship_fuel} />
    <ShipStatRow field={ship_cargo} />
  </Panel>
</section>

<style lang="scss">
.ship-operations-panel {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-lg);
}

.ship-operations {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-xl);
}
</style>
