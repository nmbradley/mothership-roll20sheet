<script lang="ts">
  import { SkillLevels } from "#game/enums.js";
  import {
    pcExpertSkills, pcMasterSkills, pcTrainedSkills, skill_training, skill_training_time,
  } from "#game/fields/pcFields.js";
  import Attribute from "#svelte/components/Attribute.svelte";
  import Panel from "#svelte/components/Panel.svelte";
  import PCSkillSection from "#svelte/pc/components/PCSkillSection.svelte";

  const tiers = [
    {
      level: SkillLevels.Trained,
      section: pcTrainedSkills,
    },
    {
      level: SkillLevels.Expert,
      section: pcExpertSkills,
    },
    {
      level: SkillLevels.Master,
      section: pcMasterSkills,
    },
  ];

  const training = [skill_training, skill_training_time];
</script>

<Panel title="Skills" corner="large">
  {#each tiers as tier (tier.level)}
    <PCSkillSection level={tier.level} section={tier.section} />
  {/each}

  <!-- The printed sheet tracks one training course at the foot of the list. -->
  <div class="pc-training">
    <div class="pc-training__label" data-i18n="Skill Training">Skill Training</div>
    <div class="pc-training__fields">
      {#each training as field (field.name)}
        <div class="pc-training__field">
          <Attribute {field} isLabelHidden />
          <div class="pc-training__caption" data-i18n={field.i18nLabel}>{field.label}</div>
        </div>
      {/each}
    </div>
  </div>
</Panel>

<style lang="scss">
.pc-training {
  margin-top: var(--ms-space-lg);
  border-radius: var(--ms-radius-md);
  padding: var(--ms-space-md);

  background: var(--ms-sunken);

  &__label {
    @extend %ms-caption;

    margin-bottom: var(--ms-space-md);

    text-align: left;
  }

  &__field {
    border-radius: var(--ms-radius-sm);
    padding: var(--ms-space-sm) var(--ms-space-md);

    background: var(--ms-surface);

    // The field is the well; the control inside it carries no chrome of its own.
    .attribute__input {
      border: none;
      border-radius: 0;
      padding: 0;

      background: none;
    }
  }

  &__fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--ms-space-lg);
  }

  // Captioned beneath the field, as the printed sheet does.
  &__caption {
    margin-top: var(--ms-space-sm);

    font-size: var(--ms-text-xs);
    font-weight: 700;
    color: var(--ms-fg-muted);
  }
}
</style>
