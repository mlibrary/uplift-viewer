import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";
import { argv, exit } from 'node:process';

const inputFilename = argv.at(-1);
const outputFilename = inputFilename.replace('src/', 'dist/');

esbuild
  .build({
    entryPoints: [inputFilename],
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    bundle: true,
    outfile: outputFilename,
    plugins: [sveltePlugin({compilerOptions: { css: true }})],
    logLevel: "info",
  })
  .catch(() => process.exit(1));