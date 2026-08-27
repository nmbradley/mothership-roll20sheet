<script lang="ts">
  import {
    ship_hull,
    ship_mdmg,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
</script>

<!-- #58 section 6, MegaDamage Track & Hull. The 0-9 track renders as a plain
     number: `Controls` has no `radio` yet (see shipFields.ts), and adding one
     is only worth it if a number proves not to read well enough. Broadcasting
     the megadamageTable effect for the current level is #61, not layout.
     Morale Check moved out to ShipOperationsPanel: it isn't a hull property. -->
<Panel title="MegaDamage & Hull">
  <Attribute field={ship_mdmg} />
  <Attribute field={ship_hull} />
</Panel>
