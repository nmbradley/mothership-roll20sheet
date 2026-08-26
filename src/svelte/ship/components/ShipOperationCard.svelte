<script lang="ts">
  import Button from "#svelte/components/Button.svelte";

  export let action: string;
  export let label: string;
</script>

<div class="ship-operation-card">
  <div class="ship-operation-card__header">
    <Button {action} {label} />
  </div>
  <p class="ship-operation-card__desc">
    <slot />
  </p>
</div>

<style lang="scss">
.ship-operation-card {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-md);

  border: var(--ms-border-width) solid var(--ms-border);
  border-radius: var(--ms-radius-md);
  padding: var(--ms-space-lg);

  background: var(--ms-surface);

  &__header {
    display: flex;
    align-items: center;
  }

  &__desc {
    margin: 0;

    font-size: var(--ms-text-sm);
    line-height: 1.4;
    color: var(--ms-fg);
  }
}
</style>
