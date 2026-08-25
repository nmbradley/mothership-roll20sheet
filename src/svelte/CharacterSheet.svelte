<script>
    const stats = [
        { name: "Strength", attr: "strength" },
        { name: "Speed", attr: "speed" },
        { name: "Intellect", attr: "intellect" },
        { name: "Combat", attr: "combat" }
    ];
</script>

<div class="section">
    <h2>Character Stats</h2>
    {#each stats as stat}
        <div class="stat-row">
            <label>{stat.name}</label>
            <input type="number" name="attr_{stat.attr}" value="25" />
        </div>
    {/each}
</div>
