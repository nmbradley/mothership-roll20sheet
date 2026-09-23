<script lang="ts">
  import {
    ship_fuel,
    ship_fuel_bid,
    ship_warp_cores,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import Panel from "#svelte/components/Panel.svelte";
</script>

<Panel title="Engines">
  <Attribute field={ship_fuel} />
  <div class="ship-engines__bid">
    <Attribute field={ship_fuel_bid} />
    <ButtonAction action="reveal_bid" label="Reveal" />
  </div>
  <Attribute field={ship_warp_cores} />
</Panel>

<style lang="scss">
.ship-engines__bid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--ms-space-sm);
  align-items: end;
}
</style>
