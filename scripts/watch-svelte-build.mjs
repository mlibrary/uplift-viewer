import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";
import { argv, exit } from 'node:process';

const inputFilename = argv.at(-1);
const outputFilename = inputFilename.replace('src/', 'dist/');

async function watch() {
  let ctx = await esbuild
    .context({
      entryPoints: [inputFilename],
      mainFields: ["svelte", "browser", "module", "main"],
      conditions: ["svelte", "browser"],
      bundle: true,
      sourcemap: 'external',
      outfile: outputFilename,
      plugins: [sveltePlugin({compilerOptions: { css: true }})],
      logLevel: "info",
    })
  await ctx.watch();
  console.log("Watching...");
    // .catch(() => process.exit(1));
}

watch();