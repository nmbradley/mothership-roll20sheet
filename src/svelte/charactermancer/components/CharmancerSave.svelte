<script lang="ts">
  import type { Save } from "#game/enums.js";
  import { titleCase } from "#game/text.js";

  export let save: Save;

  // The key is the display text, so both are read from one expression.
  $: title = titleCase(save);
</script>

<div class="ms-cm-mainsave ms-cm-mainsave--{save}">
  <div class="ms-cm-mainsave__title" data-i18n={title}>{title}</div>
  <div class="ms-cm-mainsave__value t__{save}"></div>
  <slot />
</div>

<style lang="scss">
.ms-cm-mainsave {
  display: grid;
  grid-template-columns: 3fr 2fr;

  overflow: hidden;

  border: var(--ms-border-width-thick) solid var(--ms-border);
  border-radius: var(--ms-radius-pill);

  &__title {
    display: grid;
    place-items: center;

    padding: var(--ms-space-sm) var(--ms-space-md);

    background: var(--ms-inverse);

    font-size: var(--ms-text-xs);
    font-family: var(--ms-font-header);
    font-weight: 800;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: var(--ms-fg-inverse);
  }

  &__value {
    display: grid;
    place-items: center;

    padding: var(--ms-space-sm) var(--ms-space-md);

    background: var(--ms-surface);

    font-size: var(--ms-text-lg);
    font-weight: 700;
    color: var(--ms-fg);
  }
}
</style>
