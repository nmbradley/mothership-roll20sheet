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
  <Attribute field={ship_o2} />
  <Attribute field={ship_cryopods} />
  <Attribute field={ship_escape_pods} />
</Panel>
