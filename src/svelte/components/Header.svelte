<script>
    export let title;
</script>

<h2 class="header header--section" data-i18n={title}>{title}</h2>

<style lang="scss">
    .header {
        color: var(--color-header-text, var(--color-text, #000000));

        &--section {
            font-family: "Montserrat", sans-serif;
        }
    }
</style>
