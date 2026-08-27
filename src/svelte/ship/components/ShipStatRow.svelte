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
// The printed sheet sets the stat name tight against its value rather than
// stretching a full-width input beside it, so this hugs its content instead
// of stretching across the row -- ShipStatsPanel lines several up side by
// side in the space that used to hold one.
.ship-stat-row {
  display: inline-flex;
  gap: var(--ms-space-sm);
  align-items: center;

  .attribute__input--number {
    width: 3.5rem;

    text-align: center;
  }
}
</style>
