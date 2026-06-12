import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'vite/inject-gradient-presets': resolve(
          __dirname,
          'src/vite/inject-gradient-presets.ts',
        ),
        'i18n/index': resolve(__dirname, 'src/i18n/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'quasar',
        'vue-i18n',
        'vite',
        'apexcharts',
        'vue3-apexcharts',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.stories.ts', 'src/stories/**', 'src/components/**'],
      outDir: 'dist',
      rollupTypes: false,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
