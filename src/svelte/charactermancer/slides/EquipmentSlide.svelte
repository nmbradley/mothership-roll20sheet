<script lang="ts">
  import CharmancerGuide from "#svelte/charactermancer/components/CharmancerGuide.svelte";
  import CharmancerPageControl from "#svelte/charactermancer/components/CharmancerPageControl.svelte";
  import CharmancerSlide from "#svelte/charactermancer/components/CharmancerSlide.svelte";
</script>

<CharmancerSlide name="equipment">
  <div class="t__topbar"></div>
  <div class="ms-cm-container">
    <div class="ms-cm-panel">
      <CharmancerGuide title="Choose Equipment" body="charmancer-step5" />
    </div>

    <div class="ms-cm-panel">
      <div class="ms-cm-package">
        <div class="ms-cm-package__title" data-i18n="Choose an Equipment Package"></div>
        <input name="comp_equipment" type="hidden" />
        <select class="ms-cm-skill__select" name="comp_package">
          <option data-i18n="Choose" value="choose">Choose</option>
        </select>
        <div class="t__package"></div>
        <div class="choice custompackage">
          <span
            data-i18n="You can add custom equipment to the character sheet after completing the charactermancer."
          ></span>
        </div>
        <div class="choice noloadout">
          <span data-i18n="You forgo a loadout and receive 2d10x100 credits instead."></span>
        </div>
      </div>

      <div class="ms-cm-credits">
        <div class="ms-cm-credits__title" data-i18n="Starting Credits"></div>
        <div class="ms-cm-credits__roll t__creditsroll"></div>
        <input name="comp_credits" type="hidden" />
        <div class="ms-cm-credits__display t__credits"></div>
      </div>

      <div class="ms-cm-trinket">
        <div class="ms-cm-trinket__title" data-i18n="Trinket"></div>
        <div class="ms-cm-trinket__roll t__trinketroll"></div>
        <div class="ms-cm-trinket__display t__trinket"></div>
        <div class="choice customtrinket">
          <span data-i18n="Add a custom trinket."></span>
          <input name="comp_trinket" type="hidden" />
        </div>
      </div>

      <div class="ms-cm-patch">
        <div class="ms-cm-patch__title" data-i18n="Patch"></div>
        <div class="ms-cm-patch__roll t__patchroll"></div>
        <div class="ms-cm-patch__display t__patch"></div>
        <div class="choice custompatch">
          <span data-i18n="Add a custom patch."></span>
          <input name="comp_patch" type="hidden" />
        </div>
      </div>
    </div>
  </div>

  <CharmancerPageControl
    left={{
      action: "skills",
      text: "Previous",
    }}
    middle={{
      action: "cancel",
      text: "Cancel",
    }}
    right={{
      action: "review",
      text: "Next",
    }}
  />
</CharmancerSlide>
