<script lang="ts">
  import { allSaves, allStats } from "#game/enums.js";
  import CharmancerAltStat from "#svelte/charactermancer/components/CharmancerAltStat.svelte";
  import CharmancerPageControl from "#svelte/charactermancer/components/CharmancerPageControl.svelte";
  import CharmancerSave from "#svelte/charactermancer/components/CharmancerSave.svelte";
  import CharmancerSlide from "#svelte/charactermancer/components/CharmancerSlide.svelte";
  import CharmancerStat from "#svelte/charactermancer/components/CharmancerStat.svelte";

  const derived = ["health", "stress", "resolve"];
</script>

<CharmancerSlide name="review">
  <div class="ms-cm-container">
    <div class="ms-cm-panel--full">
      <h1 data-i18n="Review">Review</h1>
      <p class="ms-cm-guidetext" data-i18n="charmancer-step6"></p>

      <div class="ms-cm-topstats">
        <div class="ms-cm-stats">
          {#each allStats as stat (stat)}
            <CharmancerStat {stat}>
              <input name="comp_{stat}_final" type="hidden" />
            </CharmancerStat>
          {/each}
        </div>

        <div class="ms-cm-altstats">
          {#each derived as name (name)}
            <CharmancerAltStat {name}>
              <input name="comp_{name}_final" type="hidden" />
            </CharmancerAltStat>
          {/each}
        </div>

        <div class="ms-cm-saves">
          {#each allSaves as save (save)}
            <CharmancerSave {save}>
              <input name="comp_{save}_final" type="hidden" />
            </CharmancerSave>
          {/each}
        </div>
      </div>

      <div class="ms-cm-review">
        <div>
          <div class="ms-cm-classblock">
            <h2 data-i18n="Class">Class</h2>
            <div class="ms-cm-classrow">
              <div class="ms-cm-classrow__title" data-i18n="Class"></div>
              <div class="ms-cm-classrow__display t__class"></div>
              <input name="comp_class_final" type="hidden" />
            </div>
            <div class="ms-cm-classrow">
              <div class="ms-cm-classrow__title" data-i18n="Stress Effect"></div>
              <div class="ms-cm-classrow__display t__stresseffect"></div>
              <input name="comp_stresseffect_final" type="hidden" />
            </div>
          </div>

          <div class="ms-cm-skillblock">
            <h2 data-i18n="Skills">Skills</h2>
            <div class="ms-cm-skrow">
              <div class="ms-cm-skrow__title" data-i18n="Remaining Skill Points"></div>
              <div class="ms-cm-skrow__display t__skillpoints"></div>
            </div>
            <div class="ms-cm-skrow">
              <div class="ms-cm-skrow__title" data-i18n="Skills"></div>
              <div class="t__skilllist"></div>
            </div>
            <input name="comp_skills_final" type="hidden" />
            <input name="comp_skillpoints_final" type="hidden" />
          </div>
        </div>

        <div class="ms-cm-equipment">
          <h2 data-i18n="Equipment">Equipment</h2>
          <div class="ms-cm-eqrow">
            <div class="ms-cm-eqrow__title" data-i18n="Starting Credits"></div>
            <div class="ms-cm-eqrow__display t__credits"></div>
            <input name="comp_credits_final" type="hidden" />
          </div>
          <div class="ms-cm-eqrow">
            <div class="ms-cm-eqrow__title" data-i18n="Trinket"></div>
            <div class="ms-cm-eqrow__display t__trinket"></div>
            <input name="comp_trinket_final" type="hidden" />
          </div>
          <div class="ms-cm-eqrow">
            <div class="ms-cm-eqrow__title" data-i18n="Patch"></div>
            <div class="ms-cm-eqrow__display t__patch"></div>
            <input name="comp_patch_final" type="hidden" />
          </div>
          <div class="ms-cm-eqrow">
            <div class="ms-cm-eqrow__title" data-i18n="Equipment"></div>
            <input name="comp_equipment_final" type="hidden" />
          </div>
          <div class="t__equipmentlist"></div>
        </div>
      </div>
    </div>
  </div>

  <CharmancerPageControl
    left={{
      action: "equipment",
      text: "Back",
    }}
    middle={{
      action: "cancel",
      text: "Cancel",
    }}
    right={{
      action: "finish",
      text: "Finish",
    }}
  />
</CharmancerSlide>
