const esbuild = require("esbuild")

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    bundle: true,
    minify: false,
    plugins: [],
    inject: ['./src/utils/jquery_inject.js'],
  })
  .then(() => console.log("JS Build completed."))
  .catch(()=> process.exit(1));

// Compile html (selfmade)
