<script>
  export let manifest;
  export let panelTabs;
  export let hasPageText;
  export let viewerWidth = 1024;

  let showWindowTitle = ( (window.parent == window) );


</script>

<div class="header flex flex-flow-row flex-align-center flex-space-between">
  <span>
    {#if showWindowTitle}{manifest?.getLabel()?.getValue()}{/if}
  </span>
  <div class="header--controls flex flex-flow-row flex-align-center justify-end">
    <div class="toggle--group">
      <div class="toggle" class:toggled={panelTabs.pages}>
        <sl-tooltip content="Toggle pages" data-active={panelTabs.pages}>
          <button class="button button--ghost" 
            aria-pressed={panelTabs.pages.toString()}
            on:click={() => { panelTabs.pages = ! panelTabs.pages; }}>
            <span class="material-icons" aria-hidden="true">view_list</span>
            <span>Pages</span>
          </button>
        </sl-tooltip>
      </div>
      <div class="toggle" class:toggled={panelTabs.image}>
        <sl-tooltip content="Toggle image" data-active={panelTabs.image}>
          <button class="button button--ghost"
            aria-pressed={panelTabs.image.toString()}
            on:click={() => { panelTabs.image = ! panelTabs.image; if ( panelTabs.plaintext && panelTabs.image && viewerWidth < 800 ) { panelTabs.plaintext = false; } }}>
            <span class="material-icons" aria-hidden="true">image</span>
            <span>Image</span>
          </button>
        </sl-tooltip>
      </div>
      <div class="toggle" class:toggled={panelTabs.plaintext}>
        <sl-tooltip content="Toggle text" data-active={panelTabs.plaintext}>
          <button class="button button--ghost border-rounded-right" 
            aria-pressed={panelTabs.plaintext.toString()}
            on:click={() => { panelTabs.plaintext = ! panelTabs.plaintext; if ( panelTabs.image && panelTabs.plaintext && viewerWidth < 800 ) { panelTabs.image = false; } }}
            disabled={!hasPageText}>
            <span class="material-icons" aria-hidden="true">article</span>
            <span>Text</span>
          </button>
        </sl-tooltip>
      </div>
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

  .toggle--group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .toggle {
    border: 1px solid var(--color-neutral-500);
  }

  .toggle:first-child {
    border-top-left-radius: var(--radius-default);
    border-bottom-left-radius: var(--radius-default);
    /* border-right-width: 0; */
  }

  .toggle + .toggle {
    border-left-width: 0;
  }

  .toggled {
    background: var(--color-teal-100);
  }

  .toggled button {
    color: var(--color-teal-400);
  }

  .toggle:last-child {
    border-top-right-radius: var(--radius-default);
    border-bottom-right-radius: var(--radius-default);
    /* border-left-width: 0; */
  }

  .button--ghost {
    border: none;
    margin: 0;
    background: transparent;
  }

  .toggle:hover, .toggle:focus-within {
    z-index: 1;
  }
</style>