<script>
  import ImageTools from './ImageTools.svelte';

  import OpenSeadragon from 'openseadragon';
  
  export let canvasIndex;
  export let tileSources;
  export let buttons;
  // export let viewerWidth = 1024;
  export let viewerSizeMaxWidth = null;
  export let viewerSizeMaxHeight = null;

  let dragonEl;
  let dragon;

  export function instance() {
    return dragon;
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
      showNavigationControl: true,
      zoomInButton: buttons.zoomIn, // btnZoomIn,
      zoomOutButton: buttons.zoomOut, // btnZoomOut,
      homeButton: buttons.home, // btnHome,
      nextButton: buttons.nextCanvas, // btnNextCanvas,
      previousButton: buttons.previousCanvas, // btnPreviousCanvas,
      sequenceMode: tileSources.length > 1,
      tileSources: tileSources,
      initialPage: canvasIndex - 1,
      preserveViewport: true,
      preserveImageSizeOnResize: true,
    });
    dragonEl.osd = dragon;

    dragon.addHandler('canvas-scroll', (event) => {
      event.preventDefaultAction = false;
      event.preventDefault = false;
    });

    window.dragon = dragon;
    
  }

</script>

<div bind:this={dragonEl} class="image-viewer-wrap" 
  style:--seadragon-container-width={viewerSizeMaxWidth}
  style:--seadragon-container-height={viewerSizeMaxHeight}
  >
  <ImageTools {dragon} {dragonEl}></ImageTools>
</div>

<style>

  .image-viewer-wrap {
    background: inherit;
    position: relative;
    max-height: 100%;
    height: 100%;
    width: 100%;
  }

  /* calc(var(--left, 0) * 1px); */
  /* calc(var(--top, 0) * 1px); */
  :global(.image-viewer-wrap .openseadragon-container) {
    width: var(--seadragon-container-width, 100%) !important;
    height: var(--seadragon-container-height, 100%) !important;
    left: 50% !important; 
    top: 50% !important;
    transform: translateX(-50%) translateY(-50%) !important;
  }

</style>