<script lang="ts">
  import type { Section } from "#game/fields/_factories.js";
  import { skill_name } from "#game/fields/pcFields.js";
  import { titleCase } from "#game/text.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import RepeatingSection from "#svelte/components/RepeatingSection.svelte";

  /** The tier this section holds, used for its heading. */
  export let level: string;
  export let section: Section;

  // The key is the display text, so both are read from one expression.
  $: title = titleCase(level);
</script>

<!--
  A skill is just its name: the section it sits in is its tier, and the roll is
  made from the Stat or Save it applies to rather than from the skill itself.
-->
<div class="pc-skills-section">
  <h3 class="pc-skills-section__title" data-i18n={title}>{title}</h3>

  <RepeatingSection {section} fields={[skill_name]} columns="1fr">
    <Attribute field={skill_name} isLabelHidden />
  </RepeatingSection>
</div>

<style lang="scss">
.pc-skills-section {
  margin-bottom: var(--ms-space-lg);

  &__title {
    margin-bottom: var(--ms-space-md);

    font-size: var(--ms-text-md);
    font-family: var(--ms-font-header);
    text-transform: uppercase;
  }

  // A skill is a single field, so it needs no rule under it to separate it from
  // the columns that are no longer there.
  .repeating__row {
    border-bottom: none;
    padding-bottom: 0;
  }
}
</style>
