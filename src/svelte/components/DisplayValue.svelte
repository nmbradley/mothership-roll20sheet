<script lang="ts">
  import type { Attribute } from "#game/fields/_factories.js";

  export let field: Attribute;
  export let isLabelHidden = false;
  const {
    label,
    i18nLabel,
    name,
  } = field;

  const wrapperClass = {
    "attribute": true,
    "attribute--display": true,
  };

  const labelClass = {
    "attribute__label": true,
    "attribute__label--display": true,
  };

  const valueClass = {
    "attribute__value": true,
    "attribute__value--display": true,
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
  <span
    class={valueClass}
    name="attr_{name}"
  ></span>
</div>
