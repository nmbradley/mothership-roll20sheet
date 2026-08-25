<script>
    export let action; // e.g., "roll_strength" or "launch_charmancer"
    export let label = "";
</script>

<button class="button button--action" type="action" name="act_{action}">
    {#if label}
        <span class="button__label" data-i18n={label}>{label}</span>
    {/if}
    <slot />
</button>

<style lang="scss">
    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-btn-bg, var(--color-bg, #ffffff));
        color: var(--color-btn-text, var(--color-text, #000000));
        border: 1px solid var(--color-btn-border, var(--color-border, #000000));
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        font-family: inherit;

        &:hover {
            background-color: var(--color-btn-hover-bg, var(--color-bg-hover, #e0e0e0));
            color: var(--color-btn-hover-text, var(--color-text-hover, #000000));
        }

        &--action {
            /* Action specific styling */
        }

        &__label {
            color: inherit;
        }
    }
</style>
