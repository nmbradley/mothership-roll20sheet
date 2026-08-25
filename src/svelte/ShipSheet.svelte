<script>
  import ShipCargoPanel from "./ship/ShipCargoPanel.svelte";
  import ShipCrewPanel from "./ship/ShipCrewPanel.svelte";
  import ShipHeader from "./ship/ShipHeader.svelte";
  import ShipOperationsPanel from "./ship/ShipOperationsPanel.svelte";
  import ShipStatsPanel from "./ship/ShipStatsPanel.svelte";
  import ShipWeaponsPanel from "./ship/ShipWeaponsPanel.svelte";
</script>

<div class="ship-sheet">
  <!-- Header Section -->
  <header class="ship-sheet__header">
    <ShipHeader />
  </header>

  <!-- Main Grid Layout -->
  <div class="ship-sheet__grid">
    <ShipStatsPanel />
    <ShipOperationsPanel />
    <ShipWeaponsPanel />
    <ShipCrewPanel />
    <ShipCargoPanel />
  </div>
</div>

<style lang="scss">
  .ship-sheet {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: var(--font-body, "Century Gothic", "Diadact Gothic", sans-serif);
    color: var(--color-text, #000000);
    background-color: var(--color-bg, #ffffff);

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
