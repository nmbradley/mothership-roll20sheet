<script>
  import Frame from "#svelte/components/Frame.svelte";
  import Header from "#svelte/components/Header.svelte";
</script>

<section class="ship-crew-panel">
  <Frame mode="light" corner="medium">
    <Header title="Officers & Crew" />
    <div class="ship-repeating-head ship-repeating-head--crew">
      <span>Name</span>
      <span>Rank / Role</span>
    </div>
    <fieldset class="repeating_shipcrew">
      <div class="ship-crew-row">
        <input
          class="ship-crew-row__name"
          type="text"
          name="attr_shipcrew_name"
          placeholder="Name"
        />
        <input
          class="ship-crew-row__rank"
          type="text"
          name="attr_shipcrew_rank"
          placeholder="Rank / Role"
        />
      </div>
    </fieldset>
  </Frame>
</section>

<style lang="scss">
  .ship-crew-panel {
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

    &--crew {
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }

  .ship-crew-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 0.75rem;

    &__name,
    &__rank {
      padding: 0.4rem;
      border: 1px solid var(--color-border, #000000);
      border-radius: 4px;
    }
  }
</style>
