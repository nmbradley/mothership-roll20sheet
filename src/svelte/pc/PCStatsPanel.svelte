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
  import ButtonAction from "#svelte/components/ButtonAction.svelte";
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

      <!-- Optional 1e rule (#50): a Speed Check doubles as Initiative,
           rolled into the Turn Tracker. Hidden unless speed_initiative is
           on -- a sheet cannot run JS outside its sheetworkers, so this
           rereads the checkbox via :has() rather than script. CharacterSheet
           mirrors the checkbox (now on the settings page) into .pc-sheet so
           :has() can still find it, the same trick NPCSheet uses. -->
      <div class="pc-stats-panel__initiative">
        <ButtonAction action="pc-initiative" label="Initiative" />
      </div>
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

.pc-stats-panel__initiative {
  display: none;
  grid-column: 1 / -1;
  justify-content: center;

  .button {
    @extend %ms-caption;

    border: none;
    padding: 0;

    background: none;

    font-size: var(--ms-text-sm);

    &:hover {
      background: none;

      color: var(--ms-accent);
    }
  }
}

.pc-sheet:has(input[name="attr_speed_initiative"]:checked) .pc-stats-panel__initiative {
  display: flex;
}
</style>
