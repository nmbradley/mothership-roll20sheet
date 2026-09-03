<script lang="ts">
  import { allSaves, allStats } from "#game/enums.js";
  import CharmancerGuide from "#svelte/charactermancer/components/CharmancerGuide.svelte";
  import CharmancerPageControl from "#svelte/charactermancer/components/CharmancerPageControl.svelte";
  import CharmancerSave from "#svelte/charactermancer/components/CharmancerSave.svelte";
  import CharmancerSlide from "#svelte/charactermancer/components/CharmancerSlide.svelte";

  const custom_class = [
    {
      name: "Class Name",
      attr: "class",
      type: "input",
    },
    {
      name: "Sanity Save",
      attr: "sanity",
      type: "input",
    },
    {
      name: "Fear Save",
      attr: "fear",
      type: "input",
    },
    {
      name: "Body Save",
      attr: "body",
      type: "input",
    },
    {
      name: "Strength Mod",
      attr: "strength_mod",
      type: "input",
    },
    {
      name: "Speed Mod",
      attr: "speed_mod",
      type: "input",
    },
    {
      name: "Intellect Mod",
      attr: "intellect_mod",
      type: "input",
    },
    {
      name: "Combat Mod",
      attr: "combat_mod",
      type: "input",
    },
    {
      name: "Stress Effect",
      attr: "stress_effect",
      type: "long",
    },
    {
      name: "Skill Points",
      attr: "skill_points",
      type: "input",
    },
  ];

</script>

<CharmancerSlide name="class">
  <div class="t__topbar"></div>
  <input name="comp_selected" type="hidden" />

  <div class="ms-cm-container choice showclasses">
    <div class="ms-cm-panel--classes">
      <CharmancerGuide title="Select a Class" body="charmancer-step3a" isWide />
      <div class="ms-cm-classes t__classes"></div>
    </div>
  </div>

  <div class="ms-cm-container choice showclassinfo">
    <div class="ms-cm-panel">
      <CharmancerGuide title="Your Class" body="charmancer-step3b" />
      <div class="ms-cm-center">
        <button
          class="ms-cm-button--action"
          data-i18n="Reselect Class"
          name="act_reselectc"
          type="action"
        >Reselect Class</button>
      </div>
    </div>

    <div class="ms-cm-panel">
      <div class="choice presetclass">
        <!-- Filled by setCharmancerText once a class is chosen. -->
        <!-- svelte-ignore a11y_missing_content -->
        <h3 class="ms-cm-class__title--selected t__cname"></h3>
        <div class="ms-cm-savegroup">
          {#each allSaves as save (save)}
            <CharmancerSave {save}>
              <input name="comp_{save}" type="hidden" />
            </CharmancerSave>
          {/each}
        </div>

        <input name="comp_skills" type="hidden" />
        <input name="comp_skill_choice" type="hidden" />
        {#each allStats as stat (stat)}
          <input name="comp_{stat}_modifier" type="hidden" />
        {/each}
        <input name="comp_health" type="hidden" />

        <!-- Only Android and Scientist have a floating bonus; empty otherwise. -->
        <div class="ms-cm-row">
          <div class="ms-cm-row__title" data-i18n="Stat Adjustment"></div>
          <div class="t__floating_choice"></div>
        </div>

        <div class="ms-cm-row">
          <div class="ms-cm-row__title" data-i18n="Stress Effect"></div>
          <div class="t__stress_effect"></div>
        </div>
        <div class="ms-cm-row">
          <div class="ms-cm-row__title" data-i18n="Skills"></div>
          <div class="t__skills"></div>
          <div class="t__skill_choice"></div>
        </div>
        <div class="ms-cm-row">
          <div class="ms-cm-row__title" data-i18n="Skill Points"></div>
          <div class="t__skill_points"></div>
        </div>
      </div>

      <div class="choice customclass">
        {#each custom_class as field (field.attr)}
          <div class="ms-cm-row">
            <div class="ms-cm-row__label" data-i18n={field.name}></div>
            {#if field.type === "long"}
              <input class="ms-cm-row__input--long" name="comp_{field.attr}" />
            {:else}
              <input class="ms-cm-row__input" name="comp_{field.attr}" />
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="ms-cm-compendium choice showclassinfo"></div>
  </div>

  <CharmancerPageControl
    left={{
      action: "stats",
      text: "Previous",
    }}
    middle={{
      action: "cancel",
      text: "Cancel",
    }}
    right={{
      action: "skills",
      text: "Next",
    }}
  />
</CharmancerSlide>

<style lang="scss">
.ms-cm-classes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ms-space-md);
  justify-content: center;

  padding: var(--ms-space-sm);
}

.ms-cm-savegroup {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ms-space-sm);

  margin: var(--ms-space-md) 0;
  border-top: var(--ms-border-width) solid var(--ms-rule);
  padding-top: var(--ms-space-md);
}

.ms-cm-row {
  margin: var(--ms-space-sm) 0;
  border-top: var(--ms-border-width) solid var(--ms-rule);
  padding-top: var(--ms-space-sm);

  font-size: var(--ms-text-sm);

  &__title {
    margin-bottom: var(--ms-space-sm);

    font-size: var(--ms-text-xs);
    font-family: var(--ms-font-header);
    font-weight: 800;
    text-transform: uppercase;
    color: var(--ms-fg-muted);
  }

  &__label {
    font-size: var(--ms-text-sm);
    font-weight: 700;
    color: var(--ms-fg);
  }

  // The custom-class inputs carry no type="text", so they miss the sheet's
  // base input rule (which keys off [type="text"]) and need their own chrome.
  &__input,
  &__input--long {
    margin-top: var(--ms-space-sm);
    border: var(--ms-border-width) solid var(--ms-border);
    border-radius: var(--ms-radius-sm);
    width: 100%;
    padding: var(--ms-space-sm) var(--ms-space-md);

    background: var(--ms-surface);

    font-size: var(--ms-text-md);
    font-family: var(--ms-font-body);
    color: var(--ms-fg);
  }
}

.ms-cm-button--action {
  @extend %ms-btn-reset;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: var(--ms-border-width) solid var(--ms-border);
  border-radius: var(--ms-radius-sm);
  padding: var(--ms-space-sm) var(--ms-space-lg);

  background: var(--ms-inverse);
  cursor: pointer;

  font-family: var(--ms-font-header);
  font-weight: 800;
  text-transform: uppercase;
  color: var(--ms-fg-inverse);

  &:hover {
    opacity: 0.85;
  }
}
</style>
