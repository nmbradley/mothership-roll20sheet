<script lang="ts">
  export let title: string;
  export let body: string;
  /** The class slide spans its guide text across both panel columns. */
  export let isWide: boolean = false;
</script>

<h2 class="ms-cm-guidetitle" data-i18n={title}>{title}</h2>
<p class={isWide ? "ms-cm-guidetext--span2" : "ms-cm-guidetext"} data-i18n={body}></p>
