<script lang="ts">
  import type { TextAttribute } from "#game/fields/_factories.js";

  export let field: TextAttribute;
  const {
    name,
    value,
  } = field;

  const inputClass = {
    "attribute__input": true,
    "attribute__input--hidden": true,
  };
</script>

<input
  class={inputClass}
  type="hidden"
  name="attr_{name}"
  {value}
  />
