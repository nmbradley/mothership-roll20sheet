<script>
    export let mode = "light"; // "light" | "light-grey" | "mid-grey" | "dark"
    export let corner = "medium"; // "small" | "medium" | "large"
</script>

<div class="frame frame--mode-{mode} frame--corner-{corner}">
    <slot />
</div>

<style lang="scss">
    .frame {
        padding: 1rem;
        box-sizing: border-box;

        /* Modifier for corner radius */
        &--corner-small { border-radius: 4px; }
        &--corner-medium { border-radius: 8px; }
        &--corner-large { border-radius: 16px; }

        /* Modifier for color mode */
        &--mode-light {
            background: var(--color-frame-light-bg, var(--color-bg, #ffffff));
            color: var(--color-frame-light-text, var(--color-text, #000000));
            border: 3px solid var(--color-frame-light-border, var(--color-border, #000000));
        }
        &--mode-light-grey {
            background: var(--color-frame-light-grey-bg, #e0e0e0);
            color: var(--color-frame-light-grey-text, var(--color-text, #000000));
        }
        &--mode-mid-grey {
            background: var(--color-frame-mid-grey-bg, #9e9e9e);
            color: var(--color-frame-mid-grey-text, var(--color-text, #000000));
        }
        &--mode-dark {
            background: var(--color-frame-dark-bg, #000000);
            color: var(--color-frame-dark-text, #ffffff);
            border: 3px solid var(--color-frame-dark-border, #000000);
        }
    }
</style>
