<script lang="ts">
  import {
    ship_cryopods,
    ship_escape_pods,
    ship_o2,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
</script>

<!-- #58 section 4, Survival. -->
<Panel title="Survival">
  <!-- The printed sheet groups these three compactly in one row rather than
       stacking each as its own full-width input. -->
  <div class="ship-survival-panel__grid">
    <Attribute field={ship_o2} />
    <Attribute field={ship_cryopods} />
    <Attribute field={ship_escape_pods} />
  </div>
</Panel>

<style lang="scss">
.ship-survival-panel__grid {
  display: flex;
  gap: var(--ms-space-lg);

  .attribute {
    flex: 1;
  }
}
</style>
