import ImageViewer from './ImageViewer.svelte';

function viewer(config, target) {
  const $viewer = document.querySelector(target);

  // only handling single manifests currently
  const manifestId = config.manifestId;
  const canvasIndex = config.canvasIndex;

  // const manifestId = $viewer.dataset.manifestId;
  // const canvasIndex = parseInt($viewer.dataset.canvasIndex || '1', 10);

  const hasPageText = $viewer.dataset.hasPageText == 'true';
  const useThumbnails = $viewer.dataset.useThumbnails != 'false';
  const allowFullscreen = $viewer.dataset.allowFullscreen != 'false';

  return new ImageViewer({
    target: $viewer,
    props: {
      manifestId,
      canvasIndex,
      hasPageText,
      useThumbnails,
      allowFullscreen,
    }
  })
}

const DLXS = window.DLXS || {};
DLXS.viewer = viewer;
console.log("AHOY", DLXS);

export default {
  viewer,
}

