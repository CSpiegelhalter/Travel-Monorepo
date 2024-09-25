const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outdir: 'dist',
  sourcemap: true,
  minify: true,
  external: ['fastify', 'app-db']
}).catch(() => process.exit(1));
