<script lang="ts">
  import {
    shipCrew,
    ship_crew,
    ship_crew_name,
    ship_crew_rank,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
</script>

<!-- #58 section 7, Crew. -->
<Panel title="Officers & Crew">
  <Attribute field={ship_crew} />
  <RepeatingSection
    section={shipCrew}
    fields={[ship_crew_name, ship_crew_rank]}
    columns="1fr 1fr"
  />
</Panel>
