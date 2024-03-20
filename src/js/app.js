import ImageViewer from './ImageViewer.svelte';

const $viewer = document.querySelector('#viewer');
const manifestUrl = $viewer.dataset.manifestUrl;
const canvasIdx = parseInt($viewer.dataset.canvasIdx || '1', 10);
const hasPageText = $viewer.dataset.hasPageText == 'true';
const useThumbnails = $viewer.dataset.useThumbnails != 'false';

new ImageViewer({
  target: $viewer,
  props: {
    manifestUrl,
    canvasIdx,
    hasPageText,
    useThumbnails
  }
})