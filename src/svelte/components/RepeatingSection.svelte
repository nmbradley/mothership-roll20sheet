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

  // The fieldset class is read from the section rather than written by hand:
  // a stale literal here silently points rows at another section's storage.
  $: grid = `grid-template-columns: ${columns}`;
  $: spacers = Array.from({ length: trailing }, (unused, index) => index);
</script>

<div class="repeating">
  <div class="repeating__head" style={grid}>
    {#each fields as field (field.name)}
      <span class="repeating__heading" data-i18n={field.i18nLabel}>{field.label}</span>
    {/each}
    {#each spacers as spacer (spacer)}
      <span class="repeating__heading repeating__heading--spacer"></span>
    {/each}
  </div>

  <fieldset class={section.name}>
    <div class="repeating__row" style={grid}>
      {#if $$slots.default}
        <slot />
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

    // Rows hold bare controls, so the wrapper grid each one brings collapses to
    // a single column here rather than reserving a label gutter.
    .attribute {
      grid-template-columns: 1fr;
    }

    // The printed sheet writes entries onto a rule rather than boxing them.
    // These stay buttons so the sheetworker still rolls them.
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

  // --- Roll20's own markup -------------------------------------------------
  //
  // Roll20 builds the row container and the add / modify / delete controls
  // itself and ships them with Bootstrap chrome. The official Mothership sheet
  // restyles them rather than living with it; this is the same treatment in
  // this sheet's tokens. The row template Roll20 hides inline is untouched.

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

    // The label is dropped to nothing and replaced by the glyph below, so the
    // controls read as icons rather than grey buttons.
    button {
      margin: 0;
      box-shadow: none;
      border: 0;
      padding: 0;

      background: none;
      cursor: pointer;

      font-size: 0;
      line-height: 1;

      // Sized as a whole box rather than glyph-plus-padding: the sheet is
      // border-box, so 1em with 0.35em of padding leaves the glyph nowhere to
      // sit and it spills out of the ring.
      &::before {
        display: flex;
        align-items: center;
        justify-content: center;

        border: var(--ms-border-width) solid var(--ms-border);
        border-radius: var(--ms-radius-pill);
        width: 1.9em;
        height: 1.9em;

        background: none;

        font-size: var(--ms-text-md);
        line-height: 1;
        font-family: "Pictos";
        font-weight: 700;
        color: var(--ms-fg);
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

  // Delete and reorder. Roll20 reveals these only in modify mode, so no display
  // is declared here -- doing so pins them open on every row.
  .itemcontrol {
    // No display declared, and the glyph is centred with line-height instead:
    // any display value here would override Roll20 hiding these between edits.
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

      color: var(--ms-fg-inverse);
    }

    .repcontrol_move {
      background: var(--ms-surface);

      color: var(--ms-fg);
    }
  }
}
</style>
