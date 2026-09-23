<script lang="ts">
  import {
    drop_category,
    drop_content,
    drop_data,
    drop_name,
    init,
    sheet_skill_toggles,
    skill_query,
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
    skill_query,
    drop_category,
    drop_name,
    drop_data,
    drop_content,
    worst_save,
  ];
</script>

<div class="pc-sheet">
  <div class="pc-sheet__state">
    {#each state as field (field.name)}
      <Attribute {field} />
    {/each}
  </div>

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
    align-content: start;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
</style>
