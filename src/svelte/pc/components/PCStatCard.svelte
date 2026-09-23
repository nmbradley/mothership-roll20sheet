<script lang="ts">
  import type { Attribute as AttributeType } from "#game/fields/_factories.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import ButtonAction from "#svelte/components/ButtonAction.svelte";

  export let field: AttributeType;
</script>

<div class="pc-stat-card">
  <Attribute {field} variant="round" isLabelHidden />
  <ButtonAction action="check-{field.name}" label={field.label} />
</div>

<style lang="scss">
.pc-stat-card {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-sm);
  align-items: center;

  .button {
    @extend %ms-caption;

    border: none;
    padding: 0;

    background: none;

    font-size: var(--ms-text-sm);
    color: var(--ms-fg);
    font-stretch: var(--ms-stretch-stat);

    &:hover {
      background: none;

      color: var(--ms-accent);
    }
  }
}
</style>
