<script lang="ts">
  export let action: string;
  export let label: string = "";
  export let value: string;

  const buttonClass = {
    "button": true,
    "button--roll": true,
  };

  const labelClass = {
    button__label: true,
  };
</script>

<button class={buttonClass} type="roll" name="roll_{action}" {value}>
  {#if label}
    <span class={labelClass} data-i18n={label}>{label}</span>
  {/if}
  <slot />
</button>
