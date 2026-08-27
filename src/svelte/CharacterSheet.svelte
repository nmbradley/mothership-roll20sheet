<script lang="ts">
  import {
    drop_category,
    drop_content,
    drop_data,
    drop_name,
    init,
    sheet_skill_toggles,
    speed_initiative,
    worst_save,
  } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";

  import PCAttacksPanel from "./pc/PCAttacksPanel.svelte";
  import PCDetailsPanel from "./pc/PCDetailsPanel.svelte";
  import PCEquipmentPanel from "./pc/PCEquipmentPanel.svelte";
  import PCHeader from "./pc/PCHeader.svelte";
  import PCSkillsPanel from "./pc/PCSkillsPanel.svelte";
  import PCStatsPanel from "./pc/PCStatsPanel.svelte";
  import PCStatusPanel from "./pc/PCStatusPanel.svelte";

  /** Hidden attributes the sheetworkers read; none of them render. */
  const state = [
    init,
    sheet_skill_toggles,
    drop_category,
    drop_name,
    drop_data,
    drop_content,
    worst_save,
  ];
</script>

<!--
  Laid out as the printed profile is: a narrow left column running masthead,
  personal details, stats, saves and status report, against a wider right column
  of the three lists. The two columns are independent, so the left one's fixed
  blocks never stretch to match the lists beside them.
-->
<div class="pc-sheet">
  <!--
    Boxed together and taken out of the layout. Loose in a grid these each claim
    a cell, which pushed the two columns into the wrong ones; Roll20 still reads
    and writes them while they are hidden.
  -->
  <div class="pc-sheet__state">
    {#each state as field (field.name)}
      <Attribute {field} />
    {/each}
  </div>

  <!--
    speed_initiative's own control lives on the settings page, outside
    .pc-sheet. This mirrors it here, hidden, so PCStatsPanel's
    :has(input[name="attr_speed_initiative"]:checked) still finds a copy
    inside .pc-sheet to query -- Roll20 keeps every same-named input in step.
  -->
  <div class="pc-sheet__state">
    <Attribute field={speed_initiative} isLabelHidden />
  </div>

  <div class="pc-sheet__column pc-sheet__column--left">
    <PCHeader />
    <PCDetailsPanel />
    <PCStatsPanel />
    <PCStatusPanel />
  </div>

  <div class="pc-sheet__column pc-sheet__column--right">
    <PCSkillsPanel />
    <PCEquipmentPanel />
    <PCAttacksPanel />
  </div>
</div>

<style lang="scss">
.pc-sheet {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: var(--ms-space-lg);

  box-sizing: border-box;

  background-color: var(--ms-surface);

  color: var(--ms-fg);

  &__state {
    display: none;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: var(--ms-space-lg);

    // Each column starts at the top rather than stretching to the other's
    // height, which is what keeps the stat rings square.
    align-content: start;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
</style>
