<script lang="ts">
  import ButtonAction from "./ButtonAction.svelte";
  import ButtonRoll from "./ButtonRoll.svelte";

  export let type: "action" | "roll" = "action";
  export let action: string;
  export let label: string = "";
  export let value: string = "";
</script>

{#if type === "roll"}
  <ButtonRoll {action} {label} {value} {...$$restProps}>
    <slot />
  </ButtonRoll>
{:else}
  <ButtonAction {action} {label} {...$$restProps}>
    <slot />
  </ButtonAction>
{/if}

<style lang="scss">
.button {
  @extend %ms-btn-reset;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: var(--ms-border-width) solid var(--ms-border);
  border-radius: var(--ms-radius-sm);
  padding: var(--ms-space-sm) var(--ms-space-md);

  background: var(--ms-surface);
  cursor: pointer;

  color: var(--ms-fg);

  &:hover {
    background: var(--ms-sunken);
  }

  &__label {
    color: inherit;
  }
}
</style>
