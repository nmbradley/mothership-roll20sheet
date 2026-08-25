<script>
  import CharacterSheet from "./CharacterSheet.svelte";
  import NPCSheet from "./NPCSheet.svelte";
  import ShipSheet from "./ShipSheet.svelte";

  // We can use variables just to define static data at compile-time!
  const title = "Mothership 1e Character Sheet";

  // Bypassing Svelte parser for the worker script tag
  const workerScriptOpen = "<script type=\"text/worker\">";
  const workerScriptClose = "</s" + "cript>";
</script>

<div class="sheet-wrapper">
  <h1>{title}</h1>

  <input type="hidden" name="attr_sheet_type" class="sheet-type-toggle" value="character" />

  <div class="character-sheet">
    <CharacterSheet />
  </div>

  <div class="ship-sheet">
    <ShipSheet />
  </div>

  <div class="npc-sheet-wrapper">
    <NPCSheet />
  </div>
</div>

<!-- eslint-disable svelte/no-at-html-tags -->
{@html workerScriptOpen}
  console.log("Roll20 Sheetworker code here");
{@html workerScriptClose}
<!-- eslint-enable svelte/no-at-html-tags -->

<style>
  .sheet-wrapper { font-family: sans-serif; }
  h1 { color: #ff3366; }
</style>
