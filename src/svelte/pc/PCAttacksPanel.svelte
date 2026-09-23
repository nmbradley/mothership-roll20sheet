<script lang="ts">
  import {
    attack_ammunition,
    attack_anti_armor,
    attack_bonus,
    attack_crit_damage,
    attack_crit_effect,
    attack_damage,
    attack_name,
    attack_notes,
    attack_range,
    attack_settings,
    attack_shots,
    attack_shots_mirror,
    attack_shots_max_mirror,
    attack_type,
    pcAttacks,
  } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
  import SettingsDrawer from "#svelte/components/SettingsDrawer.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";

  /** Bonus, Crit Damage, Shots and Ammo read as one row of four equal columns. */
  const stats = [attack_bonus, attack_crit_damage, attack_shots, attack_ammunition];

  /** Ten always-rendered boxes; CSS shows as many as the row's max, filled to its current. */
  const pips = Array.from({ length: 10 }, (unused, index) => index);
</script>

<Panel title="Weapons" corner="large">
  <RepeatingSection
    section={pcAttacks}
    fields={[attack_name, attack_type, attack_damage]}
    columns="2fr 1fr 1fr auto"
    trailing={1}>
    <div class="pc-attack-name">
      <ButtonAction action="attack" label="" />
      <Attribute field={attack_name} isLabelHidden />
    </div>

    <Attribute field={attack_type} isLabelHidden />
    <Attribute field={attack_damage} isLabelHidden />

    <SettingsDrawer field={attack_settings}>
      <SettingsRow field={attack_range}>
        <Attribute field={attack_range} isLabelHidden />
      </SettingsRow>

      <SettingsRow field={attack_crit_effect} isFullWidth>
        <Attribute field={attack_crit_effect} isLabelHidden />
      </SettingsRow>

      <Attribute field={attack_anti_armor} />
      <Attribute field={attack_shots_mirror} />
      <Attribute field={attack_shots_max_mirror} />

      <div class="pc-attack-stats">
        {#each stats as field (field.name)}
          <SettingsRow {field}>
            <Attribute {field} isLabelHidden />
          </SettingsRow>
        {/each}
      </div>

      <SettingsRow field={attack_notes} isFullWidth>
        <Attribute field={attack_notes} isLabelHidden />
      </SettingsRow>
    </SettingsDrawer>

    <div class="pc-attack-ammo">
      <div class="pc-attack-ammo__pips">
        {#each pips as pip (pip)}
          <span class="pc-attack-ammo__pip"></span>
        {/each}
      </div>
      <span class="pc-attack-ammo__numeral">
        <span name="attr_attack_shots"></span>
        <span class="pc-attack-ammo__numeral-sep">/</span>
        <span name="attr_attack_shots_max"></span>
      </span>
    </div>
  </RepeatingSection>
</Panel>

<style lang="scss">
.pc-attack-name {
  display: flex;
  gap: var(--ms-space-sm);
  align-items: center;

  .attribute {
    flex: 1;

    min-width: 0;
  }

  .button--action {
    flex: 0 0 auto;
    justify-content: center;

    border-radius: var(--ms-radius-pill);
    width: 28px;
    height: 28px;
    padding: 0;

    background: var(--ms-inverse);

    color: var(--ms-fg-inverse);

    &::before {
      content: "k";

      font-size: var(--ms-text-md);
      line-height: 1;
      font-family: "dicefontd10";
    }

    &:hover {
      background: var(--ms-accent);

      color: var(--ms-fg-inverse);
    }
  }
}

.pc-attack-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column: 1 / -1;
  gap: var(--ms-space-md);
}

.pc-attack-ammo {
  display: flex;
  grid-column: 1 / -1;
  gap: var(--ms-space-sm);
  align-items: center;

  &__pips {
    display: none;
    gap: var(--ms-space-sm);
  }

  &__pip {
    border: var(--ms-border-width) solid var(--ms-border);
    border-radius: var(--ms-radius-sm);
    width: 14px;
    height: 14px;

    background: none;
  }

  &__numeral {
    display: flex;
    gap: var(--ms-space-sm);

    font-size: var(--ms-text-sm);
    font-weight: 700;
  }
}

.repeating:has(.pc-attack-name) .repeating__heading {
  padding-left: calc(var(--ms-border-width) + var(--ms-space-md));
}

@for $max from 1 through 10 {
  .repeating__row:has(input[name="attr_attack_shots_max"][value="#{$max}"]) {
    .pc-attack-ammo__pips {
      display: flex;
    }

    .pc-attack-ammo__numeral {
      display: none;
    }

    .pc-attack-ammo__pip:nth-child(n + #{$max + 1}) {
      display: none;
    }
  }
}

@for $current from 1 through 10 {
  .repeating__row:has(input[name="attr_attack_shots"][value="#{$current}"])
    .pc-attack-ammo__pip:nth-child(-n + #{$current}) {
    background: var(--ms-fg);
  }
}
</style>
