<script lang="ts">
  import NPCAttacksPanel from "./npc/NPCAttacksPanel.svelte";
  import NPCHeader from "./npc/NPCHeader.svelte";
  import NPCNarrativePanel from "./npc/NPCNarrativePanel.svelte";
  import NPCStatsPanel from "./npc/NPCStatsPanel.svelte";
  import NPCTraitsPanel from "./npc/NPCTraitsPanel.svelte";
</script>

<div class="npc-sheet">
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
