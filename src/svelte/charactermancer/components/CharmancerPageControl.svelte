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
