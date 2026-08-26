<script lang="ts">
  import {
    body,
    combat,
    fear,
    intellect,
    sanity,
    speed,
    strength,
  } from "#game/fields/pcFields.js";
  import Panel from "#svelte/components/Panel.svelte";
  import PCStatCard from "#svelte/pc/components/PCStatCard.svelte";

  const stats = [strength, speed, intellect, combat];
  const saves = [sanity, fear, body];
</script>

<!-- Stats and Saves are the two grey blocks on the printed sheet. -->
<section class="pc-stats-panel">
  <Panel title="Stats" mode="light-grey" corner="large">
    <div class="pc-stats-grid">
      {#each stats as stat (stat.name)}
        <PCStatCard field={stat} />
      {/each}
    </div>
  </Panel>

  <Panel title="Saves" mode="light-grey" corner="large">
    <div class="pc-stats-grid pc-stats-grid--saves">
      {#each saves as save (save.name)}
        <PCStatCard field={save} />
      {/each}
    </div>
  </Panel>
</section>

<style lang="scss">
.pc-stats-panel {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-lg);
}

.pc-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--ms-space-md);
  justify-items: center;

  &--saves {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
