<script lang="ts">
  import { allSaves, allStats } from "#game/enums.js";
  import CharmancerAltStat from "#svelte/charactermancer/components/CharmancerAltStat.svelte";
  import CharmancerSave from "#svelte/charactermancer/components/CharmancerSave.svelte";
  import CharmancerStat from "#svelte/charactermancer/components/CharmancerStat.svelte";

  const derived = ["health", "stress", "resolve"];
</script>

<charmancer class="sheet-repeating-topbar">
  <div class="ms-cm-topstats">
    <div class="ms-cm-stats">
      {#each allStats as stat (stat)}
        <CharmancerStat {stat}>
          <input name="comp_{stat}" type="hidden" />
          <input name="comp_{stat}_final" type="hidden" />
        </CharmancerStat>
      {/each}
    </div>

    <div class="ms-cm-altstats">
      {#each derived as name (name)}
        <CharmancerAltStat {name}>
          <input name="comp_{name}" type="hidden" />
        </CharmancerAltStat>
      {/each}
    </div>

    <div class="ms-cm-saves">
      {#each allSaves as save (save)}
        <CharmancerSave {save}>
          <input name="comp_{save}" type="hidden" />
          <input name="comp_{save}_final" type="hidden" />
        </CharmancerSave>
      {/each}
    </div>
  </div>
</charmancer>
