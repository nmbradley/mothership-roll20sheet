<script>
  import Button from "#svelte/components/Button.svelte";
  import Frame from "#svelte/components/Frame.svelte";
  import Header from "#svelte/components/Header.svelte";
</script>

<section class="ship-operations-panel">
  <Frame mode="light-grey" corner="medium">
    <Header title="Ship Operations & Maintenance" />
    <div class="ship-operations">
      <div class="ship-operation-card">
        <div class="ship-operation-card__header">
          <Button action="starting_condition" label="Starting Condition" />
        </div>
        <p class="ship-operation-card__desc">
          Rolls <strong>1d5+1</strong> to determine the number of starting issues.
        </p>
      </div>

      <div class="ship-operation-card">
        <div class="ship-operation-card__header">
          <Button action="annual_maintenance" label="Annual Maintenance Check" />
        </div>
        <p class="ship-operation-card__desc">
          Rolls a <strong>Systems Check</strong>. Failure rolls once on the
          <em>Maintenance Issues Table</em> (everyone gains 1 Stress).
          Critical Failure rolls twice on the table (everyone makes a Panic Check).
        </p>
      </div>

      <div class="ship-operation-card">
        <div class="ship-operation-card__header">
          <Button action="bankruptcy_save" label="Bankruptcy Save" />
        </div>
        <p class="ship-operation-card__desc">
          Rolls 1d100 under your <strong>Bankruptcy Save</strong> (defaults to 2d10+10)
          and resolves consequences from the <em>Bankruptcy Table</em>.
        </p>
      </div>
    </div>
  </Frame>

  <Frame mode="light" corner="medium">
    <Header title="Secondary Stats" />
    <div class="ship-secondary-stats">
      <div class="ship-minmax-stat">
        <span class="ship-minmax-stat__label">Crew</span>
        <div class="ship-minmax-stat__inputs">
          <input
            class="ship-minmax-stat__input"
            type="number"
            name="attr_crew"
            placeholder="0"
          />
          <span class="ship-minmax-stat__sep">/</span>
          <input
            class="ship-minmax-stat__input"
            type="number"
            name="attr_crew_max"
            placeholder="0"
          />
        </div>
      </div>
      <div class="ship-minmax-stat">
        <span class="ship-minmax-stat__label">Fuel</span>
        <div class="ship-minmax-stat__inputs">
          <input
            class="ship-minmax-stat__input"
            type="number"
            name="attr_fuel"
            placeholder="0"
          />
          <span class="ship-minmax-stat__sep">/</span>
          <input
            class="ship-minmax-stat__input"
            type="number"
            name="attr_fuel_max"
            placeholder="0"
          />
        </div>
      </div>
      <div class="ship-stat-row">
        <label class="ship-stat-row__label" for="attr_loadout_max">Max Cargo</label>
        <input
          class="ship-stat-row__input"
          type="number"
          name="attr_loadout_max"
          placeholder="0"
        />
      </div>
    </div>
  </Frame>
</section>

<style lang="scss">
  .ship-operations-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ship-operations {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .ship-operation-card {
    padding: 1rem;
    border: 2px solid var(--color-border, #000000);
    border-radius: 8px;
    background-color: var(--color-bg, #ffffff);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__header {
      display: flex;
      align-items: center;
    }

    &__desc {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.4;
      color: var(--color-text, #000000);
    }
  }

  .ship-secondary-stats {
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
</style>
