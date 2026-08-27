<script lang="ts">
  import {
    ship_fuel,
    ship_fuel_bid,
    ship_warp_cores,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
</script>

<!-- #58 section 3, Engines. -->
<Panel title="Engines">
  <Attribute field={ship_fuel} />
  <!-- The reveal button that reads and resets this during the movement phase
       is #60; this is only the input it reveals. -->
  <Attribute field={ship_fuel_bid} />
  <Attribute field={ship_warp_cores} />
</Panel>
