<script lang="ts">
  import { allStats } from "#game/enums.js";
  import CharmancerGuide from "#svelte/charactermancer/components/CharmancerGuide.svelte";
  import CharmancerPageControl from "#svelte/charactermancer/components/CharmancerPageControl.svelte";
  import CharmancerSlide from "#svelte/charactermancer/components/CharmancerSlide.svelte";
  import CharmancerStat from "#svelte/charactermancer/components/CharmancerStat.svelte";

  // Plain string: Roll20's braces need no escaping outside markup.
  const statRoll = "{{template:ms-cm}} {{title=stats roll}} {{strength=[[6d10]]}}"
    + " {{speed=[[6d10]]}} {{intellect=[[6d10]]}} {{combat=[[6d10]]}}";
</script>

<CharmancerSlide name="stats">
  <div class="t__topbar"></div>
  <div class="ms-cm-container">
    <div class="ms-cm-panel">
      <input name="comp_rolled_stats" type="hidden" value="false" />
      <input name="comp_health" type="hidden" />
      <input name="comp_stress" type="hidden" />
      <input name="comp_wounds" type="hidden" />
      <input name="comp_armor_points" type="hidden" />

      <CharmancerGuide title="Stats" body="charmancer-step2" />
    </div>

    <div class="ms-cm-panel">
      <div class="ms-cm-stats--main choice showstats">
        {#each allStats as stat (stat)}
          <CharmancerStat {stat}>
            <input name="comp_{stat}" type="hidden" />
          </CharmancerStat>
        {/each}
      </div>
      <div class="ms-cm-center">
        <button
          class="ms-cm-button--roll"
          data-i18n="Roll Stats"
          name="roll_stats"
          type="roll"
          value={statRoll}
        >Roll Stats</button>
      </div>
    </div>
  </div>

  <CharmancerPageControl
    left={{
      action: "intro",
      text: "Previous",
    }}
    middle={{
      action: "cancel",
      text: "Cancel",
    }}
    right={{
      action: "class",
      text: "Next",
    }}
  />
</CharmancerSlide>
