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
  import DisplayValue from "#svelte/components/DisplayValue.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
  import SettingsDrawer from "#svelte/components/SettingsDrawer.svelte";
  import SettingsRow from "#svelte/components/SettingsRow.svelte";

  const pairs = [
    [attack_range, attack_bonus],
    [attack_crit_damage, attack_crit_effect],
    [attack_shots, attack_ammunition],
  ];

  /** Ten always-rendered boxes; CSS shows as many as the row's max, filled to its current. */
  const pips = Array.from({ length: 10 }, (unused, index) => index);
</script>

<Panel title="Attacks">
  <RepeatingSection
    section={pcAttacks}
    fields={[attack_name, attack_type, attack_damage]}
    columns="2fr 1fr 1fr auto"
    trailing={1}>
    <ButtonAction action="attack" label="">
      <DisplayValue field={attack_name} isLabelHidden />
    </ButtonAction>

    <Attribute field={attack_type} isLabelHidden />
    <Attribute field={attack_damage} isLabelHidden />

    <SettingsDrawer field={attack_settings}>
      <SettingsRow field={attack_name}>
        <Attribute field={attack_name} isLabelHidden />
      </SettingsRow>

      <Attribute field={attack_anti_armor} />
      <Attribute field={attack_shots_mirror} />
      <Attribute field={attack_shots_max_mirror} />

      {#each pairs as pair (pair[0].name)}
        <div class="npc-attack-pair">
          {#each pair as field (field.name)}
            <SettingsRow {field}>
              <Attribute {field} isLabelHidden />
            </SettingsRow>
          {/each}
        </div>
      {/each}

      <SettingsRow field={attack_notes} isFullWidth>
        <Attribute field={attack_notes} isLabelHidden />
      </SettingsRow>
    </SettingsDrawer>

    <div class="npc-attack-ammo">
      <div class="npc-attack-ammo__pips">
        {#each pips as pip (pip)}
          <span class="npc-attack-ammo__pip"></span>
        {/each}
      </div>
      <span class="npc-attack-ammo__numeral">
        <span name="attr_attack_shots"></span>
        <span class="npc-attack-ammo__numeral-sep">/</span>
        <span name="attr_attack_shots_max"></span>
      </span>
    </div>
  </RepeatingSection>
</Panel>

<style lang="scss">
.npc-attack-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column: 1 / -1;
  gap: var(--ms-space-md);
}

.npc-attack-ammo {
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

@for $max from 1 through 10 {
  .repeating__row:has(input[name="attr_attack_shots_max"][value="#{$max}"]) {
    .npc-attack-ammo__pips {
      display: flex;
    }

    .npc-attack-ammo__numeral {
      display: none;
    }

    .npc-attack-ammo__pip:nth-child(n + #{$max + 1}) {
      display: none;
    }
  }
}

@for $current from 1 through 10 {
  .repeating__row:has(input[name="attr_attack_shots"][value="#{$current}"])
    .npc-attack-ammo__pip:nth-child(-n + #{$current}) {
    background: var(--ms-fg);
  }
}
</style>
