# uplift-viewer

A IIIF viewer scoped for the [DLXS Uplift Project](https://quod.lib.umich.edu/), 
and all the quirks that implies.

This is a [Svelte](https://svelte.dev/) application, 
using [Shoelace](https://shoelace.style/) components and
wrapping [OpenSeadragon](https://openseadragon.github.io/).

While there are some local styles, `uplift-viewer` expects that 
the [U-M Library Design System](https://design-system.lib.umich.edu/) and 
[uplift styles](https://github.com/mlibrary/digital-collections-style-guide) and 
their dependencies have been loaded.

## Installation

1. clone this repo
2. `npm install`
3. `npm watch-js` (to develop) or `npm build-js` (to build the release scripts)

## Quirks

`uplift-viewer` supports showing plain text next to the Seadragon viewer,
but this requires constructing a non-IIIF request to DLXS (`SeadragonViewer.svelte#fetchPlainText`) 
and then adapting the UI whether there's actual text or something that looks
like a blank page.

We have some collections in DLXS that cannot support the tiled viewing 
experience or where images are not fetched via IIIF. 
`ImageViewer.svelte#getInfoUrl` has some logic for avoiding
IIIF in these scenarios.

