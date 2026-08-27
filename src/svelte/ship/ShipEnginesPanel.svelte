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

<!-- #58 section 3, Engines. -->
<Panel title="Engines">
  <Attribute field={ship_fuel} />
  <!-- #60: captains write this down secretly during the Movement Phase, then
       Reveal posts it to chat, spends it off ship_fuel and resets it to 0. -->
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

  :global(.button) {
    align-self: end;
  }
}
</style>
