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
  export let q1 = null;
  export let buttons;
  export let viewerWidth = 1024;

  export let onCanvasChange = function() {};

  let dragonEl;
  let dragon;
  // let dragonButtons = {};


  let plainTextEl;
  let plainText;

  let lastcanvasIndex;
  let inPageTransition = true;

  const jumpToCanvas = function(event) {
    console.log("-- onCanvasChange", canvasIndex, lastcanvasIndex);
    if ( canvasIndex <= 0 ) { canvasIndex = lastcanvasIndex; }
    else if ( canvasIndex > canvases.length ) { canvasIndex = lastcanvasIndex; }
    else {
      dragon.goToPage(canvasIndex - 1);
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
    if ( lines.length < 25 ) { return ''; }
    return parsedText;
  }

  const fetchPlainText = async function(canvas) {
    const tmp = canvas.id.split('/');
    const requestUrl = new URL(canvas.id);
    const identifier = requestUrl.pathname.split('/').at(-3);
    const [ collid, idno, seq ] = identifier.split(':');

    requestUrl.pathname = '/cgi/t/text/pageviewer-idx';
    requestUrl.searchParams.set('view', 'text');
    requestUrl.searchParams.set('tpl', 'plaintext.viewer');
    requestUrl.searchParams.set('cc', collid);
    requestUrl.searchParams.set('idno', idno);
    requestUrl.searchParams.set('seq', seq);
    if ( q1 ) {
      requestUrl.searchParams.set('q1', q1);
    }
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
      showNavigationControl: true,
      zoomInButton: buttons.zoomIn, // btnZoomIn,
      zoomOutButton: buttons.zoomOut, // btnZoomOut,
      homeButton: buttons.home, // btnHome,
      nextButton: buttons.nextCanvas, // btnNextCanvas,
      previousButton: buttons.previousCanvas, // btnPreviousCanvas,
      sequenceMode: true,
      tileSources: tileSources,
      initialPage: canvasIndex - 1,
      preserveViewport: true,
    });
    dragonEl.osd = dragon;

    dragon.addHandler('page', (event) => {
      console.log('-- dragon.page', event);
      canvasIndex = event.page + 1;
      if ( hasPageText )  {
        inPageTransition = true;
        fetchPlainText(canvases[canvasIndex - 1])
          .then((value) => {
            plainText = processPlainText(value);
            inPageTransition = false;
            // hide the plaintext tab ONLY IF the image tab is visible
            if ( viewerWidth < 800 && panelTabs.image ) {
              // do nothing
            } else if ( panelTabs.image ) {
              panelTabs.plaintext = plainText != '';
            } else {
              panelTabs.plainText = true;
            }
            // headerTabs.plaintext = headerTabs.image ? plainText != '' : true;
            // headerTabs.plaintext = plainText != '';
          })
          .catch((error) => {
            console.log("fetch.plaintext error", error);
            panelTabs.plaintext = false;
            inPageTransition = false;
          })
      }

      onCanvasChange(canvases[event.page]);
    })

    window.dragon = dragon;
    
    if ( hasPageText ) {
      fetchPlainText(canvases[canvasIndex - 1])
        .then((value) => {
          plainText = processPlainText(value);
          if ( ! panelTabs.plaintext ) {
            // force the intitial state to resize
            setTimeout(() => {
              dragon.viewport.goHome(true);
            }, 100);
          }
          panelTabs.plaintext = ( viewerWidth >= 800 ) && plainText != '';
          inPageTransition = false;
        })
        .catch((error) => {
          console.log("fetch.plaintext error", error);
          panelTabs.plaintext = false;
          inPageTransition = false;
        })
    } else {
      panelTabs.plaintext = false;
      inPageTransition = false;
    }
  }

</script>

<div class="viewer--panes">
  <PaneGroup direction="horizontal" defaultSize={75} class="position-relative {inPageTransition ? 'invisible--contents' : ''}">
    <Pane defaultSize={60} class="flex {panelTabs.image ? '' : 'hidden'}">
      <div bind:this={dragonEl} class="image-viewer-wrap">
        <ImageTools {dragon} {dragonEl}></ImageTools>
      </div>
    </Pane>
    <PaneResizer class="pane--resizer {(!plainText || ( !panelTabs.image || !panelTabs.plaintext)) ? 'hidden' : ''}">
      <button aria-hidden="true" class="pane--resizer--thumb" tabindex="-1">
        <span class="material-icons" aria-hidden="true">drag_indicator</span>
      </button>
    </PaneResizer>
    <Pane defaultSize={40} class="{(( !plainText && panelTabs.image ) || !panelTabs.plaintext) ? 'hidden' : ''}">
      <div class="plaintext-wrap flex" tabindex="0" role="region" bind:this={plainTextEl}>
        {#if plainText}
          {@html plainText}
        {:else}
          <p class="blank-page">
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
    viewingDirection={manifest.getViewingDirection()}
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
    padding-top: 0;
    height: 100%;
    overflow: auto;
  }


</style>