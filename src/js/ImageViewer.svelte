<script>
  import { onMount } from 'svelte';
  import * as manifesto from 'manifesto.js';

  import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import SeadragonViewer from './components/SeadragonViewer.svelte';
  import ImageViewerHeader from './components/ImageViewerHeader.svelte';
  import Guide from './components/Guide.svelte';

  export let manifestId;
  export let canvasIndex = 1;
  export let hasPageText = false;
  export let useThumbnails = true;
  export let allowFullscreen = true;
  export let pageType = 'Scan';

  let initialized = false;
  let manifest;
  let canvases;
  let tileSources;
  let ranges;
  let rangeIdx = 0;
  let canvasRangeMap = {};
  let lastcanvasIndex;

  let q1;

  let viewerEl;

  let inPageTransition = true;

  let panelTabs = {};
  panelTabs.pages = true;
  panelTabs.image = true;
  panelTabs.plaintext = false;
  panelTabs.hasPageText = hasPageText;

  let buttons = {};
  
  let viewerWidth;
  let resizeObserver;
  const onResize = function() {
    const entry = event.detail.entries.at(-1);
    if ( ! entry ) { return ; }
    console.log("-- on.resize", entry.contentRect);
    viewerWidth = entry.contentRect.width;
    if ( viewerWidth < 700 && panelTabs.image && panelTabs.plaintext ) {
      panelTabs.plaintext = false;
    }
  };

  let dragonView;

  /** */
  function getInfoUrl(canvas) {
    let image = canvas.getImages()[0];
    let imageId = image.getResource().getServices()[0].id;
    return `${imageId}/info.json`;
  }

  function findcanvasIndex(canvasId) {
    const idx = canvases.findIndex((c) => c.id == canvasId);
    return idx;
  }

  function gotoCanvasId(canvasId) {
    const canvas = canvases.find((c) => c.id == canvasId);
    const idx = canvases.findIndex((c) => c.id == canvasId);
    canvasIndex = idx;
    dragonView.goToPage(idx);
  }

  function onCanvasChange(canvas) {
    const imageId = canvas.getImages()[0].getResource().getServices()[0].id;
    const identifier = (imageId.split('/')).pop();
    console.log("-- on.canvas.change", identifier);
    if ( ! (window.parent == window) ) {
      window.top.postMessage({ 
        event: 'updateMetadata', 
        canvasId: canvas.id, 
        identifier: identifier, 
        label: canvas.getLabel().getValue(), 
      }, '*');
    }
  }

  let isFullscreen = false;
  function toggleFullscreen() {
    if ( document.fullscreenElement ) {
      console.log("toggle.fullscreen exit", document.fullscreenElement);
      // isFullscreen = false;
      document.exitFullscreen();
    }
    if (viewerEl.requestFullscreen) {
      console.log("toggle.fullscreen", viewerEl.requestFullscreen)
      viewerEl.requestFullscreen();
      // isFullscreen = true;
    }
  }

  function onFullscreenChange(event) {
    console.log("on.fullscreen.change", document.fullscreenElement);
    isFullscreen = document.fullscreenElement != null;
  }

  /** */
  $: if ( ! manifest ) {
    setTimeout(() => {
    manifesto.loadManifest(manifestId).then((data) => {
      manifest = manifesto.parseManifest(data);
      window.manifest = manifest;
      canvases = manifest.getSequences()[0].getCanvases();
      panelTabs.pages = canvases.length > 1;
      tileSources = [];
      canvases.forEach((canvas) => {
        tileSources.push(getInfoUrl(canvas));
      })
      let range = manifest.getTopRanges();
      let tmp = [];
      if ( range.length ) {
        ranges = range[0].getRanges();
        ranges.forEach((r) => {
          const canvasId = r.getCanvasIds()[0];
          const idx = findcanvasIndex(canvasId);
          tmp.push(idx);
        })

        console.log("-- grouping ranges", tmp);
        let i = tmp.shift();
        let j = i;
        while ( tmp.length ) {
          let k = tmp.shift();
          for(let s = j; s < k; s++) {
            canvasRangeMap[s] = j;
          }
          j = k;
        }
        for(let s = j; s <= canvases.length; s++){
          canvasRangeMap[s]= j;
        }
        console.log("-- grouping ranges", canvasRangeMap);
      }
      initialized = true;
      console.log("-- initialized");
    });
    }, 0)
  }

</script>

<sl-resize-observer bind:this={resizeObserver} on:sl-resize={onResize}>
  <div class="viewer--container" bind:this={viewerEl} on:fullscreenchange={onFullscreenChange}>
    {#if initialized}
    <ImageViewerHeader {manifest} {canvases} {hasPageText} {buttons} bind:panelTabs={panelTabs} {viewerWidth}>
      <svelte:fragment slot="fullscreen">
        {#if allowFullscreen}
        <sl-tooltip content={isFullscreen ? 'Exit fullscreen' : 'Toggle fullscreen'} data-slot="fullscreen">
          <button 
            type="button" 
            class="button button--ghost button--square" 
            class:active={isFullscreen}
            on:click={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Toggle fullscreen'}>
            {#if isFullscreen}
            <span class="material-icons" aria-hidden="true">close_fullscreen</span>
            {:else}
            <span class="material-icons" aria-hidden="true">fullscreen</span>
            {/if}
          </button>
        </sl-tooltip>
        {/if}
      </svelte:fragment>
    </ImageViewerHeader>
    <PaneGroup direction="horizontal">
      <Pane defaultSize={80} class="order-2">
        {#if true}
        <SeadragonViewer 
          {manifest} 
          {canvases} 
          {tileSources} 
          {hasPageText} 
          {buttons} 
          {viewerWidth}
          {onCanvasChange}
          bind:this={dragonView}
          bind:canvasIndex={canvasIndex} 
          bind:panelTabs={panelTabs}></SeadragonViewer>
          {/if}
      </Pane>
      <Pane defaultSize={20} maxSize={50} class="viewer--sidebar order-1 {panelTabs.pages ? '' : 'hidden'}">
        <Guide 
          {pageType}
          {canvases} 
          {ranges} 
          {canvasRangeMap} 
          {canvasIndex}
          {gotoCanvasId}
          {useThumbnails}></Guide>
      </Pane>
    </PaneGroup>
    {:else}
    <div class="fetching visible">
      <div class="loader"></div>
    </div>
    {/if}
  </div>
</sl-resize-observer>



<style>
  .viewer--container {
    height: 100%;
    width: 100%;
    background: var(--color-neutral-200);
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
    display: grid;
    grid-template-rows: min-content minmax(0, 1fr);

    position: relative;
  }

  .initializing {
    grid-row: 1/3;
    background: var(--color-maize-100);
    color: var(--color-neutral-500);
  }

</style>