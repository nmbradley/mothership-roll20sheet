<script lang="ts">
  import {
    shipCrew,
    ship_crew_name,
    ship_crew_rank,
  } from "#game/fields/shipFields.js";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
</script>

<Panel title="Officers & Crew">
  <RepeatingSection
    section={shipCrew}
    fields={[ship_crew_name, ship_crew_rank]}
    columns="1fr 1fr"
  />
</Panel>
