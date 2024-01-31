import * as IIIFHelpers from '@iiif/helpers';

const vault = new IIIFHelpers.Vault();

const manifestUri = `https://quod.lib.umich.edu/cgi/t/text/api/manifest/amjewess:taj1895.0001.002`;


async function LoadManifest(manifestId) {
  console.log("--", manifestId);
  // example is to do this again, but we already did this?
  // const manifest = await vault.loadManifest(manifestId);
}

const manifest = await vault.loadManifest(manifestUri);
vault.setMetaValue(["ViewerState", "LoadedResources", "CurrentManifest"], manifest.id);
await vault.subscribe(
  state => state.iiif.meta["ViewerState"],
  selection => {
    if (selection && selection.LoadedResources) {
      LoadManifest(selection.LoadedResources.CurrentManifest);
    }
  }
)

const thumbHelper = IIIFHelpers.createThumbnailHelper(vault);

manifest.items.forEach((canvas) => {
  thumbHelper.getBestThumbnailAtSize(canvas, { maxWidth: 100 }).then(cvThumb => console.log("----", cvThumb.best));
})
