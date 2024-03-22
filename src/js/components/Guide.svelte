<script>
  export let pageType = 'Scan';
  export let canvases;
  export let canvasRangeMap;
  export let ranges;
  export let canvasIndex;
  export let useThumbnails = true;
  export let gotoCanvasId = function() {};

  let detailsGroupEl;
  let tabGroups = {};
  
  const updateTabGroupScroll = function() {}
  const openCanvas = function(canvas, idx) {}

  const findcanvasIndex = function(canvasId) {
    const idx = canvases.findIndex((c) => c.id == canvasId);
    return idx + 1;
  }

  const getCanvasLabel = function(canvas) {
    let label = canvas.getLabel().getValue();
    if ( label ) {
      return label;
    }
    return `${pageType} ${canvas.index + 1}`;
  }
</script>

<div class="guide--container">
    <sl-tab-group bind:this={detailsGroupEl} on:sl-tab-show={updateTabGroupScroll}>
      <sl-tab slot="nav" panel="items">{pageType}s</sl-tab>
      {#if ranges}
      <sl-tab slot="nav" panel="ranges">Index</sl-tab>
      {/if}

      <sl-tab-panel name="items">
        <div style="height: 100%; overflow: auto;" bind:this={tabGroups.items}>
          <ul class="list-unstyled tab-group-ranges" style="margin: 0rem;">
            {#each canvases as canvas, idx (canvas.id)}
              {@const image = canvas.getImages()[0]}
              {@const imageId = image.getResource().getServices()[0].id}
              <li class="mb-0" class:active={idx + 1 == canvasIndex}>
                <button class="flex flex-flow-row flex-start w-100 canvas"
                  type="button"
                  on:click={gotoCanvasId(canvas.id)}
                  data-canvas-idx={idx + 1}>
                  {#if useThumbnails}
                  <img loading="lazy" src="{imageId}/full/,150/0/default.jpg" alt="" class="border" style="height: 50px" />
                  {/if}
                  <p class="text-xxx-small m-0" style="font-weight: normal;">{getCanvasLabel(canvas)}</p>
                </button>
              </li>
            {/each}
          </ul>
        </div>          
      </sl-tab-panel>
      {#if ranges}
        <sl-tab-panel name="ranges">
          <div>
            <ul class="tab-group-ranges" bind:this={tabGroups.ranges}>
              {#each ranges as range}
                {@const label = range.getLabel().getValue()}
                {@const canvasId = range.getCanvasIds()[0]}
                {@const thiscanvasIndex = findcanvasIndex(canvasId)}
                <li class="p-0 mb-0" class:active={canvasRangeMap[canvasIndex] == thiscanvasIndex}>
                  <button class="canvas flex" type="button"
                    data-canvas-idx={thiscanvasIndex} on:click={gotoCanvasId(canvasId)}>
                    {label}
                  </button>
                </li>
              {/each}
            </ul>
          </div>
        </sl-tab-panel>
      {/if}
    </sl-tab-group>  
</div>

<style>
  .guide--container {
    max-height: 100%; 
    padding: 0rem; 
    display: grid; 
    grid-template-rows: minmax(0, 1fr);
  }

  button.canvas {
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.5rem;
    background: inherit;
    margin-bottom: 0;
    text-align: left;
    font-weight: normal;
    width: 100%;

    border: none;
  }

  button.canvas:hover, button.canvas:active,
  a.canvas:hover, a.canvas:active {
    background: var(--color-teal-100);
  }

  .tab-group-ranges li + li {
    border-top: 1px solid var(--color-neutral-100);
  }

  sl-tab-group sl-tab {
    margin-top: 4px;
  }

  sl-tab-group sl-tab:first-child {
    margin-left: 4px;
  }

  sl-tab-group::part(base) {
    display: grid !important;
    grid-template-rows: min-content 1fr;
    max-height: 100%;
    overflow: hidden;
  }

  button {
    cursor: pointer;
  }

</style>