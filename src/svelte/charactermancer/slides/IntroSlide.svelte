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
