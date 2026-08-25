<script>
  import NPCHeader from "./npc/NPCHeader.svelte";
  import NPCStatsPanel from "./npc/NPCStatsPanel.svelte";
  import NPCAttacksPanel from "./npc/NPCAttacksPanel.svelte";
  import NPCTraitsPanel from "./npc/NPCTraitsPanel.svelte";
  import NPCNarrativePanel from "./npc/NPCNarrativePanel.svelte";
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
    gap: 1.25rem;
    padding: 1rem;
    background-color: var(--color-bg, #ffffff);
    color: var(--color-text, #000000);
    box-sizing: border-box;

    &__main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
