<script lang="ts">
  import type { TextAttribute } from "#game/fields/_factories.js";

  export let field: TextAttribute;
  export let isLabelHidden = false;
  const {
    label,
    i18nLabel,
    name,
    value,
    placeholder,
    i18nPlaceholder,
  } = field;

  const wrapperClass = {
    "attribute": true,
    "attribute--text": true,
    [`attribute--${name}`]: true,
  };

  const labelClass = {
    "attribute__label": true,
    "attribute__label--text": true,
  };

  const inputClass = {
    "attribute__input": true,
    "attribute__input--text": true,
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
    type="text"
    name="attr_{name}"
    {value}
    {placeholder}
    data-i18n-placeholder={i18nPlaceholder}
    spellcheck="false"
    />
</div>
