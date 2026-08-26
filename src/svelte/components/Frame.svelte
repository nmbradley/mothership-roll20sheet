<script lang="ts">
    export let mode = "light"; // "light" | "light-grey" | "mid-grey" | "dark"
    export let corner = "medium"; // "small" | "medium" | "large"
</script>

<div class="frame frame--mode-{mode} frame--corner-{corner}">
    <slot />
</div>

<style lang="scss">
.frame {
  padding: var(--ms-space-lg);

  &--corner-small { border-radius: var(--ms-radius-sm); }
  &--corner-medium { border-radius: var(--ms-radius-md); }
  &--corner-large { border-radius: var(--ms-radius-lg); }

  // The printed profile stacks three panel treatments: outlined white, a pale
  // blue-grey tint carrying no border at all, and solid ink with knocked-out
  // type. Only the outlined one is ruled.
  &--mode-light {
    border: var(--ms-border-width-thick) solid var(--ms-border);

    background: var(--ms-surface);

    color: var(--ms-fg);
  }

  &--mode-light-grey {
    background: var(--ms-raised);

    color: var(--ms-fg);
  }

  &--mode-mid-grey {
    background: var(--ms-sunken);

    color: var(--ms-fg);
  }

  &--mode-dark {
    border: var(--ms-border-width-thick) solid var(--ms-inverse);

    background: var(--ms-inverse);

    color: var(--ms-fg-inverse);
  }
}
</style>
