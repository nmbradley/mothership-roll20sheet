<script>
  import Frame from "../components/Frame.svelte";
  import Header from "../components/Header.svelte";
</script>

<div class="npc-attacks-panel">
  <Frame mode="light" corner="medium">
    <Header title="Attacks" />

    <div class="npc-attacks-table-header">
      <span class="npc-attacks-table-head-cell" data-i18n="attack">Attack</span>
      <span class="npc-attacks-table-head-cell" data-i18n="type">Type</span>
      <span class="npc-attacks-table-head-cell" data-i18n="damage">Damage</span>
      <span class="npc-attacks-table-head-cell npc-attacks-table-head-cell--cog"></span>
    </div>

    <fieldset class="repeating_attacks">
      <div class="npc-attack-row">
        <button
          class="npc-attack-row__roll-btn"
          type="roll"
          name="roll_attack"
          title="Roll Attack"
          aria-label="Roll Attack"
          value="&lbrace;&lbrace;template:ms&rbrace;&rbrace; &lbrace;&lbrace;name=@&lbrace;attack_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;character_name=@&lbrace;character_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;roll=[[1d100-1cs1cf99]]&rbrace;&rbrace; &lbrace;&lbrace;roll2=[[?&lbrace;Advantage/Disadvantage|Normal,0|Advantage/Disadvantage,1d100-1cs1cf99&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;target=[[@&lbrace;combat&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;ranges=@&lbrace;attack_range_s&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;rangem=@&lbrace;attack_range_m&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;rangel=@&lbrace;attack_range_l&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;damage=[[@&lbrace;attack_damage&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;notes=@&lbrace;attack_notes&rbrace;&rbrace;&rbrace;"
        >
          <span class="npc-attack-row__name-display" name="attr_attack_name"></span>
        </button>

        <select class="npc-attack-row__type-select" name="attr_attack_type" aria-label="Attack Type">
          <option value="Ranged" data-i18n="Ranged">Ranged</option>
          <option value="Melee" data-i18n="Melee">Melee</option>
        </select>

        <input
          class="npc-attack-row__damage-input"
          name="attr_attack_damage"
          type="text"
          placeholder="Damage"
          data-i18n-placeholder="damage"
          aria-label="Attack Damage"
        />

        <label class="npc-attack-row__cog-label">
          <input class="npc-attack-row__settings-toggle" name="attr_attack_settings" type="checkbox" checked />
          <span class="npc-attack-row__cog-icon">y</span>
        </label>

        <div class="npc-attack-row__settings-drawer">
          <div class="npc-attack-row__settings-row">
            <span class="npc-attack-row__settings-label" data-i18n="name">Name</span>
            <input
              class="npc-attack-row__settings-input"
              name="attr_attack_name"
              type="text"
              placeholder="Attack name"
              data-i18n-placeholder="attack name"
              aria-label="Attack Name"
            />
          </div>

          <div class="npc-attack-row__settings-row npc-attack-row__settings-row--ranges">
            <span class="npc-attack-row__settings-label" data-i18n="range">Range (S/M/L)</span>
            <div class="npc-attack-row__range-inputs">
              <input
                class="npc-attack-row__settings-input"
                name="attr_attack_range_s"
                type="text"
                placeholder="Short"
                data-i18n-placeholder="short"
                aria-label="Short Range"
              />
              <input
                class="npc-attack-row__settings-input"
                name="attr_attack_range_m"
                type="text"
                placeholder="Med"
                data-i18n-placeholder="medium"
                aria-label="Medium Range"
              />
              <input
                class="npc-attack-row__settings-input"
                name="attr_attack_range_l"
                type="text"
                placeholder="Long"
                data-i18n-placeholder="long"
                aria-label="Long Range"
              />
            </div>
          </div>

          <div class="npc-attack-row__settings-row npc-attack-row__settings-row--grid">
            <div>
              <span class="npc-attack-row__settings-label" data-i18n="critical damage">Critical Damage</span>
              <input
                class="npc-attack-row__settings-input"
                name="attr_attack_crit_damage"
                type="text"
                placeholder="Crit Damage"
                data-i18n-placeholder="damage"
                aria-label="Critical Damage"
              />
            </div>
            <div>
              <span class="npc-attack-row__settings-label" data-i18n="critical effect">Critical Effect</span>
              <input
                class="npc-attack-row__settings-input"
                name="attr_attack_crit_effect"
                type="text"
                placeholder="Crit Effect"
                data-i18n-placeholder="effect"
                aria-label="Critical Effect"
              />
            </div>
          </div>

          <div class="npc-attack-row__settings-row npc-attack-row__settings-row--grid">
            <div>
              <span class="npc-attack-row__settings-label" data-i18n="shots">Shots</span>
              <input
                class="npc-attack-row__settings-input"
                name="attr_attack_shots"
                type="text"
                placeholder="Shots"
                data-i18n-placeholder="shots"
                aria-label="Shots"
              />
            </div>
            <div>
              <span class="npc-attack-row__settings-label" data-i18n="ammunition">Ammunition</span>
              <input
                class="npc-attack-row__settings-input"
                name="attr_attack_ammunition"
                type="text"
                placeholder="Ammo"
                data-i18n-placeholder="ammunition"
                aria-label="Ammunition"
              />
            </div>
          </div>

          <div class="npc-attack-row__settings-row npc-attack-row__settings-row--full">
            <span class="npc-attack-row__settings-label" data-i18n="notes">Notes</span>
            <textarea
              class="npc-attack-row__settings-textarea"
              name="attr_attack_notes"
              placeholder="Special rules, wound types, or ammunition effects..."
              data-i18n-placeholder="notes"
              aria-label="Attack Notes"
            ></textarea>
          </div>
        </div>
      </div>
    </fieldset>
  </Frame>
