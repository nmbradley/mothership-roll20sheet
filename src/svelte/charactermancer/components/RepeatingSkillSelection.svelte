<charmancer class="sheet-repeating-skillselection">
  <div class="ms-cm-row--skillselect">
    <div class="ms-cm-row__title" data-i18n="Choose a Skill"></div>
    <select class="ms-cm-row__select" name="comp_skill">
      <option data-i18n="Choose">Choose</option>
    </select>
    <input name="comp_skill_type" type="hidden" />
  </div>
</charmancer>

<style lang="scss">
// Also used by RepeatingFloatingChoice.svelte, whose floating-stat picker is
// the same shape: a title above a select. Shared here since the class is
// identical in both, rather than duplicating the rule per component.
.ms-cm-row--skillselect {
  margin: var(--ms-space-sm) 0;
  border-top: var(--ms-border-width) solid var(--ms-rule);
  padding-top: var(--ms-space-sm);
}

.ms-cm-row__select {
  margin-top: var(--ms-space-sm);
}
</style>
