<script lang="ts">
  import {
    character_name, class_, high_score, pronouns, patch, trinket,
  } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
  import Panel from "#svelte/components/Panel.svelte";

  /** Stacked beside the portrait, in the order the printed sheet uses. */
  const details = [character_name, pronouns, class_, high_score, trinket, patch];
</script>

<Panel title="Personal Details" mode="dark" corner="large">
  <div class="pc-details">
    <div class="pc-details__fields">
      {#each details as detail (detail.name)}
        <Attribute field={detail} />
        {#if detail.name === "high_score"}
          <ButtonAction action="increment_score" label="+1" />
        {/if}
      {/each}
    </div>
  </div>
</Panel>

<style lang="scss">
.pc-details {
  gap: var(--ms-space-lg);

  &__fields {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--ms-space-md);

    .attribute {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ms-space-sm);
      align-items: stretch;
    }

    .attribute__label {
      font-size: var(--ms-text-sm);
      font-weight: 700;
      font-stretch: 90%;
    }

    .attribute__input {
      border: none;
      border-radius: var(--ms-radius-md);

      color: var(--ms-inverse);
    }

    .attribute--character_name {
      grid-column: span 4;
    }

    .attribute--pronouns {
      grid-column: span 2;
    }

    .attribute--class {
      grid-column: span 3;
    }

    .attribute--high_score {
      grid-column: span 2;
    }

    .attribute--trinket,
    .attribute--patch {
      grid-column: span 6;
    }

    // Lines up with the High Score input beside it rather than the label
    // above it.
    .button--action {
      grid-column: span 1;
      align-self: end;

      // #125 made every button --ms-inverse background with --ms-fg-inverse
      // text, and this panel is a Frame mode="dark" that already uses
      // --ms-inverse as its own ground -- so the button vanishes into it. The
      // same accent treatment .pc-equipment-armor .button--action and
      // .repcontrol_del already use stays visible against either ground and
      // still flips with body.sheet-darkmode instead of a literal colour.
      border-color: var(--ms-accent);
      border-radius: var(--ms-radius-md);

      background: var(--ms-accent);

      color: var(--ms-fg-inverse);
    }
  }
}
</style>
