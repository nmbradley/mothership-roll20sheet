<script lang="ts">
  import type { NumberAttribute } from "#game/fields/_factories.js";

  export let field: NumberAttribute;
  export let isLabelHidden = false;
  const {
    label,
    i18nLabel,
    name,
    value,
    max,
    placeholder,
  } = field;

  const wrapperClass = {
    "attribute": true,
    "attribute--number-max": true,
    [`attribute--${name}`]: true,
  };

  const labelClass = {
    "attribute__label": true,
    "attribute__label--number-max": true,
  };

  const inputClass = {
    "attribute__input": true,
    "attribute__input--number": true,
  };
</script>

<div class={wrapperClass}>
  {#if label && !isLabelHidden}
    <label
      class={labelClass}
      for="attr_{name}"
      data-i18n={i18nLabel}>{label}</label>
  {/if}
  <div class="attribute__minmax-wrapper">
    <input
      class={inputClass}
      type="number"
      name="attr_{name}"
      {value}
      {placeholder} />
    <span class="attribute__separator">/</span>
    <input
      class={inputClass}
      type="number"
      name="attr_{name}_max"
      value={max}
      {placeholder} />
  </div>
</div>

<style lang="scss">
.attribute {
  &__minmax-wrapper {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;

    overflow: hidden;

    border: var(--ms-border-width) solid var(--ms-border);
    border-radius: var(--ms-radius-pill);

    background: var(--ms-surface);

    &:focus-within {
      outline: var(--ms-border-width) solid var(--ms-accent);
      outline-offset: 2px;
    }

    .attribute__input {
      border: none;
      border-radius: 0;
      min-width: 0;
      padding: var(--ms-space-sm) 0;

      background: none;

      text-align: center;

      &:focus-visible {
        outline: none;
      }
    }
  }

  &__separator {
    align-self: stretch;

    transform: skew(-15deg);

    width: var(--ms-border-width);

    background-color: var(--ms-border);

    font-size: 0;
  }
}
</style>
