<script lang="ts">
  import {
    ship_hull,
    ship_mdmg,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import ShipOperationCard from "#svelte/ship/components/ShipOperationCard.svelte";
</script>

<!-- #58 section 6, MegaDamage Track & Hull. The 0-9 track renders as a plain
     number: `Controls` has no `radio` yet (see shipFields.ts), and adding one
     is only worth it if a number proves not to read well enough. Broadcasting
     the megadamageTable effect for the current level is #61, not layout. -->
<Panel title="MegaDamage & Hull">
  <Attribute field={ship_mdmg} />
  <Attribute field={ship_hull} />

  <!--
    #62: only meaningful for an NPC ship. ship_npc lives on the settings page,
    not here -- ShipSheet mirrors it into a hidden block so :has() still finds
    a copy inside .ship-sheet.
  -->
  <div class="morale-check-gate">
    <ShipOperationCard action="morale_check" label="Morale Check">
      Rolls <strong>1d10</strong>. A result under the ship's current MDMG
      breaks the enemy's morale -- they signal for a ceasefire.
    </ShipOperationCard>
  </div>
</Panel>

<style lang="scss">
.morale-check-gate {
  display: none;
}

// A sheet cannot run JS outside its sheetworkers, so visibility is driven off
// the mirrored ship_npc checkbox in CSS -- see ShipSheet.svelte.
.ship-sheet:has(input[name="attr_ship_npc"]:checked) .morale-check-gate {
  display: block;
}
</style>
