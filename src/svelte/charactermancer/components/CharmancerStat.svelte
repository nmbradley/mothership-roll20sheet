<script lang="ts">
  import type { Stat } from "#game/enums.js";
  import { titleCase } from "#game/text.js";

  export let stat: Stat;

  // The key is the display text, so both are read from one expression.
  $: title = titleCase(stat);
</script>

<div class="ms-cm-mainstat ms-cm-mainstat--{stat}">
  <div class="ms-cm-mainstat__title" data-i18n={title}>{title}</div>
  <div class="ms-cm-mainstat__value t__{stat}"></div>
  <slot />
</div>

<style lang="scss">
.ms-cm-mainstat {
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
