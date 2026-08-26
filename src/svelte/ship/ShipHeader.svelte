<script lang="ts">
  import {
    ship_captain,
    ship_name,
    ship_transponder,
  } from "#game/fields/shipFields";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Frame from "#svelte/components/Frame.svelte";

  const shipLogoUrl =
    "https://s3.amazonaws.com/files.d20.io/images/145353993/itv_F4exdWuwHavdksYfCQ/max.png?1592850121";
</script>

<Frame mode="dark" corner="large">
  <div class="ship-header">
    <div class="ship-header__logo">
      <img src={shipLogoUrl} alt="Mothership Logo" class="ship-header__img" />
    </div>
    <div class="ship-header__fields">
      <div class="ship-header__field ship-header__field--name">
        <Attribute field={ship_name} />
      </div>
      <div class="ship-header__field ship-header__field--captain">
        <Attribute field={ship_captain} />
      </div>
      <div class="ship-header__field ship-header__field--transponder">
        <Attribute field={ship_transponder} />
      </div>
    </div>
  </div>
</Frame>

<style lang="scss">
  .ship-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
    align-items: center;

    &__logo {
      display: flex;
      align-items: center;
    }

    &__img {
      width: auto;
      max-height: 4.5rem;
    }

    &__fields {
      display: grid;
      // Name sits full-width above; Captain and the transponder line fill the
      // row below with no leftover column.
      grid-template-columns: 1fr 2fr;
      gap: var(--ms-space-lg);
    }

    &__field {
      &--name {
        grid-column: 1 / -1;
      }
    }
  }
</style>
