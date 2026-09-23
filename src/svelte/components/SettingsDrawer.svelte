<script lang="ts">
  import type { CheckboxAttribute } from "#game/fields/_factories.js";

  /** The row's `*_settings` checkbox; its checked state opens the drawer. */
  export let field: CheckboxAttribute;
</script>

<label class="settings__cog">
  <input
    class="settings__toggle"
    type="checkbox"
    name="attr_{field.name}"
    value={field.checkedValue}
    checked={field.checked} />
  <span class="settings__icon">y</span>
</label>

<div class="settings__drawer">
  <slot></slot>
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

.settings__cog:has(.settings__toggle:not(:checked)) ~ .settings__drawer {
  display: none;
}
</style>
