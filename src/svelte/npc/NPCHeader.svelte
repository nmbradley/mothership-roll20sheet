<script lang="ts">
  import { character_name } from "#game/fields/npcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Frame from "#svelte/components/Frame.svelte";
</script>

<header class="npc-header">
  <Frame mode="dark" corner="medium">
    <div class="npc-header__content">
      <span class="npc-header__badge" data-i18n="NPC / CONTRACTOR">NPC / CONTRACTOR</span>
      <Attribute field={character_name} isLabelHidden />
    </div>
  </Frame>
</header>

<style lang="scss">
  .npc-header {
    width: 100%;

    &__content {
      display: flex;
      flex-direction: column;
      gap: var(--ms-space-sm);
    }

    &__badge {
      font-size: var(--ms-text-sm);
      font-family: var(--ms-font-header);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--ms-accent);
    }

    :global(.attribute__input--text) {
      border: none;
      border-bottom: 2px solid transparent;
      outline: none;
      width: 100%;

      background: transparent;

      font-size: var(--ms-text-xl);
      font-family: var(--ms-font-header);
      font-weight: bold;
      text-transform: uppercase;
      color: var(--ms-fg-inverse);

      &:focus {
        border-bottom-color: var(--ms-accent);
      }
    }
  }
</style>
