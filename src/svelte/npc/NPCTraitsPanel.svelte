<script>
  import Frame from "../components/Frame.svelte";
  import Header from "../components/Header.svelte";
</script>

<div class="npc-traits-panel">
  <Frame mode="light" corner="medium">
    <Header title="Traits" />

    <fieldset class="repeating_traits">
      <div class="npc-trait-row">
        <button
          class="npc-trait-row__roll-btn"
          type="roll"
          name="roll_trait"
          title="Roll Trait"
          aria-label="Roll Trait"
          value="&lbrace;&lbrace;template:ms&rbrace;&rbrace; &lbrace;&lbrace;name=@&lbrace;trait_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;character_name=@&lbrace;character_name&rbrace;&rbrace;&rbrace; &lbrace;&lbrace;notes=@&lbrace;trait_description&rbrace;&rbrace;&rbrace;"
        >
          <span class="npc-trait-row__name-display" name="attr_trait_name"></span>
        </button>

        <label class="npc-trait-row__cog-label">
          <input class="npc-trait-row__settings-toggle" name="attr_trait_settings" type="checkbox" checked />
          <span class="npc-trait-row__cog-icon">y</span>
        </label>

        <div class="npc-trait-row__preview" name="attr_trait_description"></div>

        <div class="npc-trait-row__settings-drawer">
          <div class="npc-trait-row__settings-row">
            <span class="npc-trait-row__settings-label" data-i18n="name">Trait Name</span>
            <input
              class="npc-trait-row__settings-input"
              name="attr_trait_name"
              type="text"
              placeholder="Trait name"
              data-i18n-placeholder="trait name"
              aria-label="Trait Name"
            />
          </div>

          <div class="npc-trait-row__settings-row npc-trait-row__settings-row--full">
            <span class="npc-trait-row__settings-label" data-i18n="description">Description</span>
            <textarea
              class="npc-trait-row__settings-textarea"
              name="attr_trait_description"
              placeholder="Describe the trait or special rule..."
              data-i18n-placeholder="trait description"
              aria-label="Trait Description"
            ></textarea>
          </div>
        </div>
      </div>
    </fieldset>
  </Frame>
</div>

<style lang="scss">
  .npc-traits-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .npc-trait-row {
    display: grid;
    grid-template-columns: 1fr 2rem;
    gap: 0.5rem;
    align-items: center;
    padding: 0.35rem 0;
    border-bottom: 1px dotted #ccc;
    position: relative;
    margin-top: 0.5rem;

    &__roll-btn {
      display: flex;
      align-items: center;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      padding: 0;
      font-family: var(--font-header, "Montserrat", sans-serif);
      font-weight: bold;
      font-size: 0.95rem;
      color: var(--color-text, #000000);

      &:hover {
        color: var(--color-accent, #ff3366);
      }
    }

    &__cog-label {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 0;
    }

    &__cog-icon {
      font-family: "Pictos";
      font-size: 1rem;
      color: #777;

      &:hover {
        color: var(--color-accent, #ff3366);
      }
    }

    &__settings-toggle {
      display: none;
    }

    &__settings-drawer {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background-color: var(--color-card-bg, #f4f4f4);
      border: 1px solid var(--color-border, #000000);
      padding: 0.6rem;
      margin-top: 0.4rem;
      border-radius: 4px;
    }

    :global(input.npc-trait-row__settings-toggle:not(:checked) ~ .npc-trait-row__settings-drawer) {
      display: none;
    }

    &__settings-row {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    &__settings-label {
      font-family: var(--font-header, "Montserrat", sans-serif);
      font-size: 0.7rem;
      font-weight: bold;
      text-transform: uppercase;
      color: #555;
    }

    &__settings-input {
      font-size: 0.85rem;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--color-border, #000000);
      background: var(--color-bg, #ffffff);
      color: var(--color-text, #000000);
      border-radius: 2px;
    }

    &__settings-textarea {
      font-size: 0.85rem;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--color-border, #000000);
      background: var(--color-bg, #ffffff);
      color: var(--color-text, #000000);
      border-radius: 2px;
      resize: vertical;
      min-height: 3.5rem;
    }

    &__preview {
      grid-column: 1 / -1;
      font-size: 0.85rem;
      color: #444;
      padding: 0.2rem 0;
      white-space: pre-wrap;
    }
  }
</style>
