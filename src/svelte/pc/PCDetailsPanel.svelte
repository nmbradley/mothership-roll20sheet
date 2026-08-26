<script lang="ts">
  import {
    character_name, class_, high_score, pronouns, patch, trinket,
  } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";

  /** Stacked beside the portrait, in the order the printed sheet uses. */
  const details = [character_name, pronouns, class_, patch, trinket, high_score];
</script>

<Panel title="Personal Details" mode="dark" corner="large">
  <div class="pc-details">
    <div class="pc-details__fields">
      {#each details as detail (detail.name)}
        <Attribute field={detail} />
      {/each}
    </div>
  </div>
</Panel>

<style lang="scss">
.pc-details {
  gap: var(--ms-space-lg);

  &__fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--ms-space-md);

    .attribute {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ms-space-sm);
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
  }

  &__score {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--ms-space-sm);
    align-items: stretch;

    input,
    button {
      display: inline-block;
      align-self: end;

      border-radius: var(--ms-radius-md);
    }
  }
}
</style>
