<script>
  import Button from "#svelte/components/Button.svelte";
  import Frame from "#svelte/components/Frame.svelte";
  import Header from "#svelte/components/Header.svelte";
</script>

<section class="ship-stats-panel">
  <!-- Core Stats -->
  <Frame mode="light" corner="medium">
    <Header title="Ship Stats (1e)" />
    <div class="ship-stats-list">
      <div class="ship-stat-row">
        <div class="ship-stat-row__btn">
          <Button action="systems_check" label="Systems" />
        </div>
        <input
          class="ship-stat-row__input"
          type="number"
          name="attr_systems"
          placeholder="0"
        />
      </div>
      <div class="ship-stat-row">
        <div class="ship-stat-row__btn">
          <Button action="thrusters_check" label="Thrusters" />
        </div>
        <input
          class="ship-stat-row__input"
          type="number"
          name="attr_thrusters"
          placeholder="0"
        />
      </div>
      <div class="ship-stat-row">
        <div class="ship-stat-row__btn">
          <Button action="battle_check" label="Battle" />
        </div>
        <input
          class="ship-stat-row__input"
          type="number"
          name="attr_battle"
          placeholder="0"
        />
      </div>
    </div>
  </Frame>

  <!-- Saves & Defenses -->
  <Frame mode="light" corner="medium">
    <Header title="Saves & Defenses" />
    <div class="ship-stats-list">
      <div class="ship-stat-row">
        <label class="ship-stat-row__label" for="attr_ship_armor">Armor</label>
        <input
          class="ship-stat-row__input"
          type="number"
          name="attr_ship_armor"
          placeholder="0"
        />
      </div>
      <div class="ship-stat-row">
        <div class="ship-stat-row__btn">
          <Button action="bankruptcy_save" label="Bankruptcy Save" />
        </div>
        <input
          class="ship-stat-row__input"
          type="number"
          name="attr_bankruptcy_save"
          placeholder="21"
          value="21"
        />
      </div>
    </div>
  </Frame>

  <!-- Hull & Wounds -->
  <Frame mode="light" corner="medium">
    <Header title="Hull & Wounds" />
    <div class="ship-hull-wounds">
      <div class="ship-minmax-stat">
        <span class="ship-minmax-stat__label">Wounds</span>
        <div class="ship-minmax-stat__inputs">
          <input
            class="ship-minmax-stat__input"
            type="number"
            name="attr_ship_wounds"
            placeholder="2"
          />
          <span class="ship-minmax-stat__sep">/</span>
          <input
            class="ship-minmax-stat__input"
            type="number"
            name="attr_ship_wounds_max"
            placeholder="2"
          />
        </div>
      </div>
      <div class="ship-minmax-stat">
        <span class="ship-minmax-stat__label">Hull</span>
        <div class="ship-minmax-stat__inputs">
          <input
            class="ship-minmax-stat__input"
            type="number"
            name="attr_ship_hull"
            placeholder="10"
          />
          <span class="ship-minmax-stat__sep">/</span>
          <input
            class="ship-minmax-stat__input"
            type="number"
            name="attr_ship_hull_max"
            placeholder="10"
          />
        </div>
      </div>
      <div class="ship-hull-thresholds">
        <div class="ship-hull-threshold">
          <span class="ship-hull-threshold__pct">25%</span>
          <input
            class="ship-hull-threshold__input"
            type="number"
            name="attr_hull_25"
            placeholder="8"
          />
        </div>
        <div class="ship-hull-threshold">
          <span class="ship-hull-threshold__pct">50%</span>
          <input
            class="ship-hull-threshold__input"
            type="number"
            name="attr_hull_50"
            placeholder="5"
          />
        </div>
        <div class="ship-hull-threshold">
          <span class="ship-hull-threshold__pct">75%</span>
          <input
            class="ship-hull-threshold__input"
            type="number"
            name="attr_hull_75"
            placeholder="3"
          />
        </div>
      </div>
    </div>
  </Frame>
</section>

<style lang="scss">
  .ship-stats-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ship-stats-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .ship-stat-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;

    &__label {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 1.1rem;
    }

    &__input {
      width: 4.5rem;
      height: 2.5rem;
      text-align: center;
      font-size: 1.3rem;
      font-weight: bold;
      border: 2px solid var(--color-border, #000000);
      border-radius: 4px;
    }
  }

  .ship-minmax-stat {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;

    &__label {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 1.1rem;
    }

    &__inputs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &__input {
      width: 3.5rem;
      height: 2.5rem;
      text-align: center;
      font-size: 1.2rem;
      font-weight: bold;
      border: 2px solid var(--color-border, #000000);
      border-radius: 4px;
    }

    &__sep {
      font-weight: bold;
      font-size: 1.2rem;
    }
  }

  .ship-hull-wounds {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ship-hull-thresholds {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .ship-hull-threshold {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    &__pct {
      font-weight: bold;
      font-size: 0.9rem;
      text-transform: uppercase;
      color: var(--color-text-muted, #666666);
    }

    &__input {
      width: 100%;
      height: 2.25rem;
      text-align: center;
      font-weight: bold;
      border: 2px solid var(--color-border, #000000);
      border-radius: 4px;
    }
  }
</style>
