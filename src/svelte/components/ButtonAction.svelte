<script lang="ts">
  export let action: string;
  export let label: string = "";

  const buttonClass = {
    "button": true,
    "button--action": true,
  };

  const labelClass = {
    button__label: true,
  };
</script>

<button class={buttonClass} type="action" name="act_{action}">
  {#if label}
    <span class={labelClass} data-i18n={label}>{label}</span>
  {/if}
  <slot />
</button>
