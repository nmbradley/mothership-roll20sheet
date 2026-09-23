<script lang="ts">
  import type { Attribute } from "#game/fields/_factories.js";

  import AttributeCheckbox from "./AttributeCheckbox.svelte";
  import AttributeHidden from "./AttributeHidden.svelte";
  import AttributeNumberInput from "./AttributeNumberInput.svelte";
  import AttributeNumberMax from "./AttributeNumberMax.svelte";
  import AttributeSelect from "./AttributeSelect.svelte";
  import AttributeTextInput from "./AttributeTextInput.svelte";
  import AttributeTextarea from "./AttributeTextarea.svelte";

  export let field: Attribute;
  export let isLabelHidden = false;
</script>

{#if field.control === "textarea"}
  <AttributeTextarea {field} {isLabelHidden} {...$$restProps} />
{:else if field.control === "select"}
  <AttributeSelect {field} {isLabelHidden} {...$$restProps} />
{:else if field.control === "checkbox"}
  <AttributeCheckbox {field} {isLabelHidden} {...$$restProps} />
{:else if field.control === "hidden"}
  <AttributeHidden {field} {...$$restProps} />
{:else if field.control === "number"}
  {#if field.max === undefined}
    <AttributeNumberInput {field} {isLabelHidden} {...$$restProps} />
  {:else}
    <AttributeNumberMax {field} {isLabelHidden} {...$$restProps} />
  {/if}
{:else}
  <AttributeTextInput {field} {isLabelHidden} {...$$restProps} />
{/if}

<style lang="scss">
.attribute {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--ms-space-md);
  align-items: baseline;

  &__label {
    font-size: var(--ms-text-sm);
    font-weight: 700;
    color: inherit;
  }
}
</style>
