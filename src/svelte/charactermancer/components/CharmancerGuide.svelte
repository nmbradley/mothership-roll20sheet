<script lang="ts">
  export let title: string;
  export let body: string;
  /** The class slide spans its guide text across both panel columns. */
  export let isWide: boolean = false;
</script>

<h2 class="ms-cm-guidetitle" data-i18n={title}>{title}</h2>
<p class={isWide ? "ms-cm-guidetext--span2" : "ms-cm-guidetext"} data-i18n={body}></p>

<style lang="scss">
.ms-cm-guidetitle {
  margin: 0 0 var(--ms-space-md);

  font-size: var(--ms-text-lg);
  font-family: var(--ms-font-header);
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: inherit;
  font-stretch: var(--ms-stretch-label);
}

// The class slide's guide spans both panel columns instead of sitting inside
// one, so the two never appear on the same element -- each is a complete rule.
.ms-cm-guidetext,
.ms-cm-guidetext--span2 {
  margin: 0 0 var(--ms-space-md);

  font-size: var(--ms-text-md);
  line-height: 1.35;
  font-family: var(--ms-font-body);
  font-weight: 400;
  text-align: center;
  color: inherit;
}

.ms-cm-guidetext--span2 {
  grid-column: 1 / -1;
}
</style>
