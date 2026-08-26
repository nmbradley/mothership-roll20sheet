<charmancer class="sheet-repeating-class">
  <input class="ms-cm-hide" name="comp_name" type="hidden" />
  <label class="ms-cm-class">
    <input class="ms-cm-hide" name="comp_selected" type="checkbox" />

    <!-- Title, blurb and grants are all filled by setCharmancerText. -->
    <!-- svelte-ignore a11y_missing_content -->
    <h2 class="ms-cm-class__title t__title"></h2>
    <div class="ms-cm-class__desc t__desc"></div>
    <div class="ms-cm-class__grants t__grants"></div>
  </label>
</charmancer>

<style lang="scss">
.ms-cm-class {
  &__grants {
    margin-top: var(--ms-space-md);
    border-top: var(--ms-border-width) solid var(--ms-border);
    padding-top: var(--ms-space-md);

    font-size: var(--ms-text-sm);
    font-family: var(--ms-font-header);
    text-transform: uppercase;
  }

  // The list itself is injected by the sheetworker.
  &__grantlist {
    margin: 0;
    padding: 0;

    list-style: none;
  }
}
</style>
