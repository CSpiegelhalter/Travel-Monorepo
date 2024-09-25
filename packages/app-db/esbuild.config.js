const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outdir: 'dist',
  sourcemap: true,
  minify: true,
  external: ['pg'] // Exclude native Node modules or other dependencies that don't need bundling
}).catch(() => process.exit(1));
