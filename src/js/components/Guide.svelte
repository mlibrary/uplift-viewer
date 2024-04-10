<script>
  import { afterUpdate, tick, onMount } from 'svelte';
  
  export let pageType = 'Scan';
  export let canvases;
  export let canvasRangeMap;
  export let ranges;
  export let canvasIndex;
  export let useThumbnails = true;
  export let gotoCanvasId = function() {};

  let detailsGroupEl;
  let tabGroups = {};
  let currentTabName = 'items';
  let initialized = {items: {}, ranges: {}};
  let customElementsLoaded = false;

  let lastCanvasIndex;

  const focus = async function(node) {
    await tick();
    // console.log("-- focus", node, node.querySelector('li.active'));
    setTimeout(() => {
      scrollItemIntoView(true);
    }, 100)
  }
  
  const updateTabGroupScroll = function(event) {
    console.log("-- update.tab.group.scroll", event);
    currentTabName = event.detail.name;
    setTimeout(() => {
      scrollItemIntoView(true);
    }, 100);
  }
  const openCanvas = function(canvas, idx) {}

  const findcanvasIndex = function(canvasId) {
    const idx = canvases.findIndex((c) => c.id == canvasId);
    return idx;
  }

  const getCanvasLabel = function(canvas) {
    let label = canvas.getLabel().getValue();
    if ( label ) {
      return label;
    }
    return `${pageType} ${canvas.index + 1}`;
  }

  const scrollItemIntoView = function(force=false) {
    window.detailsGroupEl = detailsGroupEl;
    if ( ! detailsGroupEl.shadowRoot ) { return ; }
    const slot = detailsGroupEl.shadowRoot.querySelector('slot[part="body"]');

    console.log("-- scrollItemIntoView", lastCanvasIndex, canvasIndex);
    if ( lastCanvasIndex === undefined ) {
      // lastCanvasIndex = canvasIndex;
      // return;
    }
    if ( lastCanvasIndex == canvasIndex && ! force) {
      return;
    }

    lastCanvasIndex = canvasIndex;
    let focusCanvasIndex = canvasIndex;
    if ( currentTabName == 'ranges' ) {
      console.log("-- scrollItemIntoView ranges", focusCanvasIndex, canvasRangeMap[focusCanvasIndex]);
      focusCanvasIndex = canvasRangeMap[focusCanvasIndex];
    } else {
      console.log("-- scrollItemIntoView items", focusCanvasIndex);
    }
    let el = initialized[currentTabName][focusCanvasIndex];
    console.log("-- scrollItemIntoView focusing", el);

    // console.log("-- scroll.item.into.view.check", el.offsetTop, slot.scrollTop, el.offsetTop < slot.scrollTop, el.offsetTop > ( slot.scrollTop + slot.clientHeight ));
    if ( el.offsetTop < slot.scrollTop || 
         el.offsetTop > ( slot.scrollTop + slot.clientHeight ) ) {
        let y = Math.max(0, el.offsetTop - ( slot.clientHeight * 0.25 ));
        // console.log("-- scroll.item.into.view.y", y);
        slot.scrollTo(0, y);
    }

    // if ( el.scrollIntoViewIfNeeded ) {
    //   el.scrollIntoViewIfNeeded();
    // } else {
    //   el.scrollIntoView();
    // }
  }

  $: if ( canvasIndex && initialized['items'][canvases.length - 1] && customElementsLoaded ) {
    scrollItemIntoView();
  }

  onMount(async () => {
    await Promise.allSettled([
        customElements.whenDefined('sl-tab-group'),
        customElements.whenDefined('sl-tab'),
        customElements.whenDefined('sl-tab-panel')
    ]);
    customElementsLoaded = true;
  })
</script>

<div class="guide--container">
    <sl-tab-group bind:this={detailsGroupEl} on:sl-tab-show={updateTabGroupScroll}>
      <sl-tab slot="nav" panel="items">{pageType}s</sl-tab>
      {#if ranges}
      <sl-tab slot="nav" panel="ranges">Index</sl-tab>
      {/if}

      <sl-tab-panel name="items">
        {#if customElementsLoaded}
        <div style="height: 100%; overflow: auto;" bind:this={tabGroups.items} use:focus>
          <ul class="list-unstyled tab-group-ranges" style="margin: 0rem;">
            {#each canvases as canvas, idx (canvas.id)}
              {@const image = canvas.getImages()[0]}
              {@const imageId = image.getResource().getServices()[0].id}
              <li class="mb-0" class:active={idx == canvasIndex} bind:this={initialized['items'][idx]}>
                <button class="flex flex-flow-row flex-start w-100 canvas" style="gap: 1rem;"
                  type="button"
                  on:click={gotoCanvasId(canvas.id)}
                  data-canvas-idx={idx}>
                  <div class="sequence-badge">
                    <span class="visually-hidden">Scan </span>
                    <span><span aria-hidden="true">#</span>{idx + 1}</span>
                  </div>
                  {#if useThumbnails}
                  <div style="flex-basis: 50px; flex-shrink: 0;" class="flex justify-end">
                  <img loading="lazy" src="{imageId}/full/,150/0/default.jpg" alt="" class="border" style="width: 50px;" />
                  </div>
                  {/if}
                  <p class="text-xxx-small m-0" style="font-weight: normal;">{getCanvasLabel(canvas)}</p>
                </button>
              </li>
            {/each}
          </ul>
        </div>
        {/if}         
      </sl-tab-panel>
      {#if ranges}
        <sl-tab-panel name="ranges">
          <div use:focus>
            <ul class="tab-group-ranges" bind:this={tabGroups.ranges}>
              {#each ranges as range}
                {@const label = range.getLabel().getValue()}
                {@const canvasId = range.getCanvasIds()[0]}
                {@const thiscanvasIndex = findcanvasIndex(canvasId)}
                <li class="p-0 mb-0" class:active={canvasRangeMap[canvasIndex] == thiscanvasIndex}
                   bind:this={initialized['ranges'][thiscanvasIndex]}
                   data-idx={thiscanvasIndex}>
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

  li.active {
    scroll-margin-top: 2rem;
  }

  .sequence-badge {
    font-size: 12px;
    padding: 8px;
    /* background: #ddd; */
    background: #fff;
    color: #000;
    font-family: monospace;
    border-radius: 8px;
    opacity: 0.75;
    border: 1px solid #ddd;
    text-wrap: nowrap;
  }

  li:hover .sequence-badge {
    opacity: 1.0;
  }

</style>