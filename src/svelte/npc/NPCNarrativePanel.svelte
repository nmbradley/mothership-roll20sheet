<script>
  import Frame from "../components/Frame.svelte";
  import Header from "../components/Header.svelte";
  import Attribute from "../components/Attribute.svelte";
  import { description, equipment } from "../../game/fields/npcFields";
</script>

<section class="npc-narrative-grid">
  <div class="npc-narrative-card">
    <Frame mode="light" corner="medium">
      <Header title="Description" />
      <div class="npc-narrative-field">
        <Attribute field={description} />
      </div>
    </Frame>
  </div>

  <div class="npc-narrative-card">
    <Frame mode="light" corner="medium">
      <Header title="Equipment & Notes" />
      <div class="npc-narrative-field">
        <Attribute field={equipment} />
      </div>
    </Frame>
  </div>
</section>

<style lang="scss">
  .npc-narrative-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .npc-narrative-card {
    display: flex;
    flex-direction: column;
  }

  .npc-narrative-field {
    margin-top: 0.5rem;

    :global(.attribute) {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    :global(.attribute__label) {
      display: none;
    }

    :global(.attribute__input--textarea) {
      font-size: 0.9rem;
      padding: 0.5rem;
      border: 1px solid var(--color-border, #000000);
      background: var(--color-bg, #ffffff);
      color: var(--color-text, #000000);
      border-radius: 4px;
      resize: vertical;
      min-height: 6rem;
      font-family: inherit;
    }
  }
</style>
