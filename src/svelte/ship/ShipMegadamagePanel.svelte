<script lang="ts">
  import {
    ship_hull,
    ship_mdmg,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
</script>

<Panel title="MegaDamage & Hull">
  <Attribute field={ship_mdmg} />
  <Attribute field={ship_hull} />
</Panel>
