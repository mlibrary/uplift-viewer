import * as IIIFHelpers from '@iiif/helpers';
import { readFileSync } from 'node:fs';
import { convertPresentation2, Traverse } from '@iiif/parser/presentation-2';

const vault = new IIIFHelpers.Vault();

// const manifestUri = `https://quod.lib.umich.edu/cgi/t/text/api/manifest/amjewess:taj1895.0001.002`;
// const manifestUri = `https://beta1.quod.lib.umich.edu/cgi/t/text/api/2.1.php/manifest/amjewess:taj1895.0001.002`;
// const response = await fetch(manifestUri);
// const data = await response.json();
// const manifestData = convertPresentation2(data);

const manifestUri = "https://api.bl.uk/metadata/iiif/ark:/81055/vdc_100022545251.0x000002/manifest.json";
const data = JSON.parse(readFileSync('./data/bl-manifest.json'));


// const ids = [];
// const extractCanvasLabsl = new Traverse({
//   canvas: [(canvas) => {
//     console.log(canvas.images);
//     ids.push(canvas.id); // string
//   }],
// });
// extractCanvasLabsl.traverseUnknown(data);
// console.log(ids);

const manifestData = convertPresentation2(data);
console.log(manifestData.items[10].items[0].items[0].body);

const manifest = await vault.loadManifestObject(manifestUri, manifestData);
console.log("AGAIN", manifest.items[10].items[0].items[0].body);


// // const manifest = await vault.loadManifestObject(manifestUri);
// console.log(manifest.items[0]);
// console.log(manifest.items[0].images);