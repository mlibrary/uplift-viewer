import InlineViewer from "./components/InlineViewer.svelte";

window.DLXS = window.DLXS || {};
DLXS.ui = DLXS.ui || {};
DLXS.ui.imageViewer = function($el, props) {
  console.log("AHOY", props);
  const viewer = new InlineViewer({
    target: $el,
    props: props
  });

  return viewer;
}
window.DLXS = DLXS;

