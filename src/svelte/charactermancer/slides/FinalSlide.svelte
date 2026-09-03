<script lang="ts">
  import CharmancerSlide from "#svelte/charactermancer/components/CharmancerSlide.svelte";
</script>

<CharmancerSlide name="final">
  <div class="ms-cm-panel--full">
    <h1 data-i18n="Building character...">Building character...</h1>
    <div class="ms-cm-progressbar t__progressbar">
      <div style="width: 0%;"></div>
    </div>
  </div>
</CharmancerSlide>

<style lang="scss">
.ms-cm-progressbar {
  margin: var(--ms-space-xl) auto;
  border: var(--ms-border-width-thick) solid var(--ms-border);
  border-radius: var(--ms-radius-pill);
  width: 80%;
  padding: var(--ms-space-sm);

  > div {
    transition: width 200ms ease-in-out;

    border-radius: var(--ms-radius-pill);
    height: var(--ms-space-lg);

    background: var(--ms-accent);
  }
}
</style>
