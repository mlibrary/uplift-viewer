<script>
  // export let buttons;
  export let dragon;
  export let dragonEl;

  let imageToolbarOpen = false;

  let fx = {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    invert: 0,
  };
  let fxToolsOpen = {
    brightness: false,
    contrast: false,
    saturate: false,
  }
  let fxFlipped = false;

  function fxRotate(delta) {
    let deg = dragon.viewport.getRotation();
    let next_deg = deg + delta;
    if ( next_deg < 0 ) { next_deg = 360 + next_deg; }
    dragon.viewport.setRotation(next_deg, true);
  }

  function updateFx(kv) {
    fx = Object.assign(fx, kv);
    let el = dragonEl.querySelector('.openseadragon-canvas');
    window.el = el;
    let filter = [];
    Object.keys(fx).forEach((key) => {
      filter.push(`${key}(${fx[key]}%)`);
    })
    el.style.filter = filter.join(' ');
    console.log("-- updateFx", kv, fx, el, filter, el.style.filter);
  }

  function revertImage() {
    updateFx({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
      invert: 0
    });
    // and rotate
    dragon.viewport.setRotation(0, true);
    // and flip
    dragon.viewport.setFlip(false);
  }
  
</script>

<div class="button--group image-tools-toolbar">
  {#if imageToolbarOpen}
    <sl-tooltip content="Rotate right">
      <button class="button button--square button--ghost"
        aria-label="Rotate right"
        on:click={() => fxRotate(90)}>
        <span class="material-icons" aria-hidden="true">rotate_right</span>
      </button>
    </sl-tooltip>
    <sl-tooltip content="Rotate left">
      <button class="button button--square button--ghost"
        aria-label="Rotate left"
        on:click={() => fxRotate(-90)}>
        <span class="material-icons" aria-hidden="true">rotate_left</span>
      </button>
    </sl-tooltip>
    <sl-tooltip content="Flip image">
      <button class="button button--square button--ghost" 
        aria-label="Flip image"
        class:active={fxFlipped}
        on:click={() => {fxFlipped = !true; dragon.viewport.toggleFlip()}}>
        <span class="material-icons" aria-hidden="true">swap_horiz</span>
      </button>
    </sl-tooltip>
    <div style="position: relative;">
      <sl-tooltip content="Adjust brightness">
        <button class="button button--square button--ghost" 
          aria-label="Adjust brightness"
          class:active={fxToolsOpen.brightness}
          on:click={() => fxToolsOpen.brightness = ! fxToolsOpen.brightness}>
          <span class="material-icons" aria-hidden="true">brightness_5</span>
        </button>
      </sl-tooltip>
      <div class="image-options" class:hidden={!fxToolsOpen.brightness}>
        <input 
          name="brightness"
          aria-label="Brightness"
          type="range" 
          orient="vertical" 
          min="0" 
          max="200" 
          aria-valuetext={`${fx.brightness}%`} 
          autocomplete="off"
          bind:value={fx.brightness} 
          on:change={(evt) => updateFx({ brightness: evt.target.value })} />
      </div>
    </div>
    <div style="position: relative">
      <sl-tooltip content="Adjust contrast">
        <button class="button button--square button--ghost" 
          aria-label="Adjust contrast"
          class:active={fxToolsOpen.contrast}
          on:click={() => fxToolsOpen.contrast = ! fxToolsOpen.contrast}>
          <span class="material-icons" aria-hidden="true">exposure</span>
        </button>
      </sl-tooltip>
      <div class="image-options" class:hidden={!fxToolsOpen.contrast}>
        <input 
          name="contrast"
          aria-label="Contrast"
          type="range" 
          orient="vertical"
          min="0" 
          max="200"
          autocomplete="off"
          aria-valuetext={`${fx.contrast}%`} 
          bind:value={fx.contrast} 
          on:change={(evt) => updateFx({ contrast: evt.target.value })} />
      </div>
    </div>
    <div style="position: relative">
      <sl-tooltip content="Adjust saturation">
        <button class="button button--square button--ghost" 
          aria-label="Adjust saturation"
          class:active={fxToolsOpen.saturate}
          on:click={() => fxToolsOpen.saturate = ! fxToolsOpen.saturate}>
          <span class="material-icons" aria-hidden="true">gradient</span>
        </button>
      </sl-tooltip>
      <div class="image-options" class:hidden={!fxToolsOpen.saturate}>
        <input 
          name="saturation"
          aria-label="Saturation"
          type="range" 
          orient="vertical" 
          min="0" 
          max="200" 
          aria-valuetext={`${fx.saturate}%`} 
          autocomplete="off"
          bind:value={fx.saturate} 
          on:change={(evt) => updateFx({ saturate: evt.target.value })} />
      </div>
    </div>
    <sl-tooltip content="Grayscale">
      <button class="button button--square button--ghost" 
        aria-label="Grayscale"
        class:active={fx.grayscale == 100}
        on:click={() => updateFx({grayscale: fx.grayscale == 100 ? 0 : 100})}>
        <span class="material-icons" aria-hidden="true">tonality</span>
      </button>
    </sl-tooltip>
    <sl-tooltip content="Invert colors">
      <button class="button button--square button--ghost" 
        aria-label="Invert colors"
        class:active={fx.invert == 100}
        on:click={() => updateFx({ invert: fx.invert == 100 ? 0 : 100 })}>
        <span class="material-icons" aria-hidden="true">invert_colors</span>
      </button>
    </sl-tooltip>
    <sl-tooltip content="Revert image">
      <button class="button button--square button--ghost" on:click={revertImage} aria-label="Revert image">
        <span class="material-icons" aria-hidden="true">replay</span>
      </button>
    </sl-tooltip>
    <sl-tooltip content="Close tools">
      <button class="button button--square button--ghost" on:click={() => {imageToolbarOpen = false}} aria-label="Close tools">
        <span class="material-icons" aria-hidden="true">close</span>
      </button>
    </sl-tooltip>
  {:else}
    <sl-tooltip content="Open tools">
      <button class="button button--square button--ghost" on:click={() => {imageToolbarOpen = true}} aria-label="Open tools">
        <span class="material-icons" aria-hidden="true">tune</span>
      </button>
    </sl-tooltip>
  {/if}
</div>



<style>
  .image-tools-toolbar {
    position: absolute; 
    top: 10px; 
    right: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0;
    z-index: 1;
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  }

  .image-tools-toolbar button {
    opacity: 0.8;
  }

  .image-options {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) translateY(25%);
    /* transform: rotate(90deg) translate(42px, 27px);
    width: 100px; */
    height: 12rem;
    width: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--color-neutral-100);
    border-radius: 1rem;
    padding: 0.125rem;
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  }  
</style>