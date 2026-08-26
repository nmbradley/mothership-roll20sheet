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
