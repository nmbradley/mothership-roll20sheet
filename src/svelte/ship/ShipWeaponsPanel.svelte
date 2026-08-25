<script>
  import Frame from "#svelte/components/Frame.svelte";
  import Header from "#svelte/components/Header.svelte";
</script>

<section class="ship-weapons-panel">
  <Frame mode="light" corner="medium">
    <Header title="Ship Weapons" />
    <div class="ship-repeating-head ship-repeating-head--weapons">
      <span>Weapon</span>
      <span>Damage</span>
    </div>
    <fieldset class="repeating_shipweapons">
      <div class="ship-weapon-row">
        <input
          class="ship-weapon-row__name"
          type="text"
          name="attr_shipweapon_name"
          placeholder="Weapon Name"
        />
        <input
          class="ship-weapon-row__damage"
          type="text"
          name="attr_shipweapon_damage"
          placeholder="Damage"
        />
        <textarea
          class="ship-weapon-row__notes"
          name="attr_shipweapon_notes"
          placeholder="Notes"
        ></textarea>
      </div>
    </fieldset>
  </Frame>
</section>

<style lang="scss">
  .ship-weapons-panel {
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

    &--weapons {
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
    }
  }

  .ship-weapon-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 0.75rem;
    margin-bottom: 0.75rem;

    &__name,
    &__damage {
      padding: 0.4rem;
      border: 1px solid var(--color-border, #000000);
      border-radius: 4px;
    }

    &__notes {
      grid-column: 1 / -1;
      padding: 0.4rem;
      border: 1px solid var(--color-border, #000000);
      border-radius: 4px;
      min-height: 3rem;
      resize: vertical;
    }
  }
</style>
