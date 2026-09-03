<script lang="ts">
  export type PageAction = {
    /** Slide to move to, or the button type for the middle control. */
    action: string;
    /** Translation key; the control is omitted without one. */
    text?: string;
  };

  export let left: PageAction | undefined = undefined;
  export let middle: PageAction | undefined = undefined;
  export let right: PageAction | undefined = undefined;
</script>

<div class="ms-cm-pagecontrol">
  {#if left?.text}
    <button class="ms-cm-pagecontrol__left" data-i18n={left.text} type="back" value={left.action}>
      {left.text}
    </button>
  {/if}

  {#if middle?.text}
    <button class="ms-cm-pagecontrol__middle" data-i18n={middle.text} type={middle.action}>
      {middle.text}
    </button>
  {/if}

  {#if right?.text}
    <!-- The final step commits the character rather than navigating. -->
    <button
      class="ms-cm-pagecontrol__right"
      data-i18n={right.text}
      type={right.action === "finish" ? "finish" : "back"}
      value={right.action === "finish" ? "newcharacter" : right.action}
    >
      {right.text}
    </button>
  {/if}
</div>

<style lang="scss">
.ms-cm-pagecontrol {
  display: grid;
  position: sticky;
  z-index: 1;
  bottom: var(--ms-space-lg);
  grid-template-columns: repeat(3, auto);
  gap: var(--ms-space-md);
  align-items: center;
  justify-content: center;

  margin: var(--ms-space-lg) auto 0;
  border: var(--ms-border-width) solid var(--ms-border);
  border-radius: var(--ms-radius-pill);
  width: fit-content;
  padding: var(--ms-space-sm) var(--ms-space-lg);

  background: var(--ms-surface);
}

.ms-cm-pagecontrol__left,
.ms-cm-pagecontrol__middle,
.ms-cm-pagecontrol__right {
  @extend %ms-btn-reset;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: var(--ms-border-width) solid var(--ms-border);
  border-radius: var(--ms-radius-pill);
  padding: var(--ms-space-sm) var(--ms-space-xl);

  background: var(--ms-inverse);
  cursor: pointer;

  font-size: var(--ms-text-sm);
  font-family: var(--ms-font-header);
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--ms-fg-inverse);

  &:hover {
    opacity: 0.85;
  }
}

// Cancel sits outlined in the accent colour rather than filled, so it does
// not read as equal in weight to moving forward or back.
.ms-cm-pagecontrol__middle {
  border-color: var(--ms-accent);

  background: none;

  color: var(--ms-accent);
}
</style>