</div>

<style lang="scss">
  .npc-attacks-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .npc-attacks-table-header {
    display: grid;
    grid-template-columns: 1fr 80px 100px 2rem;
    gap: 0.5rem;
    font-family: var(--font-header, "Montserrat", sans-serif);
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    color: #666666;
    border-bottom: 1px solid var(--color-border, #000000);
    padding-bottom: 0.25rem;
    margin-top: 0.5rem;
    margin-bottom: 0.4rem;
  }

  .npc-attack-row {
    display: grid;
    grid-template-columns: 1fr 80px 100px 2rem;
    gap: 0.5rem;
    align-items: center;
    padding: 0.35rem 0;
    border-bottom: 1px dotted #ccc;
    position: relative;

    &__roll-btn {
      display: flex;
      align-items: center;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      padding: 0;
      font-family: var(--font-header, "Montserrat", sans-serif);
      font-weight: bold;
      font-size: 0.95rem;
      color: var(--color-text, #000000);

      &:hover {
        color: var(--color-accent, #ff3366);
      }
    }

    &__type-select {
      font-size: 0.8rem;
      padding: 0.2rem;
      border: 1px solid var(--color-border, #000000);
      background: var(--color-bg, #ffffff);
      color: var(--color-text, #000000);
      border-radius: 2px;
    }

    &__damage-input {
      font-family: monospace;
      font-size: 0.85rem;
      padding: 0.2rem 0.35rem;
      border: 1px solid var(--color-border, #000000);
      background: var(--color-bg, #ffffff);
      color: var(--color-text, #000000);
      border-radius: 2px;
      width: 100%;
      box-sizing: border-box;
    }

    &__cog-label {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 0;
    }

    &__cog-icon {
      font-family: "Pictos";
      font-size: 1rem;
      color: #777;

      &:hover {
        color: var(--color-accent, #ff3366);
      }
    }

    &__settings-toggle {
      display: none;
    }

    &__settings-drawer {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background-color: var(--color-card-bg, #f4f4f4);
      border: 1px solid var(--color-border, #000000);
      padding: 0.6rem;
      margin-top: 0.4rem;
      border-radius: 4px;
    }

    :global(input.npc-attack-row__settings-toggle:not(:checked) ~ .npc-attack-row__settings-drawer) {
      display: none;
    }

    &__settings-row {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;

      &--ranges {
        .npc-attack-row__range-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.25rem;
        }
      }

      &--grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }
    }

    &__settings-label {
      font-family: var(--font-header, "Montserrat", sans-serif);
      font-size: 0.7rem;
      font-weight: bold;
      text-transform: uppercase;
      color: #555;
    }

    &__settings-input {
      font-size: 0.85rem;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--color-border, #000000);
      background: var(--color-bg, #ffffff);
      color: var(--color-text, #000000);
      border-radius: 2px;
    }

    &__settings-textarea {
      font-size: 0.85rem;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--color-border, #000000);
      background: var(--color-bg, #ffffff);
      color: var(--color-text, #000000);
      border-radius: 2px;
      resize: vertical;
      min-height: 3.5rem;
    }
  }
</style>
