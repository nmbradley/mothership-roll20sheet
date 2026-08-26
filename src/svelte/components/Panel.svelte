<script lang="ts">
  import Frame from "#svelte/components/Frame.svelte";
  import Header from "#svelte/components/Header.svelte";

  export let title: string = "";
  export let mode: "light" | "light-grey" | "mid-grey" | "dark" = "light";
  export let corner: "small" | "medium" | "large" = "medium";
</script>

<section class="panel">
  <Frame {mode} {corner}>
    {#if title}
      <Header {title} />
    {/if}
    <slot />
  </Frame>
</section>

<style lang="scss">
.panel {
  display: block;
}
</style>
