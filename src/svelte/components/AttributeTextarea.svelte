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
    "attribute--textarea": true,
    [`attribute--${name}`]: true,
  };

  const labelClass = {
    "attribute__label": true,
    "attribute__label--textarea": true,
  };

  const inputClass = {
    "attribute__input": true,
    "attribute__input--textarea": true,
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
  <textarea
    class={inputClass}
    name="attr_{name}"
    {placeholder}
    data-i18n-placeholder={i18nPlaceholder}
    spellcheck="false"
  >{value}</textarea>
</div>

<style lang="scss">
// The label stacks above rather than sitting beside, so the field can use the
// full width of whatever holds it.
.attribute--textarea {
  grid-template-columns: minmax(0, 1fr);
}

.attribute__input--textarea {
  min-height: 5rem;
}
</style>
