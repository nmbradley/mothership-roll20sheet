<script lang="ts">
  import { i18nKey } from "#game/fields/_factories.js";
  import { instinct } from "#game/fields/npcFields.js";
  import {
    armor_points, combat, health, wounds,
  } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import Panel from "#svelte/components/Panel.svelte";

  const stats = [
    {
      short: "C",
      field: combat,
      desc: "This works exactly like the Combat Stat, showing how good they are in a fight.",
      placeholder: "20",
    },
    {
      short: "I",
      field: instinct,
      desc: "This is a catchall Stat for Fear, Sanity, Body, Speed, Intellect, and everything else.",
      placeholder: "25",
    },
  ];
</script>

<section class="npc-stats-panel">
  <Panel title="Stats & Vitals">
    <div class="npc-checks-grid">
      {#each stats as stat (stat.field.name)}
        {@const title = `${stat.field.label} (${stat.short})`}
        <div class="npc-stat-card">
          <div class="npc-stat-card__header">
            <ButtonAction action="check-{stat.field.name}">
              <span
                class="npc-stat-card__label"
                data-i18n={i18nKey(title)}>{title}</span>
            </ButtonAction>
            <span class="npc-stat-card__tooltip">{stat.desc}</span>
          </div>
          <Attribute field={stat.field} isLabelHidden />
        </div>
      {/each}
    </div>

    <div class="npc-vitals-grid">
      <div class="npc-stat-card">
        <div class="npc-stat-card__label" data-i18n="Wounds (W)">Wounds (W)</div>
        <Attribute field={wounds} isLabelHidden />
        <div class="npc-stat-card__sublabels">
          <span data-i18n="Current">Current</span>
          <span data-i18n="Max">Max</span>
        </div>
      </div>

      <div class="npc-stat-card">
        <div class="npc-stat-card__label" data-i18n="Health (HP)">Health (HP)</div>
        <Attribute field={health} isLabelHidden />
        <div class="npc-stat-card__sublabels">
          <span data-i18n="Current">Current</span>
          <span data-i18n="Per Wound">Per Wound</span>
        </div>
      </div>

      <div class="npc-stat-card">
        <div class="npc-stat-card__label" data-i18n="Armor Points (AP)">Armor Points (AP)</div>
        <Attribute field={armor_points} isLabelHidden />
      </div>
    </div>

    <div class="npc-stats-actions">
      <ButtonAction action="npc-initiative" label="Initiative" />
    </div>
  </Panel>
</section>

<style lang="scss">
  .npc-stats-panel {
    width: 100%;
  }

  .npc-checks-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--ms-space-lg);

    margin-top: var(--ms-space-lg);
  }

  .npc-vitals-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--ms-space-lg);
    align-items: start;

    margin-top: var(--ms-space-lg);
  }

  .npc-stat-card {
    display: flex;
    flex-direction: column;
    gap: var(--ms-space-sm);

    border: 2px solid var(--ms-border);
    border-radius: var(--ms-radius-sm);
    padding: var(--ms-space-md);

    background-color: var(--ms-sunken);

    &__header {
      display: flex;
      position: relative;
      justify-content: center;

      &:hover .npc-stat-card__tooltip {
        display: block;
      }
    }

    &__label {
      display: flex;
      align-items: center;
      justify-content: center;

      min-height: 1.75rem;

      font-size: var(--ms-text-sm);
      font-family: var(--ms-font-header);
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      color: var(--ms-fg);
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

    &__sublabels {
      display: flex;
      justify-content: space-between;

      margin-top: 0.15rem;

      font-size: var(--ms-text-xs);
      font-family: var(--ms-font-header);
      text-transform: uppercase;
      color: var(--ms-fg-muted);
    }

    .button {
      border: none;
      padding: 0;

      background: transparent;

      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      text-transform: inherit;
      color: inherit;

      &:hover {
        background: transparent;

        color: var(--ms-accent);
      }
    }

    .attribute--number .attribute__input,
    .attribute__minmax-wrapper .attribute__input {
      border-radius: var(--ms-radius-pill);
      padding: var(--ms-space-md) 0;

      font-size: var(--ms-text-lg);
      font-weight: 700;
      text-align: center;
    }
  }

  .npc-stats-actions {
    display: none;
    justify-content: center;

    margin-top: var(--ms-space-lg);

    .button {
      border-radius: var(--ms-radius-pill);
      padding: var(--ms-space-md) var(--ms-space-lg);
    }
  }

  .npc-sheet:has(input[name="attr_speed_initiative"]:checked) .npc-stats-actions {
    display: flex;
  }
</style>
