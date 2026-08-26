<script lang="ts">
  import type { Attribute as AttributeType } from "#game/fields/_factories.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Button from "#svelte/components/Button.svelte";

  export let field: AttributeType;
  /** Sheetworker action name. Given one, the label becomes a roll button. */
  export let action: string = "";
</script>

<div class="ship-stat-row">
  {#if action}
    <div class="ship-stat-row__btn">
      <Button {action} label={field.label} />
    </div>
    <Attribute {field} isLabelHidden />
  {:else}
    <Attribute {field} />
  {/if}
</div>

<style lang="scss">
.ship-stat-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--ms-space-md);
  align-items: center;

  margin-bottom: var(--ms-space-md);
}
</style>
