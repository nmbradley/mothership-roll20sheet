<script lang="ts">
  import type { CheckboxAttribute } from "#game/fields/_factories.js";

  import Panel from "./Panel.svelte";
  import SettingsDrawer from "./SettingsDrawer.svelte";

  /** The cog checkbox that opens the drawer -- usually `settings_toggle`. */
  export let field: CheckboxAttribute;
</script>

<!--
  A sheet-level sibling of SettingsDrawer/SettingsRow rather than a change to
  them: those two stay shaped for a repeating row's trailing cog column, while
  this wraps the same drawer in a Panel so PC, NPC and Ship can each drop their
  own settings rows into one without re-laying it out per sheet.
-->
<section class="settings-panel">
  <Panel title="Settings" corner="small">
    <SettingsDrawer {field}>
      <slot />
    </SettingsDrawer>
  </Panel>
</section>

<style lang="scss">
.settings-panel {
  display: block;
}
</style>
