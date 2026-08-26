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
