<script lang="ts">
  import Button from "#svelte/components/Button.svelte";

  export let action: string;
  export let label: string;
</script>

<div class="ship-operation-card">
  <Button {action} {label} />
  <p class="ship-operation-card__desc">
    <slot></slot>
  </p>
</div>

<style lang="scss">
.ship-operation-card {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-sm);

  .button {
    width: 100%;
  }

  &__desc {
    margin: 0;

    font-size: var(--ms-text-xs);
    line-height: 1.4;
    color: var(--ms-fg-muted);
  }
}
</style>
