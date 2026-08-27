<script lang="ts">
  import { description, gear_notes } from "#game/fields/npcFields";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
</script>

<section class="npc-narrative-grid">
  <div class="npc-narrative-card">
    <Panel title="Description">
      <div class="npc-narrative-field">
        <Attribute field={description} isLabelHidden />
      </div>
    </Panel>
  </div>

  <div class="npc-narrative-card">
    <Panel title="Equipment & Notes">
      <div class="npc-narrative-field">
        <Attribute field={gear_notes} isLabelHidden />
      </div>
    </Panel>
  </div>
</section>

<style lang="scss">
  .npc-narrative-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--ms-space-xl);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .npc-narrative-card {
    display: flex;
    flex-direction: column;
  }

  .npc-narrative-field {
    margin-top: var(--ms-space-md);

    :global(.attribute) {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    :global(.attribute__input--textarea) {
      border: 1px solid var(--ms-border);
      border-radius: var(--ms-radius-sm);
      min-height: 6rem;
      padding: var(--ms-space-md);

      background: var(--ms-surface);

      font-size: var(--ms-text-md);
      font-family: inherit;
      color: var(--ms-fg);
      resize: vertical;
    }
  }
</style>
