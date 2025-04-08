
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    mode === 'production' && visualizer({
      filename: './dist/stats.html',
      open: false, // Set to true to automatically open the stats file after build
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for node_modules
          'vendor': [
            'react', 
            'react-dom', 
            'react-router-dom',
          ],
          // UI components in a separate chunk
          'ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            // ... autres composants UI importants
          ],
          // Charts in a separate chunk
          'charts': ['recharts'],
          // i18n in a separate chunk
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // Forms handling in a separate chunk
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
        // Chunking strategy
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    sourcemap: true,
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
}));
