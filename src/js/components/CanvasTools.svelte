<script>
  export let buttons;
  export let canvases;
  export let canvasIdx;
  export let lastCanvasIdx;
  export let viewingDirection = 'left-to-right';
  export let jumpToCanvas = function() {};

  let nextItemLabel = 'Next item';
  let previousItemLabel = 'Previous item';
  $: nextItemRotation = viewingDirection == 'left-to-right' ? '90deg' : '-90deg';
  $: previousItemRotation = viewingDirection == 'left-to-right' ? '-90deg' : '90deg';

</script>

<div class="image-viewer-toolbar bg-light">
  <sl-tooltip content="Zoom in">
    <button type="button" class="button button--ghost button--square" aria-label="Zoom in" bind:this={buttons.zoomIn}>
      <span class="material-icons">add_circle_outline</span>
    </button>
  </sl-tooltip>
  <sl-tooltip content="Zoom out">
    <button type="button" class="button button--ghost button--square" aria-label="Zoom out" bind:this={buttons.zoomOut}>
      <span class="material-icons">remove_circle_outline</span>
    </button>
  </sl-tooltip>
  <sl-tooltip content="Reset zoom">
    <button type="button" class="button button--ghost button--square" aria-label="Reset zoom" bind:this={buttons.home}>
      <span class="material-icons">home</span>
    </button>
  </sl-tooltip>
  <!-- <button type="button" class="button button--ghost button--square" bind:this={btnFullPage}>
    <span class="material-icons">fullscreen</span>
  </button> -->
  <div class="toolbar-separator"></div>
  <div class="flex flex-flow-row flex-align-center jump-to-seq">
    <label for="jumpToSeq" class="col-form-label">#</label>
    <input name="seq" id="jumpToSeq" type="text" bind:value={canvasIdx} on:focus={() => lastCanvasIdx = canvasIdx} on:change={jumpToCanvas} />
    <span> / {canvases.length}</span>
  </div>
  <div 
    class="flex flex-flow-row flex-align-center" 
    dir={viewingDirection == 'right-to-left' ? 'rtl' : 'ltr'}
    style="gap: 0.125rem">
    <sl-tooltip content={previousItemLabel} hoist>
      <button type="button" class="button button--ghost button--square" aria-label={previousItemLabel} bind:this={buttons.previousCanvas}>
        <span class="material-icons" style="transform: rotate({previousItemRotation});">arrow_circle_up</span>
      </button>
    </sl-tooltip>
    <sl-tooltip content={nextItemLabel} hoist>
      <button type="button" class="button button--ghost button--square" aria-label={nextItemLabel} bind:this={buttons.nextCanvas}>
        <span class="material-icons" style="transform: rotate({nextItemRotation});">arrow_circle_up</span>
      </button>
    </sl-tooltip>
  </div>
</div>

<style>
  .image-viewer-toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.25rem;
  }

  .image-viewer-toolbar button {
    line-height: 0;
    margin: 0;
  }

  .toolbar-separator {
    width: 1px; 
    height: 50%; 
    background: #999; 
    margin: 0 0.25rem;
  }

  .jump-to-seq {
     gap: 0.125rem;
     font-size: 0.875rem;
  }

  .jump-to-seq span {
    text-wrap: nowrap; 
    padding: 1px 0; 
    border: 2px solid transparent;   
  }

  input[name="seq"] {
    width: 4ch; 
    text-align: center; 
    font-size: 1em;
  }

</style>