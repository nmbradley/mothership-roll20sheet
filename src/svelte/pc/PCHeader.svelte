<script lang="ts">
  import Frame from "#svelte/components/Frame.svelte";

  const logoUrl = "https://s3.amazonaws.com/files.d20.io/images/145353993"
    + "/itv_F4exdWuwHavdksYfCQ/max.png?1592850121";
</script>

<Frame mode="light" corner="large">
  <div class="pc-masthead">
    <!-- Opens Settings; see settings_open in pcFields.ts and Sheet.svelte. -->
    <label for="attr_settings_open" class="pc-masthead__logo-link">
      <img src={logoUrl} alt="Mothership" class="pc-masthead__logo" />
    </label>
  </div>
</Frame>

<style lang="scss">
.pc-masthead {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: var(--ms-space-md) 0;

  &__logo-link {
    display: inline-flex;

    cursor: pointer;
  }

  &__logo {
    width: auto;
    max-width: 100%;
    max-height: 3.5rem;

    // White art on a white panel is invisible; the token flips it per theme.
    filter: var(--ms-logo-filter);
  }
}

.pc-player {
  margin-top: var(--ms-space-lg);
}
</style>
