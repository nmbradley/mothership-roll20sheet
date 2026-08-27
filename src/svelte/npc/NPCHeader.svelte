<script lang="ts">
  import { character_name } from "#game/fields/npcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Frame from "#svelte/components/Frame.svelte";

  const logoUrl = "https://s3.amazonaws.com/files.d20.io/images/145353993"
    + "/itv_F4exdWuwHavdksYfCQ/max.png?1592850121";
</script>

<header class="npc-header">
  <Frame mode="dark" corner="medium">
    <div class="npc-header__content">
      <div class="npc-header__top">
        <!-- Opens Settings; see settings_open in pcFields.ts and Sheet.svelte. -->
        <label for="attr_settings_open" class="npc-header__logo-link">
          <img src={logoUrl} alt="Mothership" class="npc-header__logo" />
        </label>
        <span class="npc-header__badge" data-i18n="NPC / CONTRACTOR">NPC / CONTRACTOR</span>
      </div>
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

    &__top {
      display: flex;
      gap: var(--ms-space-md);
      align-items: center;
    }

    &__logo-link {
      display: inline-flex;

      cursor: pointer;
    }

    // White art on a dark panel needs no inversion -- see PCHeader's
    // light-panel logo, which is the case --ms-logo-filter actually covers.
    &__logo {
      width: auto;
      max-height: 1.5rem;
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
