<script lang="ts">
  import { speed_initiative } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";

  import NPCAttacksPanel from "./npc/NPCAttacksPanel.svelte";
  import NPCHeader from "./npc/NPCHeader.svelte";
  import NPCNarrativePanel from "./npc/NPCNarrativePanel.svelte";
  import NPCStatsPanel from "./npc/NPCStatsPanel.svelte";
  import NPCTraitsPanel from "./npc/NPCTraitsPanel.svelte";
</script>

<div class="npc-sheet">
  <!--
    speed_initiative's own control now lives on the settings page, outside
    .npc-sheet. This mirrors it here, hidden, so NPCStatsPanel's
    :has(input[name="attr_speed_initiative"]:checked) still finds a copy
    inside .npc-sheet to query -- Roll20 keeps every same-named input in step.
  -->
  <div class="npc-sheet__state">
    <Attribute field={speed_initiative} isLabelHidden />
  </div>

  <NPCHeader />
  <NPCStatsPanel />
  <section class="npc-sheet__main-content">
    <NPCAttacksPanel />
    <NPCTraitsPanel />
  </section>
  <NPCNarrativePanel />
</div>

<style lang="scss">
  .npc-sheet {
    display: flex;
    flex-direction: column;
    gap: var(--ms-space-xl);

    box-sizing: border-box;
    padding: var(--ms-space-lg);

    background-color: var(--ms-surface);

    color: var(--ms-fg);

    &__state {
      display: none;
    }

    &__main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--ms-space-xl);

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
