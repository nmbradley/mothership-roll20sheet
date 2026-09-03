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
// The staging name field and the card's own selection checkbox: present for
// the sheetworker, not for the eye. The card itself is the click target.
.ms-cm-hide {
  @extend %ms-visually-hidden;
}

.ms-cm-class {
  display: block;

  padding: var(--ms-space-md);

  cursor: pointer;

  color: var(--ms-fg-inverse);

  &:hover .ms-cm-class__title {
    color: var(--ms-accent);
  }

  &__title {
    margin-bottom: var(--ms-space-sm);

    font-size: var(--ms-text-lg);
    font-family: var(--ms-font-header);
    font-weight: 800;
    text-align: center;
    text-transform: uppercase;
    color: inherit;
  }

  &__desc {
    font-size: var(--ms-text-sm);
    font-family: var(--ms-font-body);
    font-weight: 400;
    text-align: center;
    color: inherit;
  }

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

// The chosen class's own title on the class-info panel -- a plain heading
// rather than a card, so it never combines with .ms-cm-class__title above.
.ms-cm-class__title--selected {
  margin-bottom: var(--ms-space-md);

  font-size: var(--ms-text-xl);
  font-family: var(--ms-font-header);
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
  color: var(--ms-fg);
}
</style>
