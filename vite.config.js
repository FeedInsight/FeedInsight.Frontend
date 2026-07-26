import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vite configuration.
 *
 * Path aliases mirror the folder architecture so imports never need long
 * relative chains like `../../../shared/api/axiosClient`.
 *   @app       -> src/app        (store, providers, config - app bootstrap)
 *   @shared    -> src/shared     (cross-feature building blocks: ui kit, api client, hooks, layouts)
 *   @features  -> src/features   (vertical slices: customerPortal, auth, dashboard, categories, backlog, chat, tenantSettings, adminUsers)
 *   @router    -> src/router
 *   @styles    -> src/styles
 *   @assets    -> src/assets
 *
 * dev server proxy: forwards /api/* to the FeedInsight.WebApi backend so the
 * browser never needs CORS configured during local development. Adjust the
 * target to match your local ASP.NET Core Web API port.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@router': path.resolve(__dirname, './src/router'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'https://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
