<script lang="ts">
  import { skillsByLevel, type SkillEntry } from "#game/constants.js";
  import { SkillLevels } from "#game/enums.js";
  import { titleCase } from "#game/text.js";
  import CharmancerPageControl from "#svelte/charactermancer/components/CharmancerPageControl.svelte";
  import CharmancerSlide from "#svelte/charactermancer/components/CharmancerSlide.svelte";

  const levels = [SkillLevels.Trained, SkillLevels.Expert, SkillLevels.Master];

  /** Renders the skills a given skill unlocks, for the hover tooltip. */
  function unlocksLabel(skill: SkillEntry): string {
    const titled = skill.unlocks.map((name) => {
      const first = name.charAt(0);
      const rest = name.slice(1);
      return `${first.toUpperCase()}${rest}`;
    });
    const label = titled.join(", ");
    return label;
  }
</script>

<CharmancerSlide name="skills">
  <div class="t__topbar"></div>
  <div class="ms-cm-container">
    <div class="ms-cm-panel--skills">
      <input name="comp_owned" type="hidden" />
      <input name="comp_unlocked" type="hidden" />
      <input name="comp_trained_lock" type="hidden" />
      <input name="comp_expert_lock" type="hidden" />
      <input name="comp_master_lock" type="hidden" />

      <h2 class="ms-cm-guidetitle" data-i18n="Choose Skills">Choose Skills</h2>
      <p class="ms-cm-guidetext--span2" data-i18n="charmancer-step4"></p>

      <div class="ms-cm-skillpoints t__skillpointserror">
        <input name="comp_skillpoints" type="hidden" />
        <input name="comp_skillpoints_max" type="hidden" />
        <div class="ms-cm-skillpoints__label" data-i18n="Remaining Skill Points">
          Remaining Skill Points
        </div>
        <div class="ms-cm-skillpoints__value t__skillpoints"></div>
      </div>

      {#each levels as level (level)}
        <div class="ms-cm-skillcol--{level}">
          {#each skillsByLevel[level] as skill (skill.key)}
              {@const skillName = titleCase(skill.name)}
            <div class="ms-cm-skill">
              <input name="comp_{skill.key}" type="hidden" />
              <input name="comp_{skill.key}_type" type="hidden" />
              <button
                class="ms-cm-skill__wrapper ms-cm-skill__wrapper--{skill.key}"
                name="act_toggle-{skill.key}"
                type="action"
              >
                <div class="ms-cm-skill__check"></div>
                <div class="ms-cm-skill__name" data-i18n={skillName}>{skillName}</div>
              </button>
              <span class="ms-cm-tooltip">
                <p><span data-i18n={skill.desc}>{skill.desc}</span></p>
                {#if skill.unlocks.length > 0}
                  <p><strong>Unlocks:</strong> {unlocksLabel(skill)}</p>
                {/if}
              </span>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <CharmancerPageControl
    left={{
      action: "class",
      text: "Previous",
    }}
    middle={{
      action: "cancel",
      text: "Cancel",
    }}
    right={{
      action: "equipment",
      text: "Next",
    }}
  />
</CharmancerSlide>

<style lang="scss">
.ms-cm-skillpoints {
  position: sticky;
  z-index: 1;
  top: 0;
  grid-column: 1 / -1;

  margin-bottom: var(--ms-space-md);
  border-bottom: var(--ms-border-width) solid var(--ms-border);
  padding: var(--ms-space-sm) 0 var(--ms-space-md);

  background: inherit;

  text-align: center;

  &__label {
    font-size: var(--ms-text-sm);
    font-family: var(--ms-font-header);
    font-weight: 800;
    text-transform: uppercase;
    color: var(--ms-fg-muted);
  }

  &__value {
    font-size: var(--ms-text-xl);
    font-weight: 800;
    color: inherit;
  }
}

.ms-cm-skillcol--trained,
.ms-cm-skillcol--expert,
.ms-cm-skillcol--master {
  display: flex;
  flex-direction: column;
  gap: var(--ms-space-sm);
}

.ms-cm-skill {
  position: relative;

  &:hover .ms-cm-tooltip {
    display: block;
  }
}

.ms-cm-skill__wrapper {
  @extend %ms-btn-reset;

  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--ms-space-sm);
  align-items: center;

  border: var(--ms-border-width) solid var(--ms-rule);
  border-radius: var(--ms-radius-sm);
  width: 100%;
  padding: var(--ms-space-sm) var(--ms-space-md);

  background: var(--ms-sunken);
  cursor: pointer;

  text-align: left;
  color: var(--ms-fg);

  &:hover {
    border-color: var(--ms-accent);
  }
}

.ms-cm-skill__check {
  border: var(--ms-border-width) solid var(--ms-border);
  border-radius: var(--ms-radius-pill);
  width: 1.1rem;
  height: 1.1rem;

  background: var(--ms-surface);
}

// The staging value lives on a hidden input beside the button, not on a
// checkbox inside it, so the checkmark reads its sibling's value instead of
// an :checked pseudo-class.
.ms-cm-skill input[type="hidden"][value="on"] ~ * .ms-cm-skill__check {
  background: var(--ms-accent);
}

.ms-cm-skill__name {
  font-size: var(--ms-text-sm);
  font-family: var(--ms-font-header);
  font-weight: 700;
  text-transform: uppercase;
}

.ms-cm-tooltip {
  display: none;
  position: absolute;
  z-index: 10;
  top: 100%;
  left: 0;

  margin-top: var(--ms-space-sm);
  border-radius: var(--ms-radius-md);
  min-width: 180px;
  max-width: 280px;
  padding: var(--ms-space-md);

  background: var(--ms-inverse);

  font-size: var(--ms-text-sm);
  color: var(--ms-fg-inverse);

  p {
    margin: 0 0 var(--ms-space-sm);

    font-family: var(--ms-font-body);
    font-weight: 400;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
