<script>
    import CharacterSheet from './CharacterSheet.svelte';
    import ShipSheet from './ShipSheet.svelte';
    
    // We can use variables just to define static data at compile-time!
    let title = "Mothership 1e Character Sheet";
    
    // Bypassing Svelte parser for the worker script tag
    let workerScriptOpen = '<script type="text/worker">';
    let workerScriptClose = '</s' + 'cript>';
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
</div>

{@html workerScriptOpen}
    console.log("Roll20 Sheetworker code here");
{@html workerScriptClose}

<style>
    .sheet-wrapper { font-family: sans-serif; }
    h1 { color: #ff3366; }
</style>
