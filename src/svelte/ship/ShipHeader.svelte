<script lang="ts">
  import {
    ship_name,
    ship_type,
    ship_class,
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
      <div class="ship-header__field ship-header__field--type">
        <Attribute field={ship_type} />
      </div>
      <div class="ship-header__field ship-header__field--class">
        <Attribute field={ship_class} />
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
      grid-template-columns: 2fr 1fr 1fr;
      gap: var(--ms-space-lg);
    }

    &__field {
      &--name {
        grid-column: 1 / -1;
      }
    }
  }
</style>
