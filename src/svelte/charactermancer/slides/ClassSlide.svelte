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
