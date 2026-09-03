<script lang="ts">
  import CharmancerPageControl from "#svelte/charactermancer/components/CharmancerPageControl.svelte";
  import CharmancerSlide from "#svelte/charactermancer/components/CharmancerSlide.svelte";
  import CharmancerTopbar from "#svelte/charactermancer/components/CharmancerTopbar.svelte";

  const logoUrl = "https://s3.amazonaws.com/files.d20.io/images/145353993"
    + "/itv_F4exdWuwHavdksYfCQ/max.png?1592850121";
</script>

<CharmancerSlide name="intro">
  <div class="t__topbar"></div>
  <div class="ms-cm-container">
    <div class="ms-cm-panel--full">
      <img
        class="ms-cm-logo"
        src={logoUrl}
        data-i18n-title="Mothership Logo"
        alt="Mothership Logo"
      />
      <p class="ms-cm-welcometext" data-i18n="charmancer-step1"></p>
    </div>
  </div>
  <CharmancerPageControl
    middle={{
      action: "cancel",
      text: "Cancel",
    }}
    right={{
      action: "stats",
      text: "Next",
    }}
  />
</CharmancerSlide>

<CharmancerTopbar />

<style lang="scss">
.ms-cm-logo {
  display: block;

  margin: 0 auto var(--ms-space-lg);
  width: 60%;

  // The wordmark art is white on transparent, same asset PCHeader uses --
  // the token flips it per theme instead of a permanent invert(1).
  filter: var(--ms-logo-filter);
}

.ms-cm-welcometext {
  font-size: var(--ms-text-md);
  line-height: 1.5;
  font-family: var(--ms-font-body);
  font-weight: 400;
  text-align: center;
  color: inherit;
}
</style>
