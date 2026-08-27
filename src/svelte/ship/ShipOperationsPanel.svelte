<script lang="ts">
  import { ship_bankruptcy_save } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import ShipOperationCard from "#svelte/ship/components/ShipOperationCard.svelte";
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

      <ShipOperationCard action="after_battle_report" label="After Battle Report">
        Rolls a <strong>Systems Check</strong> after the ship takes MDMG in a
        confrontation. Failure rolls once on the <em>Maintenance Issues Table</em>.
        Critical Failure rolls twice on the table.
      </ShipOperationCard>

      <ShipOperationCard action="bankruptcy_save" label="Bankruptcy Save">
        Rolls 1d100 under your <strong>Bankruptcy Save</strong> (defaults to 2d10+10)
        and resolves consequences from the <em>Bankruptcy Table</em>.
      </ShipOperationCard>

      <!--
        #62: only meaningful for an NPC ship. ship_npc lives on the settings
        page, not here -- ShipSheet mirrors it into a hidden block so :has()
        still finds a copy inside .ship-sheet. Lives here rather than in
        ShipMegadamagePanel: morale is not a hull property.
      -->
      <div class="morale-check-gate">
        <ShipOperationCard action="morale_check" label="Morale Check">
          Rolls <strong>1d10</strong>. A result under the ship's current MDMG
          breaks the enemy's morale -- they signal for a ceasefire.
        </ShipOperationCard>
      </div>
    </div>
  </Panel>

  <Panel title="Bankruptcy Save">
    <!-- Target number only; the roll button lives in the Bankruptcy Save card above. -->
    <Attribute field={ship_bankruptcy_save} />
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
  gap: var(--ms-space-lg);
}

.morale-check-gate {
  display: none;
}

// A sheet cannot run JS outside its sheetworkers, so visibility is driven off
// the mirrored ship_npc checkbox in CSS -- see ShipSheet.svelte.
.ship-sheet:has(input[name="attr_ship_npc"]:checked) .morale-check-gate {
  display: block;
}
</style>
