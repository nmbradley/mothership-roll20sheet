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

<style lang="scss">
.ms-cm-topstats {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--ms-space-lg);
  align-items: center;

  margin-bottom: var(--ms-space-lg);
  border-bottom: var(--ms-border-width) solid var(--ms-rule);
  padding-bottom: var(--ms-space-lg);
}

// The Stats block and Review's abbreviated re-statement of it share one
// treatment; the modifier never combines with the plain class, so this stays
// a placeholder rather than a nested override.
%ms-cm-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--ms-space-md);
}

.ms-cm-stats {
  @extend %ms-cm-stats-grid;
}

.ms-cm-stats--main {
  @extend %ms-cm-stats-grid;
  grid-template-columns: repeat(2, 1fr);
}

.ms-cm-altstats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ms-space-md);
}

// Sanity, Fear and Body: three saves, not four.
.ms-cm-saves {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ms-space-sm);
}
</style>
