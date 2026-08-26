<script lang="ts">
  import type { CheckboxAttribute } from "#game/fields/_factories.js";

  /** The row's `*_settings` checkbox; its checked state opens the drawer. */
  export let field: CheckboxAttribute;
</script>

<!--
  The drawer is shown and hidden in CSS rather than script, since a sheet cannot
  run JS outside its sheetworkers. The checkbox has to stay inside the label so
  that clicking the cog toggles it -- a `for` attribute would need an id, and
  ids repeat across the rows Roll20 generates, so every cog would drive the
  first row's checkbox. That leaves the label, not the checkbox, as the drawer's
  sibling, which is what the rule below keys on.
-->
<label class="settings__cog">
  <input
    class="settings__toggle"
    type="checkbox"
    name="attr_{field.name}"
    value={field.checkedValue}
    checked={field.checked}
  />
  <span class="settings__icon">y</span>
</label>

<div class="settings__drawer">
  <slot />
</div>

<style lang="scss">
.settings {
  &__cog {
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0;

    cursor: pointer;
  }

  &__icon {
    font-size: var(--ms-text-sm);
    font-family: "Pictos";
    color: var(--ms-fg-muted);

    &:hover {
      color: var(--ms-accent);
    }
  }

  // Written out rather than nested with `&`: inside the sheet-wide root
  // selector, `&` expands to the whole ancestor chain, so `&__cog &__toggle`
  // repeats the root mid-selector and matches nothing.
  &__cog .settings__toggle[type="checkbox"] {
    display: none;
  }

  &__drawer {
    display: flex;
    flex-direction: column;
    grid-column: 1 / -1;
    gap: var(--ms-space-md);

    margin-top: var(--ms-space-sm);
    border-radius: var(--ms-radius-md);
    padding: var(--ms-space-lg);

    background: var(--ms-sunken);
  }
}

// The checkbox is nested inside the label, so it is not the drawer's sibling
// and `.settings__toggle ~ .settings__drawer` never matched -- which is why the
// drawer sat open on every row. `:has()` lets the label carry the checkbox's
// state out to where the sibling combinator can use it.
//
// Where `:has()` is unsupported the rule is dropped and the drawer stays open,
// which is the behaviour this replaces rather than a regression.
.settings__cog:has(.settings__toggle:not(:checked)) ~ .settings__drawer {
  display: none;
}
</style>
