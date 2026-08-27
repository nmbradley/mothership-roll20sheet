<script lang="ts">
  import type { EntryOf } from "#game/enums.js";
  import type { NumberAttribute } from "#game/fields/_factories.js";

  export const NumberInputVariants = {
    Default: "default",
    Round: "round",
  } as const;
  type NumberInputVariant = EntryOf<typeof NumberInputVariants>;

  export let field: NumberAttribute;
  export let isLabelHidden = false;
  export let variant: NumberInputVariant = NumberInputVariants.Default;
  const {
    label,
    i18nLabel,
    name,
    value,
    placeholder,
  } = field;

  const wrapperClass = {
    "attribute": true,
    "attribute--number": true,
    [`attribute--${variant}`]: true,
    [`attribute--${name}`]: true,
  };

  const labelClass = {
    "attribute__label": true,
    "attribute__label--number-input": true,
    [`attribute__label--number-input--${variant}`]: true,
  };

  const inputClass = {
    "attribute__input": true,
    "attribute__input--number": true,
    [`attribute__input--number--${variant}`]: true,
  };
</script>

<div class={wrapperClass}>
  {#if label && !isLabelHidden}
    <label
      class={labelClass}
      for="attr_{name}"
      data-i18n={i18nLabel}
    >{ label }</label>
  {/if}
  <input
    class={inputClass}
    type="number"
    name="attr_{name}"
    {value}
    {placeholder}
    />
</div>

<style lang="scss">
.attribute {
  &--number {
    grid-template-columns: 1fr;
    gap: var(--ms-space-sm);
  }

  // The circular wells on the stats and saves blocks: value above, name below.
  &--round {
    .attribute__input[type="number"] {
      @extend %ms-well-round;
      flex: none;
      order: 1;

      padding: 0;

      font-size: var(--ms-text-xl);
      font-weight: 700;
      aspect-ratio: 1;

      // A ring centres its value, so the width _base.scss holds for the
      // spinners would push the number off-centre. Here they go entirely.
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        appearance: none;
      }
    }

    label {
      order: 2;

      font-size: var(--ms-text-lg);
      text-align: center;
    }
  }
}
</style>
