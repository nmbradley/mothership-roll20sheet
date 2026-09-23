<script lang="ts">
  export let title;
</script>

<h2 class="header header--section" data-i18n={title}>{title}</h2>

<style lang="scss">
.header {
  margin: 0;

  color: inherit;

  &--section {
    margin-bottom: var(--ms-space-md);

    font-size: var(--ms-text-lg);
    font-family: var(--ms-font-header);
    font-weight: 800;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    font-stretch: var(--ms-stretch-label);
  }
}
</style>
