<script lang="ts">
  import { allSaves, allStats } from "#game/enums.js";
  import CharmancerGuide from "#svelte/charactermancer/components/CharmancerGuide.svelte";
  import CharmancerPageControl from "#svelte/charactermancer/components/CharmancerPageControl.svelte";
  import CharmancerSave from "#svelte/charactermancer/components/CharmancerSave.svelte";
  import CharmancerSlide from "#svelte/charactermancer/components/CharmancerSlide.svelte";
  import CharmancerStat from "#svelte/charactermancer/components/CharmancerStat.svelte";

  // Plain string: Roll20's braces need no escaping outside markup.
  // Health rolls last, after every stat and save (#42): 2-stats.ts reads it
  // off the end of the same eventInfo.roll array by position.
  const statRoll = "{{template:ms-cm}} {{title=stats roll}} {{strength=[[2d10+25]]}}"
    + " {{speed=[[2d10+25]]}} {{intellect=[[2d10+25]]}} {{combat=[[2d10+25]]}}"
    + " {{sanity=[[2d10+10]]}} {{fear=[[2d10+10]]}} {{body=[[2d10+10]]}}"
    + " {{health=[[1d10+10]]}}";
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
      <div class="ms-cm-savegroup choice showstats">
        {#each allSaves as save (save)}
          <CharmancerSave {save}>
            <input name="comp_{save}" type="hidden" />
          </CharmancerSave>
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

<style lang="scss">
.ms-cm-button--roll {
  @extend %ms-btn-reset;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: var(--ms-border-width) solid var(--ms-border);
  border-radius: var(--ms-radius-pill);
  padding: var(--ms-space-md) var(--ms-space-xl);

  background: var(--ms-inverse);
  cursor: pointer;

  font-size: var(--ms-text-lg);
  font-family: var(--ms-font-header);
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
  color: var(--ms-fg-inverse);

  &:hover {
    opacity: 0.85;
  }
}
</style>
