<script>
  export let manifest;
  export let panelTabs;
  export let hasPageText;
  export let viewerWidth = 1024;

  // export let buttons;
  // export let toggleFullscreen = function() {}


</script>

<div class="header flex flex-flow-row flex-align-center flex-space-between">
  <span>{manifest?.getLabel()?.getValue()}</span>
  <div class="header--controls flex flex-flow-row flex-align-center justify-end">
    <div class="button--group">
      <sl-tooltip content="Toggle pages">
        <button class="button button--ghost border-rounded-left" 
          class:active={panelTabs.pages}
          on:click={() => { panelTabs.pages = ! panelTabs.pages; }}>
          <span class="material-icons">view_list</span>
          <span>Pages</span>
        </button>
      </sl-tooltip>
      <sl-tooltip content="Toggle image">
      <button class="button button--ghost" 
        class:active={panelTabs.image}
        on:click={() => { panelTabs.image = ! panelTabs.image; if ( panelTabs.plaintext && panelTabs.image && viewerWidth < 800 ) { panelTabs.plaintext = false; } }}>
        <span class="material-icons">image</span>
        <span>Image</span>
      </button>
      </sl-tooltip>
      <sl-tooltip content="Toggle text">
      <button class="button button--ghost border-rounded-right" 
        class:active={panelTabs.plaintext}
        on:click={() => { panelTabs.plaintext = ! panelTabs.plaintext; if ( panelTabs.image && panelTabs.plaintext && viewerWidth < 800 ) { panelTabs.image = false; } }}
        disabled={!hasPageText}>
        <span class="material-icons">article</span>
        <span>Text</span>
      </button>
      </sl-tooltip>
    </div>
    <slot name="fullscreen"></slot>
  </div>
</div>

<style>
  .header {
    background: white;
    padding: 0.25rem 1rem;
    box-shadow: 0px 4px 15px -3px rgba(0,0,0,0.5);
    border-top: 2px solid var(--color-teal-300);
    z-index: 10;
  }  
</style>