<script lang="ts">
  import type { CheckboxAttribute } from "#game/fields/_factories.js";

  export let field: CheckboxAttribute;
  export let isLabelHidden = false;
  const {
    label,
    i18nLabel,
    name,
    checkedValue,
    checked: isChecked,
  } = field;

  const wrapperClass = {
    "attribute": true,
    "attribute--checkbox": true,
  };

  const labelClass = {
    "attribute__label": true,
    "attribute__label--checkbox": true,
  };

  const inputClass = {
    "attribute__input": true,
    "attribute__input--checkbox": true,
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
    type="checkbox"
    name="attr_{name}"
    value={checkedValue}
    checked={isChecked}
    />
</div>

<style lang="scss">
.attribute--checkbox {
  // No text to sit on a baseline, so this one centres.
  align-items: center;

  .attribute__input[type="checkbox"] {
    position: relative;
    flex: none;

    transition: background 120ms ease-in-out;

    border: var(--ms-border-width) solid var(--ms-border);
    border-radius: var(--ms-radius-pill);
    width: 4rem;
    height: 2rem;
    padding: 0;

    background: var(--ms-surface);
    cursor: pointer;

    appearance: none;

    // The knob. Sized off the track so the two stay in proportion.
    &::after {
      content: "";

      position: absolute;
      top: 50%;
      left: 0.125rem;

      transform: translateY(-50%);

      transition: left 120ms ease-in-out, right 120ms ease-in-out;

      border-radius: var(--ms-radius-pill);
      width: 1.25rem;
      height: 1.25rem;

      background: var(--ms-border);
    }

    &:checked {
      background: var(--ms-accent);
    }

    &:checked::after {
      right: 0.125rem;
      left: unset;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .attribute--checkbox .attribute__input[type="checkbox"],
  .attribute--checkbox .attribute__input[type="checkbox"]::after {
    transition: none;
  }
}
</style>
