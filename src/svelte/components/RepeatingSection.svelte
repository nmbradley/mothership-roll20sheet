<script lang="ts">
  import type { Attribute as AttributeType, Section } from "#game/fields/_factories.js";
  import Attribute from "#svelte/components/Attribute.svelte";

  export let section: Section;
  /** Drives the heading row, and the inputs too unless a row slot is given. */
  export let fields: readonly AttributeType[];
  /** grid-template-columns, shared by the heading row and every data row. */
  export let columns: string;
  /** Extra trailing heading cells, e.g. the settings cog column. */
  export let trailing: number = 0;
  /** Off for a single-field section, where the one heading only repeats the label. */
  export let hasHeadings: boolean = true;

  $: grid = `grid-template-columns: ${columns}`;
  $: spacers = Array.from({ length: trailing }, (unused, index) => index);
</script>

<div class="repeating">
  {#if hasHeadings}
    <div class="repeating__head" style={grid}>
      {#each fields as field (field.name)}
        <span class="repeating__heading" data-i18n={field.i18nLabel}>{field.label}</span>
      {/each}
      {#each spacers as spacer (spacer)}
        <span class="repeating__heading repeating__heading--spacer"></span>
      {/each}
    </div>
  {/if}

  <fieldset class={section.name}>
    <div class="repeating__row" style={grid}>
      {#if $$slots.default}
        <slot></slot>
      {:else}
        {#each fields as field (field.name)}
          <Attribute {field} isLabelHidden />
        {/each}
      {/if}
    </div>
  </fieldset>
</div>

<style lang="scss">
.repeating {
  &__head {
    display: grid;
    gap: var(--ms-space-md);

    margin-bottom: var(--ms-space-md);
    border-bottom: var(--ms-border-width) solid var(--ms-border);
    padding-bottom: var(--ms-space-md);
  }

  &__heading {
    @extend %ms-caption;

    text-align: left;
    color: var(--ms-fg);
  }

  &__row {
    display: grid;
    gap: var(--ms-space-md);
    align-items: center;

    margin-bottom: var(--ms-space-sm);
    border-bottom: var(--ms-border-width) solid var(--ms-rule);
    padding-bottom: var(--ms-space-sm);

    .attribute {
      grid-template-columns: 1fr;
    }

    .button--action {
      justify-content: flex-start;

      border: none;
      padding-left: 0;

      background: none;

      &:hover {
        background: none;

        color: var(--ms-accent);
      }
    }
  }

  .repcontainer {
    display: grid;
    gap: var(--ms-space-sm);
  }

  .repcontrol {
    display: flex;
    gap: var(--ms-space-md);
    justify-content: flex-end;

    min-height: 2.5em;

    background-color: transparent;

    button {
      margin: 0;
      box-shadow: none;
      border: 0;
      padding: 0;

      background: none;
      cursor: pointer;

      font-size: 0;
      line-height: 1;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;

        border: var(--ms-border-width) solid var(--ms-border);
        border-radius: var(--ms-radius-pill);
        width: 1.9em;
        height: 1.9em;

        background: var(--ms-inverse);

        font-size: var(--ms-text-md);
        line-height: 1;
        font-family: "Pictos";
        font-weight: 700;
        color: var(--ms-fg-inverse);
      }

      &:hover::before {
        border-color: var(--ms-accent);

        color: var(--ms-accent);
      }
    }

    .repcontrol_add::before {
      content: "&";
    }

    .repcontrol_edit::before {
      content: "p";
    }
  }

  .itemcontrol {
    .repcontrol_del,
    .repcontrol_move {
      margin: 0;
      box-shadow: none;
      border: var(--ms-border-width) solid var(--ms-border);
      border-radius: var(--ms-radius-pill);
      width: 28px;
      height: 28px;
      padding: 0;

      font-size: var(--ms-text-sm);
      line-height: 24px;
      font-weight: 700;
      text-align: center;
    }

    .repcontrol_del {
      background: var(--ms-accent);

      font-size: 0;
      color: var(--ms-fg-inverse);

      &::before {
        content: "#";

        font-size: var(--ms-text-sm);
        font-family: "Pictos";
      }
    }

    .repcontrol_move {
      background: var(--ms-inverse);

      color: var(--ms-fg-inverse);
    }
  }
}
</style>
