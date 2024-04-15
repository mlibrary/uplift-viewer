import ImageViewer from './ImageViewer.svelte';

const $viewer = document.querySelector('#viewer');

//// only handling single manifests currently
// const config = DLXS.mirador_config.windows[0];
// const manifestId = config.manifestId;
// const canvasIndex = config.canvasIndex;

const hasPageText = $viewer.dataset.hasPageText == 'true';
const useThumbnails = $viewer.dataset.useThumbnails != 'false';
const allowFullscreen = $viewer.dataset.allowFullscreen != 'false';
const pageType = $viewer.dataset.pageType || 'Scan';
const q = JSON.parse($viewer.dataset.q || '[]');
const showWindowTitle = ( (window.parent == window) ) || DLXS.mirador_config.windows.length > 1;
const panelTabsConfig = { pages: DLXS.mirador_config.windows.length == 1 };

const viewers = [];

function toggleFullscreen() {
  if ( document.fullscreenElement ) {
    console.log("toggle.fullscreen exit", document.fullscreenElement);
    document.exitFullscreen();
  }
  if ($viewer.requestFullscreen) {
    console.log("toggle.fullscreen", $viewer.requestFullscreen)
    $viewer.requestFullscreen();
  }
}

if ( allowFullscreen ) {
  $viewer.addEventListener('fullscreenchange', (event) => {
    viewers.forEach((viewer) => {
      viewer.onFullscreenChange(document.fullscreenElement != null);
    })
  })
}


DLXS.mirador_config.windows.forEach((config) => {
  const manifestId = config.manifestId;
  const canvasIndex = config.canvasIndex;

  const viewer = new ImageViewer({
    target: $viewer,
    props: {
      manifestId,
      canvasIndex,
      hasPageText,
      useThumbnails,
      allowFullscreen,
      pageType,
      q,
      showWindowTitle,
      panelTabsConfig,
      toggleFullscreen
    }
  });

  viewers.push(viewer);

})

// new ImageViewer({
//   target: $viewer,
//   props: {
//     manifestId,
//     canvasIndex,
//     hasPageText,
//     useThumbnails,
//     allowFullscreen,
//     pageType,
//     q
//   }
// });

document.body.addEventListener('scroll', (event) => {
  document.body.scrollTo(0,0);
})