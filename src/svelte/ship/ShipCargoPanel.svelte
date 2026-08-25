<script>
  import Frame from "#svelte/components/Frame.svelte";
  import Header from "#svelte/components/Header.svelte";
</script>

<section class="ship-cargo-panel">
  <Frame mode="light" corner="medium">
    <Header title="Cargo & Loadout" />
    <div class="ship-repeating-head ship-repeating-head--cargo">
      <span>Item</span>
      <span>Amount</span>
    </div>
    <fieldset class="repeating_shiploadout">
      <div class="ship-cargo-row">
        <input
          class="ship-cargo-row__item"
          type="text"
          name="attr_shiploadout_item"
          placeholder="Item"
        />
        <input
          class="ship-cargo-row__number"
          type="text"
          name="attr_shiploadout_number"
          placeholder="#"
        />
      </div>
    </fieldset>
  </Frame>
</section>

<style lang="scss">
  .ship-cargo-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    grid-column: 1 / -1;
  }

  .ship-repeating-head {
    display: grid;
    font-weight: bold;
    text-transform: uppercase;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--color-border, #000000);
    margin-bottom: 0.5rem;

    &--cargo {
      grid-template-columns: 3fr 1fr;
      gap: 1rem;
    }
  }

  .ship-cargo-row {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 0.75rem;
    margin-bottom: 0.75rem;

    &__item,
    &__number {
      padding: 0.4rem;
      border: 1px solid var(--color-border, #000000);
      border-radius: 4px;
    }
  }
</style>
