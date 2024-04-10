<script>
  import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import CanvasTools from './CanvasTools.svelte';
  import ImageTools from './ImageTools.svelte';

  import OpenSeadragon from 'openseadragon';
  
  export let manifest;
  export let canvases;
  export let canvasIndex;
  export let tileSources;
  export let panelTabs;
  export let hasPageText;
  export let q = [];
  export let buttons;
  export let viewerWidth = 1024;

  export let onCanvasChange = function() {};

  let dragonEl;
  let dragon;
  // let dragonButtons = {};


  let plainTextEl;
  let plainText;
  let highlightState = 'on';

  let lastcanvasIndex;
  let inPageTransition = true;

  const toggleHilightState = function(event) {
    highlightState = highlightState == 'on' ? 'off' : 'on';
    document.documentElement.dataset.highlightState = highlightState;
  }

  const jumpToCanvas = function(event) {
    console.log("-- onCanvasChange", event.target.value, canvasIndex, lastcanvasIndex);
    let newCanvasIndex = parseInt(event.target.value, 10) - 1;
    if ( newCanvasIndex < 0 ) { newCanvasIndex = lastcanvasIndex; }
    else if ( newCanvasIndex > canvases.length ) { newCanvasIndex = lastcanvasIndex; }
    else {
      canvasIndex = newCanvasIndex;
      dragon.goToPage(canvasIndex);
    }
  }

  export function goToPage(idx) {
    inPageTransition = true;
    dragon.goToPage(idx);
  }

  const blankPage = `<section style="white-space: pre-line">
    <p  class="plaintext"></p>
  </section>`;

  const processPlainText = function(ocrText) {
    if ( ! ocrText ) { return ''; }
    const lines = ocrText.split("\n");
    if ( lines[0].indexOf('DOCTYPE') > -1 ) {
      lines.shift();
    }
    const parsedText = lines.join("\n").trim();
    if ( parsedText == blankPage ) {
      return '';
    }
    // if ( lines.length < 25 ) { return ''; }
    return parsedText;
  }

  const fetchPlainText = async function(canvas) {
    const tmp = canvas.id.split('/');
    console.log("-- fetch.plain.text", canvas.id, tmp);
    const requestUrl = new URL(canvas.id);
    const identifier = requestUrl.pathname.split('/').at(-3);
    const [ collid, idno, seq ] = identifier.split(':');

    requestUrl.pathname = '/cgi/t/text/pageviewer-idx';
    requestUrl.searchParams.set('view', 'text');
    requestUrl.searchParams.set('tpl', 'plaintext.viewer');
    requestUrl.searchParams.set('cc', collid);
    requestUrl.searchParams.set('idno', idno);
    requestUrl.searchParams.set('seq', seq);
    q.forEach((qval, qidx) => {
      requestUrl.searchParams.set(`q${qidx + 1}`, qval);
    });
    console.log("-- fetch.plaintext", identifier, requestUrl.toString());
    const resp = await fetch(requestUrl.toString(), { credentials: 'include' });
    if ( resp.status != 200 ) { return ''; }
    return resp.text();
  }

  $: if ( dragonEl !== undefined && dragon === undefined && buttons.zoomIn !== undefined ) {

    // if ( manifest.getViewingDirection() == 'right-to-left' ) {
    //   OpenSeadragon.setString('Tooltips.PreviousPage', 'Next item');
    //   OpenSeadragon.setString('Tooltips.NextPage', 'Previous item');
    // } else {
    //   OpenSeadragon.setString('Tooltips.PreviousPage', 'Previous item');
    //   OpenSeadragon.setString('Tooltips.NextPage', 'Next item');
    // }

    // suppress the default tooltips
    [ 'PreviousPage', 'NextPage', 'Home', 'ZoomIn', 'ZoomOut', 'Flip' ].forEach((key) => {
      OpenSeadragon.setString(`Tooltips.${key}`, '');
    })

    dragon = OpenSeadragon({
      element: dragonEl,
      prefixUrl: "//openseadragon.github.io/openseadragon/images/",
      gestureSettingsMouse: {
        scrollToZoom: false,
        clickToZoom: false,
        dblClickToZoom: true,
        flickEnabled: true,
        pinchRotate: true
      },
      gestureSettingsTouch: {
        pinchRotate: true
      },
      showNavigator: false,
      showNavigationControl: false,
      zoomInButton: buttons.zoomIn, // btnZoomIn,
      zoomOutButton: buttons.zoomOut, // btnZoomOut,
      homeButton: buttons.home, // btnHome,
      nextButton: buttons.nextCanvas, // btnNextCanvas,
      previousButton: buttons.previousCanvas, // btnPreviousCanvas,
      sequenceMode: true,
      tileSources: tileSources,
      initialPage: canvasIndex,
      preserveViewport: true,
      preserveImageSizeOnResize: true,
    });
    dragonEl.osd = dragon;

    dragon.addHandler('canvas-scroll', (event) => {
      event.preventDefaultAction = false;
      event.preventDefault = false;
    });

    dragon.addHandler('page', (event) => {
      console.log('-- dragon.page', event);
      canvasIndex = event.page;
      if ( ! canvases[canvasIndex] ) {
        console.log("-- dragon.page", canvasIndex, canvases);
      }
      if ( canvases[canvasIndex] && hasPageText )  {
        inPageTransition = true;
        fetchPlainText(canvases[canvasIndex])
          .then((value) => {
            plainText = processPlainText(value);
            // console.log("-- dragon.page.plaintext", plainText);
            inPageTransition = false;

            panelTabs.hasPageText = plainText != '';
          })
          .catch((error) => {
            console.log("fetch.plaintext error", error);
            panelTabs.hasPlainText = false;
            // panelTabs.plaintext = false;
            inPageTransition = false;
          })
      } else {
        inPageTransition = false;
      }

      onCanvasChange(canvases[event.page]);
    })

    window.dragon = dragon;
    
    if ( hasPageText ) {
      if ( ! canvases[canvasIndex] ) {
        console.log("-- dragon.page", canvasIndex, canvases);
      }
      fetchPlainText(canvases[canvasIndex])
        .then((value) => {
          plainText = processPlainText(value);
          // console.log("-- dragon.page.plaintext.0", plainText, value);
          
          if ( ! panelTabs.plaintext ) {
            // force the intitial state to resize
            setTimeout(() => {
              dragon.viewport.goHome(true);
            }, 100);
          }
          // panelTabs.plaintext = ( viewerWidth >= 800 ) && plainText != '';
          panelTabs.hasPageText = plainText != '';
          console.log("-- panel.tabs.hasPageText", panelTabs.hasPageText);
          inPageTransition = false;
        })
        .catch((error) => {
          console.log("fetch.plaintext error", error);
          // panelTabs.plaintext = false;
          panelTabs.hasPlainText = false;
          inPageTransition = false;
        })
    } else {
      // panelTabs.plaintext = false;
      inPageTransition = false;
    }
  }

  $: showPlainTextPanels = hasPageText && panelTabs.hasPageText && panelTabs.plaintext;
  $: if ( ! panelTabs.image && ! panelTabs.hasPageText ) { panelTabs.image = true; }
  // $: console.log("-- dragon.showPlainTextePlanels", hasPageText, panelTabs.hasPageText, panelTabs.plaintext, hasPageText && panelTabs.hasPageText && panelTabs.plaintext);

