<script lang="ts">
  import { i18nKey, type SelectAttribute } from "#game/fields/_factories.js";

  export let field: SelectAttribute;
  export let isLabelHidden = false;
  const {
    label,
    i18nLabel,
    name,
    options,
    value,
  } = field;

  const choices = options.map((option) => (typeof option === "object"
    ? {
        value: option.value,
        text: option.label ?? String(option.value),
      }
    : {
        value: option,
        text: option,
      }));

  const wrapperClass = {
    "attribute": true,
    "attribute--select": true,
  };

  const labelClass = {
    "attribute__label": true,
    "attribute__label--select": true,
  };

  const inputClass = {
    "attribute__input": true,
    "attribute__input--select": true,
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
  <select class={inputClass} name="attr_{name}">
    {#each choices as choice (choice.value)}
      <option
        value={choice.value}
        selected={choice.value === value}
        data-i18n={choice.text === "" ? undefined : i18nKey(choice.text)}
      >{ choice.text }</option>
    {/each}
  </select>
</div>
