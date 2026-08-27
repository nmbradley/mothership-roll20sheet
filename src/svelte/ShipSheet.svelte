<script lang="ts">
  import { ship_npc } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";

  import ShipCrewPanel from "./ship/ShipCrewPanel.svelte";
  import ShipEnginesPanel from "./ship/ShipEnginesPanel.svelte";
  import ShipHeader from "./ship/ShipHeader.svelte";
  import ShipManifestPanel from "./ship/ShipManifestPanel.svelte";
  import ShipMegadamagePanel from "./ship/ShipMegadamagePanel.svelte";
  import ShipOperationsPanel from "./ship/ShipOperationsPanel.svelte";
  import ShipStatsPanel from "./ship/ShipStatsPanel.svelte";
  import ShipSurvivalPanel from "./ship/ShipSurvivalPanel.svelte";
  import ShipWeaponsPanel from "./ship/ShipWeaponsPanel.svelte";
</script>

<div class="ship-sheet">
  <!--
    ship_npc's own control now lives on the settings page (#92), outside
    .ship-sheet. This mirrors it here, hidden, so ShipMegadamagePanel's
    :has(input[name="attr_ship_npc"]:checked) still finds a copy inside
    .ship-sheet to query -- Roll20 keeps every same-named input in step.
  -->
  <div class="ship-sheet__state">
    <Attribute field={ship_npc} isLabelHidden />
  </div>

  <!-- Header Section -->
  <header class="ship-sheet__header">
    <ShipHeader />
  </header>

  <!-- Main Grid Layout, in #58 section order. -->
  <div class="ship-sheet__grid">
    <ShipStatsPanel />
    <ShipEnginesPanel />
    <ShipSurvivalPanel />
    <ShipWeaponsPanel />
    <ShipMegadamagePanel />
    <ShipOperationsPanel />
    <ShipCrewPanel />
    <ShipManifestPanel />
  </div>
</div>

<style lang="scss">
  .ship-sheet {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    background-color: var(--ms-surface);

    font-family: var(--ms-font-body);
    color: var(--ms-fg);

    &__state {
      display: none;
    }

    &__header {
      width: 100%;
    }

    &__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
