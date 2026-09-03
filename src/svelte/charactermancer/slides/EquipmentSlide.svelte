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

<style lang="scss">
.ms-cm-package,
.ms-cm-credits,
.ms-cm-trinket,
.ms-cm-patch {
  margin: var(--ms-space-sm) 0;
  border-top: var(--ms-border-width) solid var(--ms-rule);
  padding-top: var(--ms-space-sm);
}

.ms-cm-package__title,
.ms-cm-credits__title,
.ms-cm-trinket__title,
.ms-cm-patch__title {
  margin-bottom: var(--ms-space-sm);

  font-size: var(--ms-text-xs);
  font-family: var(--ms-font-header);
  font-weight: 800;
  text-transform: uppercase;
  color: var(--ms-fg-muted);
}

// The equipment package select, oddly named after the skill picker it was
// copied from -- base select styling already applies, this only spaces it.
.ms-cm-skill__select {
  margin-bottom: var(--ms-space-sm);
}

.ms-cm-credits,
.ms-cm-trinket,
.ms-cm-patch {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--ms-space-sm) var(--ms-space-md);
  align-items: center;
}

.ms-cm-credits__title,
.ms-cm-trinket__title,
.ms-cm-patch__title {
  grid-column: 1 / -1;
}

.ms-cm-credits__roll,
.ms-cm-trinket__roll,
.ms-cm-patch__roll {
  grid-row: span 2;
}

.ms-cm-credits__display,
.ms-cm-trinket__display,
.ms-cm-patch__display {
  font-size: var(--ms-text-md);
  color: var(--ms-fg);
}

// Injected by 5-equipment.ts once rolled -- an empty round button in the same
// language as the sheet's own roll buttons.
.ms-cm-creditsroll,
.ms-cm-trinketroll,
.ms-cm-patchroll {
  @extend %ms-btn-reset;
  @extend %ms-well-round;

  background: var(--ms-inverse);
  cursor: pointer;

  color: var(--ms-fg-inverse);

  &:hover {
    opacity: 0.85;
  }

  &::before {
    content: "🎲";

    font-size: var(--ms-text-lg);
  }
}
</style>
