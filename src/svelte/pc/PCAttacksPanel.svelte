<script lang="ts">
  import {
    attack_ammunition,
    attack_bonus,
    attack_crit_damage,
    attack_crit_effect,
    attack_damage,
    attack_name,
    attack_notes,
    attack_range,
    attack_settings,
    attack_shots,
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
</script>

<Panel title="Weapons" corner="large">
  <RepeatingSection
    section={pcAttacks}
    fields={[attack_name, attack_type, attack_damage]}
    columns="2fr 1fr 1fr auto"
    trailing={1}
  >
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

  // RepeatingSection strips the row button's chrome, which suited it when the
  // weapon's own name was the button. Now the name is an input and this is a
  // separate roll trigger, so it takes its fill back -- without this it
  // inherits the base button's knocked-out text over no background at all.
  .button--action {
    flex: 0 0 auto;
    justify-content: center;

    border-radius: var(--ms-radius-pill);
    width: 28px;
    height: 28px;
    padding: 0;

    background: var(--ms-inverse);

    color: var(--ms-fg-inverse);

    // #160: a d10 from Roll20's own dicefontd10 icon font (documented under
    // "Icon Fonts" on the CSS Wizardry sheet-author wiki page, alongside
    // Pictos), replacing the "\25CE" placeholder -- attacks roll d100 (two
    // d10s). "k" is one of several die-face characters this font exposes;
    // it is the one Roll20's own sheet authors recommend for reading as a
    // plain d10 outline rather than a specific pip count.
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

// The heading row sits flush with the column edge, but every input beneath it
// is inset by its own border and padding -- so "WEAPON / TYPE / DAMAGE" reads
// left of the fields it labels. `.pc-attack-name` only ever renders here, so
// `:has()` scopes the fix to this section's own heading row rather than every
// RepeatingSection's (repeating_attacks is shared with the NPC sheet, #90).
.repeating:has(.pc-attack-name) .repeating__heading {
  padding-left: calc(var(--ms-border-width) + var(--ms-space-md));
}
</style>
