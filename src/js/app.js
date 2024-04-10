import ImageViewer from './ImageViewer.svelte';

const $viewer = document.querySelector('#viewer');

// only handling single manifests currently
const config = DLXS.mirador_config.windows[0];
const manifestId = config.manifestId;
const canvasIndex = config.canvasIndex;

// const manifestId = $viewer.dataset.manifestId;
// const canvasIndex = parseInt($viewer.dataset.canvasIndex || '1', 10);

const hasPageText = $viewer.dataset.hasPageText == 'true';
const useThumbnails = $viewer.dataset.useThumbnails != 'false';
const allowFullscreen = $viewer.dataset.allowFullscreen != 'false';
const pageType = $viewer.dataset.pageType || 'Scan';
const q = JSON.parse($viewer.dataset.q || '[]');

new ImageViewer({
  target: $viewer,
  props: {
    manifestId,
    canvasIndex,
    hasPageText,
    useThumbnails,
    allowFullscreen,
    pageType,
    q
  }
})