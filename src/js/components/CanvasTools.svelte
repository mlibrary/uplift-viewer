<script>
  export let buttons;
  export let canvases;
  export let canvasIdx;
  export let lastCanvasIdx;
  export let jumpToCanvas = function() {};

</script>

<div class="image-viewer-toolbar bg-light">
  <sl-tooltip content="Zoom in">
  <button type="button" class="button button--ghost button--square" bind:this={buttons.zoomIn}>
    <span class="material-icons">add_circle_outline</span>
  </button>
  </sl-tooltip>
  <sl-tooltip content="Zoom out">
  <button type="button" class="button button--ghost button--square" bind:this={buttons.zoomOut}>
    <span class="material-icons">remove_circle_outline</span>
  </button>
  </sl-tooltip>
  <sl-tooltip content="Reset zoom">
  <button type="button" class="button button--ghost button--square" bind:this={buttons.home}>
    <span class="material-icons">home</span>
  </button>
  </sl-tooltip>
  <!-- <button type="button" class="button button--ghost button--square" bind:this={btnFullPage}>
    <span class="material-icons">fullscreen</span>
  </button> -->
  <div style="width: 1px; height: 50%; background: #999; margin: 0 0.25rem;"></div>
  <div class="flex flex-flow-row flex-align-center" style="gap: 0.125rem; font-size: 0.875rem;">
    <label for="jumpToSeq" class="col-form-label">#</label>
    <input class="form-control" id="jumpToSeq" type="text" style="width: 4ch; text-align: center; font-size: 1em;" bind:value={canvasIdx} on:focus={() => lastCanvasIdx = canvasIdx} on:change={jumpToCanvas} />
    <span style="text-wrap: nowrap; padding: 1px 0; border: 2px solid transparent;"> / {canvases.length}</span>
  </div>
  <sl-tooltip content="Previous Item" hoist>
  <button type="button" class="button button--ghost button--square" bind:this={buttons.previousCanvas}>
    <span class="material-icons" style="transform: rotate(-90deg);">arrow_circle_up</span>
  </button>
  </sl-tooltip>
  <sl-tooltip content="Next Item" hoist>
  <button type="button" class="button button--ghost button--square" bind:this={buttons.nextCanvas}>
    <span class="material-icons" style="transform: rotate(90deg);">arrow_circle_up</span>
  </button>
  </sl-tooltip>
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
</style>