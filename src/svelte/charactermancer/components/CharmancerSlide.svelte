<script lang="ts">
  export let name = "";
</script>

<charmancer class="sheet-charmancer-{name}">
  <div class="ms-cm-wrapper">
    <slot></slot>
  </div>
</charmancer>

<style lang="scss">
%ms-cm-panel-base {
  @extend %ms-panel;

  border: var(--ms-border-width-thick) solid var(--ms-border);

  background: var(--ms-surface);

  color: var(--ms-fg);
}

.ms-cm-wrapper {
  display: grid;
  gap: var(--ms-space-lg);

  min-height: 450px;
  padding: var(--ms-space-lg);
}

.ms-cm-container {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: var(--ms-space-lg);
  align-items: start;
}

.ms-cm-panel {
  @extend %ms-cm-panel-base;
}

.ms-cm-panel--full {
  @extend %ms-cm-panel-base;
  grid-column: 1 / -1;

  text-align: center;
}

.ms-cm-panel--classes {
  @extend %ms-cm-panel-base;
  grid-column: 1 / -1;

  background: var(--ms-inverse);

  color: var(--ms-fg-inverse);
}

.ms-cm-panel--skills {
  @extend %ms-cm-panel-base;
  display: grid;
  position: relative;
  grid-template-columns: repeat(3, 1fr);
  grid-column: 1 / -1;
  gap: var(--ms-space-lg);
}

.ms-cm-center {
  display: grid;
  justify-items: center;

  margin-top: var(--ms-space-lg);
}
</style>
