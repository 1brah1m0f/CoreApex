import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['loqo.jpeg'],
      manifest: {
        name: 'Mobil İcra',
        short_name: 'Mobil İcra',
        description: 'Şəhər idarəetmə platforması — müraciət, tapşırıq, analitika',
        theme_color: '#1A3C6E',
        background_color: '#F4F6FA',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'az',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'loqo.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
          },
          {
            src: 'loqo.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
          },
          {
            src: 'loqo.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg,jpg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'google-maps-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://coreapex.onrender.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ''),
      },
    },
  },
})