</script>

<div class="viewer--panes">
  <PaneGroup direction="horizontal" defaultSize={75} class="position-relative {inPageTransition ? 'invisible--contents' : ''}">
    <Pane defaultSize={60} class="flex {panelTabs.image ? '' : 'hidden'}">
      <div bind:this={dragonEl} class="image-viewer-wrap">
        <ImageTools {dragon} {dragonEl}></ImageTools>
      </div>
    </Pane>
    <PaneResizer class="pane--resizer {!showPlainTextPanels ? 'hidden' : ''}">
      <button aria-hidden="true" class="pane--resizer--thumb" tabindex="-1">
        <span class="material-icons" aria-hidden="true">drag_indicator</span>
      </button>
    </PaneResizer>
    <Pane defaultSize={40} class="{!showPlainTextPanels ? 'hidden' : ''}">
      <div class="plaintext-wrap" class:flex={!plainText} tabindex="0" role="region" bind:this={plainTextEl}>
        {#if plainText}
          {#if plainText.indexOf('<mark') > -1}
          <div class="highlight-tools flex flex-flow-row mb-1" style="justify-content: flex-end; position: sticky; top: 0.25rem;">
            <div class="flex flex-flow-row gap-0_25" style="width: min-content; background: #fff; padding: 0.5rem; border: 1px solid black; border-radius: 8px;">
              <sl-tooltip content="First matched term">
                <a href="#h1" class="button button--ghost m-0"><span class="material-icons" aria-hidden="true">arrow_forward</span></a>
              </sl-tooltip>
              <sl-tooltip content={`Turn highlights ${highlightState == 'on' ? 'off' : 'on'}`}>
                <button id="action-toggle-highlight" class="button button--ghost m-0" on:click={toggleHilightState}>
                  {#if highlightState == 'on'}
                  <span class="material-icons" aria-hidden="true">visibility</span>
                  {:else}
                  <span class="material-icons" aria-hidden="true">visibility_off</span>
                  {/if}
                </button>
              </sl-tooltip>
            </div>
            {#if false}
            <a href="#hl1" class="button button--ghost m-0">First matched term</a>
            <button id="action-toggle-highlight" class="button button--ghost m-0" on:click={toggleHilightState}>
              {#if highlightState == 'on'}
              <span class="material-icons" aria-hidden="true">visibility</span>
              <span>Turn highlights off</span>
              {:else}
              <span class="material-icons" aria-hidden="true">visibility_off</span>
              <span>Turn highlights on</span>
              {/if}
            </button>
            {/if}
          </div>
          {/if}
          {@html plainText}
        {:else}
          <p class="blank-page flex">
            <span class="material-icons" aria-hidden="true">hourglass_empty</span>
            This page is blank.
          </p>
        {/if}
      </div>
    </Pane>
    <div class="fetching" class:visible={inPageTransition}>
      <div class="loader"></div>
    </div>
  </PaneGroup>
  <CanvasTools 
    {canvases} 
    {buttons} 
    {jumpToCanvas}
    viewingDirection={manifest.getViewingDirection() || 'left-to-right'}
    bind:canvasIndex={canvasIndex} 
    bind:lastcanvasIndex={lastcanvasIndex}></CanvasTools>
</div>


<style>
  .viewer--panes {
    display: grid; 
    grid-template-rows: minmax(0, 1fr) min-content; 
    height: 100%;    
  }

  .image-viewer-wrap {
    background: inherit;
    position: relative;
    max-height: 100%;
    height: 100%;
    width: 100%;
  }

  .plaintext-wrap {
    background: #fff;
    padding: 1rem;
    padding-left: 1.5rem;
    /* padding-top: 0; */
    height: 100%;
    overflow: auto;
  }

</style>