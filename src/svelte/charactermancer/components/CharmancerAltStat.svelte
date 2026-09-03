<script lang="ts">
  import { titleCase } from "#game/text.js";

  /** Health, stress and resolve are derived, so they are not Stat values. */
  export let name: string;

  // The key is the display text, so both are read from one expression.
  $: title = titleCase(name);
</script>

<div class="ms-cm-altstat ms-cm-altstat--{name}">
  <div class="ms-cm-altstat__title" data-i18n={title}>{title}</div>
  <div class="ms-cm-altstat__value t__{name}">
    <slot />
  </div>
</div>

<style lang="scss">
.ms-cm-altstat {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-sm);
  align-items: center;

  &__title {
    @extend %ms-caption;

    color: var(--ms-fg);
  }

  &__value {
    @extend %ms-well-round;

    font-size: var(--ms-text-lg);
    font-weight: 700;
  }
}
</style>
