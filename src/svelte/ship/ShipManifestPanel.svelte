<script lang="ts">
  import {
    shipUpgrades,
    ship_cargo,
    ship_major_repairs,
    ship_minor_repairs,
    ship_upgrade_name,
    ship_upgrades,
  } from "#game/fields/shipFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";
</script>

<!-- #58 section 8, Status / Ship Manifest. Supersedes the old shiploadout
     repeating list: 1e tracks Cargo as a capacity number, not a free-text
     item log, and equipment installed on the ship is the Upgrades list below. -->
<section class="ship-manifest-panel">
  <Panel title="Upgrades">
    <Attribute field={ship_upgrades} />
    <RepeatingSection
      section={shipUpgrades}
      fields={[ship_upgrade_name]}
      columns="1fr"
    />
  </Panel>

  <Panel title="Ship Manifest">
    <Attribute field={ship_cargo} />
    <Attribute field={ship_minor_repairs} />
    <Attribute field={ship_major_repairs} />
  </Panel>
</section>

<style lang="scss">
.ship-manifest-panel {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-lg);
}
</style>
