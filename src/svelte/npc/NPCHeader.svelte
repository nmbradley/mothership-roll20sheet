<script>
  import Frame from "../components/Frame.svelte";
</script>

<header class="npc-header">
  <Frame mode="dark" corner="medium">
    <div class="npc-header__content">
      <span class="npc-header__badge" data-i18n="npc">NPC / CONTRACTOR</span>
      <input
        class="npc-header__name-input"
        name="attr_character_name"
        type="text"
        placeholder="NPC Name"
        data-i18n-placeholder="NPC Name"
        aria-label="NPC Name"
      />
    </div>
  </Frame>
</header>

<style lang="scss">
  .npc-header {
    width: 100%;

    &__content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    &__badge {
      font-family: var(--font-header, "Montserrat", "Arial Black", sans-serif);
      font-size: 0.8rem;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-accent, #ff3366);
    }

    &__name-input {
      font-family: var(--font-header, "Montserrat", "Arial Black", sans-serif);
      font-size: 1.75rem;
      font-weight: bold;
      text-transform: uppercase;
      border: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--color-frame-dark-text, #ffffff);
      width: 100%;
      outline: none;

      &:focus {
        border-bottom-color: var(--color-accent, #ff3366);
      }
    }
  }
</style>
