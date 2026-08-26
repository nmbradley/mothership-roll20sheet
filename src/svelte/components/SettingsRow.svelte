<script lang="ts">
  import type { Attribute as AttributeType } from "#game/fields/_factories.js";

  /** Labels the row from the field it describes, so the text is never retyped. */
  export let field: AttributeType;
  export let isFullWidth: boolean = false;
</script>

<div class="settings__row" class:settings__row--full={isFullWidth}>
  <span class="settings__label" data-i18n={field.i18nLabel}>{field.label}</span>
  <slot />
</div>

<style lang="scss">
.settings {
  &__row {
    display: flex;
    flex-direction: column;
    gap: var(--ms-space-sm);

    &--full {
      grid-column: 1 / -1;
    }
  }

  &__label {
    font-size: var(--ms-text-sm);
    font-family: var(--ms-font-header);
    font-weight: 700;
    color: var(--ms-fg-muted);
  }
}
</style>
