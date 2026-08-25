<script>
  import Frame from "../components/Frame.svelte";
  import Header from "../components/Header.svelte";

  const stats = [
    {
      name: "Combat",
      short: "C",
      attr: "combat",
      desc: "This works exactly like the Combat Stat, showing how good they are in a fight.",
      placeholder: "20",
    },
    {
      name: "Instinct",
      short: "I",
      attr: "instinct",
      desc: "This is a catchall Stat for Fear, Sanity, Body, Speed, Intellect, and everything else.",
      placeholder: "25",
    },
  ];
</script>

<section class="npc-stats-panel">
  <Frame mode="light" corner="medium">
    <Header title="Stats & Vitals" />
    <div class="npc-stats-grid">
      <!-- Combat & Instinct Stats (No Speed) -->
      {#each stats as stat (stat.attr)}
        <div class="npc-stat-card">
          <div class="npc-stat-card__header">
            <button
              class="npc-stat-card__roll-btn"
              type="roll"
              name="roll_{stat.attr}"
              title="Roll {stat.name}"
              aria-label="Roll {stat.name}"
              value="&lbrace;&lbrace;template:ms&rbrace;&rbrace; &lbrace;&lbrace;name={stat.name}&rbrace;&rbrace; &lbrace;&lbrace;character_name=@&lbrace;character_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;roll=[[1d100-1cs1cf99]]&rbrace;&rbrace; &lbrace;&lbrace;roll2=[[?&lbrace;Advantage/Disadvantage|Normal,0|Advantage/Disadvantage,1d100-1cs1cf99&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;target=@&lbrace;{stat.attr}&rbrace;&rbrace;&rbrace;"
            >
              <span class="npc-stat-card__title" data-i18n={stat.name}>{stat.name} ({stat.short})</span>
            </button>
            <span class="npc-stat-card__tooltip">{stat.desc}</span>
          </div>
          <input
            class="npc-stat-card__input"
            name="attr_{stat.attr}"
            type="number"
            placeholder={stat.placeholder}
            aria-label="{stat.name} value"
          />
        </div>
      {/each}

      <!-- Initiative Roll Button (rolls Instinct into Turn Tracker) -->
      <div class="npc-stat-card npc-stat-card--initiative">
        <div class="npc-stat-card__header">
          <button
            class="npc-stat-card__roll-btn npc-stat-card__roll-btn--initiative"
            type="roll"
            name="roll_initiative"
            title="Roll Initiative into Turn Tracker"
            aria-label="Roll Initiative into Turn Tracker"
            value="&lbrace;&lbrace;template:ms&rbrace;&rbrace; &lbrace;&lbrace;name=Initiative&rbrace;&rbrace; &lbrace;&lbrace;character_name=@&lbrace;character_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;roll=[[1d100-1cs1cf99 &amp;&lbrace;tracker&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;roll2=[[?&lbrace;Advantage/Disadvantage|Normal,0|Advantage/Disadvantage,1d100-1cs1cf99 &amp;&lbrace;tracker&rbrace;&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;target=@&lbrace;instinct&rbrace;&rbrace;&rbrace;"
          >
            <span class="npc-stat-card__title" data-i18n="initiative">Initiative</span>
          </button>
          <span class="npc-stat-card__tooltip" data-i18n="Rolls Instinct and adds to the Turn Tracker">Rolls Instinct and adds to Turn Tracker (&amp;&lbrace;tracker&rbrace;)</span>
        </div>
        <div class="npc-stat-card__initiative-subtext">Instinct + Tracker</div>
      </div>

      <!-- Wounds Tracker (Supports W:1, W:2, etc.) -->
      <div class="npc-vital-card npc-vital-card--wounds">
        <div class="npc-vital-card__label" data-i18n="wounds">Wounds (W)</div>
        <div class="npc-vital-card__minmax-wrapper">
          <input
            class="npc-vital-card__input"
            name="attr_wounds"
            type="number"
            placeholder="1"
            title="Current Wounds"
            aria-label="Current Wounds"
          />
          <span class="npc-vital-card__separator">/</span>
          <input
            class="npc-vital-card__input"
            name="attr_wounds_max"
            type="number"
            placeholder="1"
            title="Max Wounds"
            aria-label="Max Wounds"
          />
        </div>
        <div class="npc-vital-card__sublabels">
          <span data-i18n="current">Current</span>
          <span data-i18n="max">Max</span>
        </div>
      </div>

      <!-- Health per Wound (Supports W:2(20), optional for W:1) -->
      <div class="npc-vital-card npc-vital-card--health">
        <div class="npc-vital-card__label" data-i18n="health">Health (HP)</div>
        <div class="npc-vital-card__minmax-wrapper">
          <input
            class="npc-vital-card__input"
            name="attr_health"
            type="number"
            placeholder="20"
            title="Current Health"
            aria-label="Current Health"
          />
          <span class="npc-vital-card__separator">/</span>
          <input
            class="npc-vital-card__input"
            name="attr_health_max"
            type="number"
            placeholder="20"
            title="Health per Wound"
            aria-label="Health per Wound"
          />
        </div>
        <div class="npc-vital-card__sublabels">
          <span data-i18n="current">Current</span>
          <span data-i18n="per wound">Per Wound</span>
        </div>
      </div>

      <!-- Armor Points (AP) Tracker -->
      <div class="npc-vital-card npc-vital-card--ap">
        <div class="npc-vital-card__label" data-i18n="armor points">Armor Points (AP)</div>
        <input
          class="npc-stat-card__input npc-stat-card__input--ap"
          name="attr_armor_points"
          type="number"
          placeholder="0"
          aria-label="Armor Points"
        />
      </div>
    </div>
  </Frame>
</section>

<style lang="scss">
  .npc-stats-panel {
    width: 100%;
  }

  .npc-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 0.75rem;
    align-items: stretch;
    margin-top: 0.75rem;
  }

  .npc-stat-card,
  .npc-vital-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 2px solid var(--color-border, #000000);
    background-color: var(--color-card-bg, #f4f4f4);
    padding: 0.5rem;
    border-radius: 4px;
    position: relative;
  }

  .npc-stat-card {
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      &:hover .npc-stat-card__tooltip {
        display: block;
      }
    }

    &__roll-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      font-family: var(--font-header, "Montserrat", sans-serif);
      font-size: 0.9rem;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--color-text, #000000);

      &:hover {
        color: var(--color-accent, #ff3366);
      }

      &--initiative {
        color: #ffffff;
      }
    }

    &--initiative {
      background-color: #000000;
      color: #ffffff;
      border-color: #000000;

      .npc-stat-card__roll-btn:hover {
        color: var(--color-accent, #ff3366);
      }
    }

    &__initiative-subtext {
      font-size: 0.7rem;
      color: #aaaaaa;
      font-family: var(--font-header, "Montserrat", sans-serif);
      text-transform: uppercase;
      margin-top: 0.25rem;
    }

    &__tooltip {
      display: none;
      position: absolute;
      bottom: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #000000;
      color: #ffffff;
      padding: 0.4rem 0.6rem;
      font-size: 0.75rem;
      border-radius: 4px;
      white-space: normal;
      width: 180px;
      z-index: 100;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      pointer-events: none;
    }

    &__input {
      font-family: var(--font-header, "Montserrat", sans-serif);
      font-size: 1.4rem;
      font-weight: bold;
      text-align: center;
      border: 1px solid var(--color-border, #000000);
      background: var(--color-bg, #ffffff);
      color: var(--color-text, #000000);
      padding: 0.25rem;
      margin-top: 0.25rem;
      border-radius: 2px;
      width: 100%;
      box-sizing: border-box;

      &--ap {
        font-size: 1.3rem;
      }
    }
  }

  .npc-vital-card {
    &__label {
      font-family: var(--font-header, "Montserrat", sans-serif);
      font-size: 0.85rem;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--color-text, #000000);
      margin-bottom: 0.25rem;
    }

    &__minmax-wrapper {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    &__input {
      font-family: var(--font-header, "Montserrat", sans-serif);
      font-size: 1.2rem;
      font-weight: bold;
      text-align: center;
      border: 1px solid var(--color-border, #000000);
      background: var(--color-bg, #ffffff);
      color: var(--color-text, #000000);
      padding: 0.25rem;
      width: 100%;
      border-radius: 2px;
      box-sizing: border-box;
    }

    &__separator {
      font-weight: bold;
      color: var(--color-text, #000000);
    }

    &__sublabels {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      color: #666666;
      text-transform: uppercase;
      font-family: var(--font-header, "Montserrat", sans-serif);
      margin-top: 0.15rem;
    }
  }
</style>
