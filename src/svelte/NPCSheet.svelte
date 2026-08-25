<script>
  // NPC Stat Definitions for Mothership 1e
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

<div class="npc-sheet">
  <!-- NPC Header & Name -->
  <header class="npc-sheet__header">
    <div class="npc-sheet__title-group">
      <span class="npc-sheet__badge" data-i18n="npc">NPC / CONTRACTOR</span>
      <input
        class="npc-sheet__name-input"
        name="attr_character_name"
        type="text"
        placeholder="NPC Name"
        data-i18n-placeholder="NPC Name"
        aria-label="NPC Name"
      />
    </div>
  </header>

  <!-- Core Stats & Vitals Row -->
  <section class="npc-sheet__stats-section">
    <div class="npc-sheet__stats-grid">
      <!-- Combat & Instinct Stats (No Speed) -->
      {#each stats as stat (stat.attr)}
        <div class="npc-sheet__stat-card">
          <div class="npc-sheet__stat-header">
            <button
              class="npc-sheet__stat-roll-btn"
              type="roll"
              name="roll_{stat.attr}"
              title="Roll {stat.name}"
              aria-label="Roll {stat.name}"
              value="&lbrace;&lbrace;template:ms&rbrace;&rbrace; &lbrace;&lbrace;name={stat.name}&rbrace;&rbrace; &lbrace;&lbrace;character_name=@&lbrace;character_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;roll=[[1d100-1cs1cf99]]&rbrace;&rbrace; &lbrace;&lbrace;roll2=[[?&lbrace;Advantage/Disadvantage|Normal,0|Advantage/Disadvantage,1d100-1cs1cf99&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;target=@&lbrace;{stat.attr}&rbrace;&rbrace;&rbrace;"
            >
              <span class="npc-sheet__stat-title" data-i18n={stat.name}>{stat.name} ({stat.short})</span>
            </button>
            <span class="npc-sheet__tooltip">{stat.desc}</span>
          </div>
          <input
            class="npc-sheet__stat-input"
            name="attr_{stat.attr}"
            type="number"
            placeholder={stat.placeholder}
            aria-label="{stat.name} value"
          />
        </div>
      {/each}

      <!-- Initiative Roll Button (rolls Instinct into Turn Tracker) -->
      <div class="npc-sheet__stat-card npc-sheet__stat-card--initiative">
        <div class="npc-sheet__stat-header">
          <button
            class="npc-sheet__stat-roll-btn npc-sheet__stat-roll-btn--initiative"
            type="roll"
            name="roll_initiative"
            title="Roll Initiative into Turn Tracker"
            aria-label="Roll Initiative into Turn Tracker"
            value="&lbrace;&lbrace;template:ms&rbrace;&rbrace; &lbrace;&lbrace;name=Initiative&rbrace;&rbrace; &lbrace;&lbrace;character_name=@&lbrace;character_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;roll=[[1d100-1cs1cf99 &amp;&lbrace;tracker&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;roll2=[[?&lbrace;Advantage/Disadvantage|Normal,0|Advantage/Disadvantage,1d100-1cs1cf99 &amp;&lbrace;tracker&rbrace;&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;target=@&lbrace;instinct&rbrace;&rbrace;&rbrace;"
          >
            <span class="npc-sheet__stat-title" data-i18n="initiative">Initiative</span>
          </button>
          <span class="npc-sheet__tooltip" data-i18n="Rolls Instinct and adds to the Turn Tracker">Rolls Instinct and adds to Turn Tracker (&amp;&lbrace;tracker&rbrace;)</span>
        </div>
        <div class="npc-sheet__initiative-subtext">Instinct + Tracker</div>
      </div>

      <!-- Wounds Tracker (Supports W:1, W:2, etc.) -->
      <div class="npc-sheet__vital-card npc-sheet__vital-card--wounds">
        <div class="npc-sheet__vital-label" data-i18n="wounds">Wounds (W)</div>
        <div class="npc-sheet__minmax-wrapper">
          <input
            class="npc-sheet__vital-input"
            name="attr_wounds"
            type="number"
            placeholder="1"
            title="Current Wounds"
            aria-label="Current Wounds"
          />
          <span class="npc-sheet__separator">/</span>
          <input
            class="npc-sheet__vital-input"
            name="attr_wounds_max"
            type="number"
            placeholder="1"
            title="Max Wounds"
            aria-label="Max Wounds"
          />
        </div>
        <div class="npc-sheet__vital-sublabels">
          <span data-i18n="current">Current</span>
          <span data-i18n="max">Max</span>
        </div>
      </div>

      <!-- Health per Wound (Supports W:2(20), optional for W:1) -->
      <div class="npc-sheet__vital-card npc-sheet__vital-card--health">
        <div class="npc-sheet__vital-label" data-i18n="health">Health (HP)</div>
        <div class="npc-sheet__minmax-wrapper">
          <input
            class="npc-sheet__vital-input"
            name="attr_health"
            type="number"
            placeholder="20"
            title="Current Health"
            aria-label="Current Health"
          />
          <span class="npc-sheet__separator">/</span>
          <input
            class="npc-sheet__vital-input"
            name="attr_health_max"
            type="number"
            placeholder="20"
            title="Health per Wound"
            aria-label="Health per Wound"
          />
        </div>
        <div class="npc-sheet__vital-sublabels">
          <span data-i18n="current">Current</span>
          <span data-i18n="per wound">Per Wound</span>
        </div>
      </div>

      <!-- Armor Points (AP) Tracker -->
      <div class="npc-sheet__vital-card npc-sheet__vital-card--ap">
        <div class="npc-sheet__vital-label" data-i18n="armor points">Armor Points (AP)</div>
        <input
          class="npc-sheet__stat-input npc-sheet__stat-input--ap"
          name="attr_armor_points"
          type="number"
          placeholder="0"
          aria-label="Armor Points"
        />
      </div>
    </div>
  </section>

  <!-- Attacks & Traits Repeating Sections -->
  <section class="npc-sheet__main-content">
    <!-- Attacks (matching PC Weapons) -->
    <div class="npc-sheet__section npc-sheet__attacks">
      <div class="npc-sheet__section-header">
        <h3 class="npc-sheet__section-title" data-i18n="attacks">Attacks</h3>
      </div>

      <div class="npc-sheet__table-header">
        <span class="npc-sheet__table-head-cell" data-i18n="attack">Attack</span>
        <span class="npc-sheet__table-head-cell" data-i18n="type">Type</span>
        <span class="npc-sheet__table-head-cell" data-i18n="damage">Damage</span>
        <span class="npc-sheet__table-head-cell npc-sheet__table-head-cell--cog"></span>
      </div>

      <fieldset class="repeating_attacks">
        <div class="npc-sheet__attack-row">
          <button
            class="npc-sheet__row-roll-btn"
            type="roll"
            name="roll_attack"
            title="Roll Attack"
            aria-label="Roll Attack"
            value="&lbrace;&lbrace;template:ms&rbrace;&rbrace; &lbrace;&lbrace;name=@&lbrace;attack_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;character_name=@&lbrace;character_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;roll=[[1d100-1cs1cf99]]&rbrace;&rbrace; &lbrace;&lbrace;roll2=[[?&lbrace;Advantage/Disadvantage|Normal,0|Advantage/Disadvantage,1d100-1cs1cf99&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;target=[[@&lbrace;combat&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;ranges=@&lbrace;attack_range_s&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;rangem=@&lbrace;attack_range_m&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;rangel=@&lbrace;attack_range_l&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;damage=[[@&lbrace;attack_damage&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;notes=@&lbrace;attack_notes&rbrace;&rbrace;&rbrace;"
          >
            <span class="npc-sheet__attack-name-display" name="attr_attack_name"></span>
          </button>

          <select class="npc-sheet__attack-type-select" name="attr_attack_type" aria-label="Attack Type">
            <option value="Ranged" data-i18n="Ranged">Ranged</option>
            <option value="Melee" data-i18n="Melee">Melee</option>
          </select>

          <input
            class="npc-sheet__attack-damage-input"
            name="attr_attack_damage"
            type="text"
            placeholder="Damage"
            data-i18n-placeholder="damage"
            aria-label="Attack Damage"
          />

          <label class="npc-sheet__cog-label">
            <input class="npc-sheet__settings-toggle" name="attr_attack_settings" type="checkbox" checked />
            <span class="npc-sheet__cog-icon">y</span>
          </label>

          <div class="npc-sheet__settings-drawer npc-sheet__attack-settings">
            <div class="npc-sheet__settings-row">
              <span class="npc-sheet__settings-label" data-i18n="name">Name</span>
              <input
                class="npc-sheet__settings-input"
                name="attr_attack_name"
                type="text"
                placeholder="Attack name"
                data-i18n-placeholder="attack name"
                aria-label="Attack Name"
              />
            </div>

            <div class="npc-sheet__settings-row npc-sheet__settings-row--ranges">
              <span class="npc-sheet__settings-label" data-i18n="range">Range (S/M/L)</span>
              <div class="npc-sheet__range-inputs">
                <input
                  class="npc-sheet__settings-input"
                  name="attr_attack_range_s"
                  type="text"
                  placeholder="Short"
                  data-i18n-placeholder="short"
                  aria-label="Short Range"
                />
                <input
                  class="npc-sheet__settings-input"
                  name="attr_attack_range_m"
                  type="text"
                  placeholder="Med"
                  data-i18n-placeholder="medium"
                  aria-label="Medium Range"
                />
                <input
                  class="npc-sheet__settings-input"
                  name="attr_attack_range_l"
                  type="text"
                  placeholder="Long"
                  data-i18n-placeholder="long"
                  aria-label="Long Range"
                />
              </div>
            </div>

            <div class="npc-sheet__settings-row npc-sheet__settings-row--grid">
              <div>
                <span class="npc-sheet__settings-label" data-i18n="critical damage">Critical Damage</span>
                <input
                  class="npc-sheet__settings-input"
                  name="attr_attack_crit_damage"
                  type="text"
                  placeholder="Crit Damage"
                  data-i18n-placeholder="damage"
                  aria-label="Critical Damage"
                />
              </div>
              <div>
                <span class="npc-sheet__settings-label" data-i18n="critical effect">Critical Effect</span>
                <input
                  class="npc-sheet__settings-input"
                  name="attr_attack_crit_effect"
                  type="text"
                  placeholder="Crit Effect"
                  data-i18n-placeholder="effect"
                  aria-label="Critical Effect"
                />
              </div>
            </div>

            <div class="npc-sheet__settings-row npc-sheet__settings-row--grid">
              <div>
                <span class="npc-sheet__settings-label" data-i18n="shots">Shots</span>
                <input
                  class="npc-sheet__settings-input"
                  name="attr_attack_shots"
                  type="text"
                  placeholder="Shots"
                  data-i18n-placeholder="shots"
                  aria-label="Shots"
                />
              </div>
              <div>
                <span class="npc-sheet__settings-label" data-i18n="ammunition">Ammunition</span>
                <input
                  class="npc-sheet__settings-input"
                  name="attr_attack_ammunition"
                  type="text"
                  placeholder="Ammo"
                  data-i18n-placeholder="ammunition"
                  aria-label="Ammunition"
                />
              </div>
            </div>

            <div class="npc-sheet__settings-row npc-sheet__settings-row--full">
              <span class="npc-sheet__settings-label" data-i18n="notes">Notes</span>
              <textarea
                class="npc-sheet__settings-textarea"
                name="attr_attack_notes"
                placeholder="Special rules, wound types, or ammunition effects..."
                data-i18n-placeholder="notes"
                aria-label="Attack Notes"
              ></textarea>
            </div>
          </div>
        </div>
      </fieldset>
    </div>

    <!-- Traits (Renamed from Special Abilities) -->
    <div class="npc-sheet__section npc-sheet__traits">
      <div class="npc-sheet__section-header">
        <h3 class="npc-sheet__section-title" data-i18n="traits">Traits</h3>
      </div>

      <fieldset class="repeating_traits">
        <div class="npc-sheet__trait-row">
          <button
            class="npc-sheet__row-roll-btn"
            type="roll"
            name="roll_trait"
            title="Roll Trait"
            aria-label="Roll Trait"
            value="&lbrace;&lbrace;template:ms&rbrace;&rbrace; &lbrace;&lbrace;name=@&lbrace;trait_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;character_name=@&lbrace;character_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;notes=@&lbrace;trait_description&rbrace;&rbrace;&rbrace;"
          >
            <span class="npc-sheet__trait-name-display" name="attr_trait_name"></span>
          </button>

          <label class="npc-sheet__cog-label">
            <input class="npc-sheet__settings-toggle" name="attr_trait_settings" type="checkbox" checked />
            <span class="npc-sheet__cog-icon">y</span>
          </label>

          <div class="npc-sheet__trait-preview" name="attr_trait_description"></div>

          <div class="npc-sheet__settings-drawer npc-sheet__trait-settings">
            <div class="npc-sheet__settings-row">
              <span class="npc-sheet__settings-label" data-i18n="name">Trait Name</span>
              <input
                class="npc-sheet__settings-input"
                name="attr_trait_name"
                type="text"
                placeholder="Trait name"
                data-i18n-placeholder="trait name"
                aria-label="Trait Name"
              />
            </div>

            <div class="npc-sheet__settings-row npc-sheet__settings-row--full">
              <span class="npc-sheet__settings-label" data-i18n="description">Description</span>
              <textarea
                class="npc-sheet__settings-textarea"
                name="attr_trait_description"
                placeholder="Describe the trait or special rule..."
                data-i18n-placeholder="trait description"
                aria-label="Trait Description"
              ></textarea>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </section>

  <!-- Narrative Information (Description & Equipment/Notes) -->
  <section class="npc-sheet__narrative-grid">
    <div class="npc-sheet__narrative-card">
      <h3 class="npc-sheet__section-title" data-i18n="description">Description</h3>
      <textarea
        class="npc-sheet__textarea"
        name="attr_description"
        placeholder="Enter the NPC's description, motivation, or behavior here."
        data-i18n-placeholder="Enter the NPC's description here."
        aria-label="NPC Description"
      ></textarea>
    </div>

    <div class="npc-sheet__narrative-card">
      <h3 class="npc-sheet__section-title" data-i18n="equipment">Equipment & Notes</h3>
      <textarea
        class="npc-sheet__textarea"
        name="attr_equipment"
        placeholder="Enter the NPC's equipment, gear, salary, or notes here."
        data-i18n-placeholder="Enter the NPC's equipment here."
        aria-label="NPC Equipment and Notes"
      ></textarea>
    </div>
  </section>
</div>

<style lang="scss">
  .npc-sheet {
    --npc-bg: var(--color-bg, #ffffff);
    --npc-text: var(--color-text, #000000);
    --npc-border: var(--color-border, #000000);
    --npc-accent: var(--color-accent, #ff3366);
    --npc-card-bg: var(--color-card-bg, #f4f4f4);
    --npc-card-dark: var(--color-card-dark, #000000);
    --npc-card-text-dark: #ffffff;
    --npc-font-header: "Montserrat", "Arial Black", sans-serif;
    --npc-font-mono: monospace;

    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1rem;
    background-color: var(--npc-bg);
    color: var(--npc-text);
    box-sizing: border-box;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid var(--npc-border);
      padding-bottom: 0.75rem;
    }

    &__title-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
    }

    &__badge {
      font-family: var(--npc-font-header);
      font-size: 0.75rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--npc-accent);
    }

    &__name-input {
      font-family: var(--npc-font-header);
      font-size: 1.75rem;
      font-weight: bold;
      text-transform: uppercase;
      border: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--npc-text);
      width: 100%;
      outline: none;

      &:focus {
        border-bottom-color: var(--npc-accent);
      }
    }

    &__stats-section {
      width: 100%;
    }

    &__stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 0.75rem;
      align-items: stretch;
    }

    &__stat-card,
    &__vital-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 2px solid var(--npc-border);
      background-color: var(--npc-card-bg);
      padding: 0.5rem;
      border-radius: 4px;
      position: relative;
    }

    &__stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      &:hover .npc-sheet__tooltip {
        display: block;
      }
    }

    &__stat-roll-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      font-family: var(--npc-font-header);
      font-size: 0.9rem;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--npc-text);

      &:hover {
        color: var(--npc-accent);
      }

      &--initiative {
        color: var(--npc-card-text-dark);
      }
    }

    &__stat-card--initiative {
      background-color: var(--npc-card-dark);
      color: var(--npc-card-text-dark);
      border-color: var(--npc-card-dark);

      .npc-sheet__stat-roll-btn:hover {
        color: var(--npc-accent);
      }
    }

    &__initiative-subtext {
      font-size: 0.7rem;
      color: #aaaaaa;
      font-family: var(--npc-font-header);
      text-transform: uppercase;
      margin-top: 0.25rem;
    }

    &__tooltip {
      display: none;
      position: absolute;
      bottom: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--npc-card-dark);
      color: var(--npc-card-text-dark);
      padding: 0.4rem 0.6rem;
      font-size: 0.75rem;
      border-radius: 4px;
      white-space: normal;
      width: 180px;
      z-index: 100;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      pointer-events: none;
    }

    &__stat-input {
      font-family: var(--npc-font-header);
      font-size: 1.4rem;
      font-weight: bold;
      text-align: center;
      border: 1px solid var(--npc-border);
      background: var(--npc-bg);
      color: var(--npc-text);
      padding: 0.25rem;
      margin-top: 0.25rem;
      border-radius: 2px;
      width: 100%;
      box-sizing: border-box;

      &--ap {
        font-size: 1.3rem;
      }
    }

    &__vital-label {
      font-family: var(--npc-font-header);
      font-size: 0.85rem;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--npc-text);
      margin-bottom: 0.25rem;
    }

    &__minmax-wrapper {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    &__vital-input {
      font-family: var(--npc-font-header);
      font-size: 1.2rem;
      font-weight: bold;
      text-align: center;
      border: 1px solid var(--npc-border);
      background: var(--npc-bg);
      color: var(--npc-text);
      padding: 0.25rem;
      width: 100%;
      border-radius: 2px;
      box-sizing: border-box;
    }

    &__separator {
      font-weight: bold;
      color: var(--npc-text);
    }

    &__vital-sublabels {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      color: #666666;
      text-transform: uppercase;
      font-family: var(--npc-font-header);
      margin-top: 0.15rem;
    }

    &__main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    &__section {
      display: flex;
      flex-direction: column;
      border: 2px solid var(--npc-border);
      border-radius: 4px;
      padding: 0.75rem;
      background-color: var(--npc-bg);
    }

    &__section-header {
      border-bottom: 2px solid var(--npc-border);
      padding-bottom: 0.4rem;
      margin-bottom: 0.5rem;
    }

    &__section-title {
      font-family: var(--npc-font-header);
      font-size: 1.1rem;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
      color: var(--npc-text);
    }

    &__table-header {
      display: grid;
      grid-template-columns: 1fr 80px 100px 2rem;
      gap: 0.5rem;
      font-family: var(--npc-font-header);
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
      color: #666666;
      border-bottom: 1px solid var(--npc-border);
      padding-bottom: 0.25rem;
      margin-bottom: 0.4rem;
    }

    &__attack-row,
    &__trait-row {
      display: grid;
      grid-template-columns: 1fr 80px 100px 2rem;
      gap: 0.5rem;
      align-items: center;
      padding: 0.35rem 0;
      border-bottom: 1px dotted #ccc;
      position: relative;
    }

    &__trait-row {
      grid-template-columns: 1fr 2rem;
    }

    &__row-roll-btn {
      display: flex;
      align-items: center;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      padding: 0;
      font-family: var(--npc-font-header);
      font-weight: bold;
      font-size: 0.95rem;
      color: var(--npc-text);

      &:hover {
        color: var(--npc-accent);
      }
    }

    &__attack-type-select {
      font-size: 0.8rem;
      padding: 0.2rem;
      border: 1px solid var(--npc-border);
      background: var(--npc-bg);
      color: var(--npc-text);
      border-radius: 2px;
    }

    &__attack-damage-input {
      font-family: var(--npc-font-mono);
      font-size: 0.85rem;
      padding: 0.2rem 0.35rem;
      border: 1px solid var(--npc-border);
      background: var(--npc-bg);
      color: var(--npc-text);
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
        color: var(--npc-accent);
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
      background-color: var(--npc-card-bg);
      border: 1px solid var(--npc-border);
      padding: 0.6rem;
      margin-top: 0.4rem;
      border-radius: 4px;
    }

    :global(input.npc-sheet__settings-toggle:not(:checked) ~ .npc-sheet__settings-drawer) {
      display: none;
    }

    &__settings-row {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;

      &--ranges {
        .npc-sheet__range-inputs {
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
      font-family: var(--npc-font-header);
      font-size: 0.7rem;
      font-weight: bold;
      text-transform: uppercase;
      color: #555;
    }

    &__settings-input {
      font-size: 0.85rem;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--npc-border);
      background: var(--npc-bg);
      color: var(--npc-text);
      border-radius: 2px;
    }

    &__settings-textarea {
      font-size: 0.85rem;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--npc-border);
      background: var(--npc-bg);
      color: var(--npc-text);
      border-radius: 2px;
      resize: vertical;
      min-height: 3.5rem;
    }

    &__trait-preview {
      grid-column: 1 / -1;
      font-size: 0.85rem;
      color: #444;
      padding: 0.2rem 0;
      white-space: pre-wrap;
    }

    &__narrative-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    &__narrative-card {
      display: flex;
      flex-direction: column;
      border: 2px solid var(--npc-border);
      border-radius: 4px;
      padding: 0.75rem;
      background-color: var(--npc-bg);
    }

    &__textarea {
      font-size: 0.9rem;
      padding: 0.5rem;
      border: 1px solid var(--npc-border);
      background: var(--npc-bg);
      color: var(--npc-text);
      border-radius: 2px;
      resize: vertical;
      min-height: 6rem;
      margin-top: 0.5rem;
      font-family: inherit;
    }
  }
</style>
