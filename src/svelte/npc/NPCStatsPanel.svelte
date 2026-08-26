<script lang="ts">
  import { i18nKey } from "#game/fields/_factories.js";
  import {
    npc_combat, npc_instinct, npc_wounds, npc_health, npc_armor_points,
  } from "#game/fields/npcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import Panel from "#svelte/components/Panel.svelte";

  const stats = [
    {
      short: "C",
      field: npc_combat,
      desc: "This works exactly like the Combat Stat, showing how good they are in a fight.",
      placeholder: "20",
    },
    {
      short: "I",
      field: npc_instinct,
      desc: "This is a catchall Stat for Fear, Sanity, Body, Speed, Intellect, and everything else.",
      placeholder: "25",
    },
  ];
</script>

<section class="npc-stats-panel">
  <Panel title="Stats & Vitals">
    <div class="npc-stats-grid">
      <!-- Combat & Instinct Stats (No Speed) -->
      {#each stats as stat (stat.field.name)}
        <!-- The key has to spell out the whole label: the sheet shows "Combat
             (C)", so keying it on "combat" alone would collide with the PC
             sheet's Combat and render one of them under the other's text. -->
        {@const title = `${stat.field.label} (${stat.short})`}
        <div class="npc-stat-card">
          <div class="npc-stat-card__header">
            <!-- An action button: the sheetworker rolls and grades the check. -->
            <ButtonAction action="check-{stat.field.name}">
              <span
                class="npc-stat-card__title"
                data-i18n={i18nKey(title)}
              >{title}</span>
            </ButtonAction>
            <span class="npc-stat-card__tooltip">{stat.desc}</span>
          </div>
          <Attribute field={stat.field} isLabelHidden />
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
            value="&lbrace;&lbrace;template:ms&rbrace;&rbrace; &lbrace;&lbrace;name=Initiative&rbrace;&rbrace; &lbrace;&lbrace;character_name=@&lbrace;character_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;roll=[[1d100-1cs1cf99 &amp;&lbrace;tracker&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;roll2=[[?&lbrace;Advantage/Disadvantage|Normal,0|Advantage/Disadvantage,1d100-1cs1cf99 &amp;&lbrace;tracker&rbrace;&rbrace;]]&rbrace;&rbrace; &lbrace;&lbrace;target=@&lbrace;npc_instinct&rbrace;&rbrace;&rbrace;"
          >
            <span class="npc-stat-card__title" data-i18n="Initiative">Initiative</span>
          </button>
          <span
            class="npc-stat-card__tooltip"
            data-i18n="Rolls Instinct and adds to Turn Tracker (&amp;&lbrace;tracker&rbrace;)"
          >Rolls Instinct and adds to Turn Tracker (&amp;&lbrace;tracker&rbrace;)</span>
        </div>
        <div class="npc-stat-card__initiative-subtext">Instinct + Tracker</div>
      </div>

      <!-- Wounds Tracker (Supports W:1, W:2, etc.) -->
      <div class="npc-vital-card npc-vital-card--wounds">
        <div class="npc-vital-card__label" data-i18n="Wounds (W)">Wounds (W)</div>
        <Attribute field={npc_wounds} isLabelHidden />
        <div class="npc-vital-card__sublabels">
          <span data-i18n="Current">Current</span>
          <span data-i18n="Max">Max</span>
        </div>
      </div>

      <!-- Health per Wound (Supports W:2(20), optional for W:1) -->
      <div class="npc-vital-card npc-vital-card--health">
        <div class="npc-vital-card__label" data-i18n="Health (HP)">Health (HP)</div>
        <Attribute field={npc_health} isLabelHidden />
        <div class="npc-vital-card__sublabels">
          <span data-i18n="Current">Current</span>
          <span data-i18n="Per Wound">Per Wound</span>
        </div>
      </div>

      <!-- Armor Points (AP) Tracker -->
      <div class="npc-vital-card npc-vital-card--ap">
        <div class="npc-vital-card__label" data-i18n="Armor Points (AP)">Armor Points (AP)</div>
        <Attribute field={npc_armor_points} isLabelHidden />
      </div>
    </div>
  </Panel>
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
    position: relative;
    flex-direction: column;
    justify-content: space-between;

    border: 2px solid var(--ms-border);
    border-radius: var(--ms-radius-sm);
    padding: var(--ms-space-md);

    background-color: var(--ms-sunken);
  }

  .npc-stat-card {
    &__header {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-between;

      &:hover .npc-stat-card__tooltip {
        display: block;
      }
    }

    &__roll-btn {
      display: inline-flex;
      gap: var(--ms-space-sm);
      align-items: center;

      border: none;
      padding: 0;

      background: transparent;
      cursor: pointer;

      font-size: var(--ms-text-md);
      font-family: var(--ms-font-header);
      font-weight: bold;
      text-transform: uppercase;
      color: var(--ms-fg);

      &:hover {
        color: var(--ms-accent);
      }

      &--initiative {
        color: var(--ms-fg-inverse);
      }
    }

    // Hidden until Speed Check Initiative (#50) is switched on in the
    // settings panel -- a sheet cannot run JS outside its sheetworkers, so
    // this rereads NPCSettingsPanel's checkbox via :has() rather than script.
    &--initiative {
      display: none;

      border-color: var(--ms-border);

      background-color: var(--ms-inverse);

      color: var(--ms-fg-inverse);

      .npc-stat-card__roll-btn:hover {
        color: var(--ms-accent);
      }
    }

    &__initiative-subtext {
      margin-top: var(--ms-space-sm);

      font-size: var(--ms-text-xs);
      font-family: var(--ms-font-header);
      text-transform: uppercase;
      color: var(--ms-fg-muted);
    }

    &__tooltip {
      display: none;
      position: absolute;
      z-index: 100;
      bottom: 120%;
      left: 50%;

      transform: translateX(-50%);

      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      border-radius: var(--ms-radius-sm);
      width: 180px;
      padding: 0.4rem 0.6rem;

      background-color: var(--ms-inverse);

      font-size: var(--ms-text-sm);
      white-space: normal;
      color: var(--ms-fg-inverse);
      pointer-events: none;
    }

    &__input {
      margin-top: var(--ms-space-sm);
      border: 1px solid var(--ms-border);
      border-radius: 2px;
      box-sizing: border-box;
      width: 100%;
      padding: var(--ms-space-sm);

      background: var(--ms-surface);

      font-size: var(--ms-text-lg);
      font-family: var(--ms-font-header);
      font-weight: bold;
      text-align: center;
      color: var(--ms-fg);

      &--ap {
        font-size: var(--ms-text-lg);
      }
    }
  }

  .npc-vital-card {
    &__label {
      margin-bottom: var(--ms-space-sm);

      font-size: var(--ms-text-sm);
      font-family: var(--ms-font-header);
      font-weight: bold;
      text-transform: uppercase;
      color: var(--ms-fg);
    }

    &__minmax-wrapper {
      display: flex;
      gap: var(--ms-space-sm);
      align-items: center;
    }

    &__input {
      border: 1px solid var(--ms-border);
      border-radius: 2px;
      box-sizing: border-box;
      width: 100%;
      padding: var(--ms-space-sm);

      background: var(--ms-surface);

      font-size: var(--ms-text-lg);
      font-family: var(--ms-font-header);
      font-weight: bold;
      text-align: center;
      color: var(--ms-fg);
    }

    &__separator {
      font-weight: bold;
      color: var(--ms-fg);
    }

    &__sublabels {
      display: flex;
      justify-content: space-between;

      margin-top: 0.15rem;

      font-size: var(--ms-text-xs);
      font-family: var(--ms-font-header);
      text-transform: uppercase;
      color: var(--ms-fg-muted);
    }
  }

  .npc-sheet:has(input[name="attr_speed_initiative"]:checked) .npc-stat-card--initiative {
    display: flex;
  }
</style>
