import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(), 
        tailwindcss(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.svg'],
          manifest: {
            name: 'WanderGenius: AI Trip Planner',
            short_name: 'WanderGenius',
            description: 'Your AI-Powered One-Day Trip Planner',
            theme_color: '#030712',
            background_color: '#030712',
            display: 'standalone',
            icons: [
              {
                src: 'favicon.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              },
              {
                src: 'favicon.svg',
                sizes: '512x512',
                type: 'image/svg+xml'
              },
              {
                src: 'favicon.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              }
            ]
          },
          devOptions: {
            enabled: true
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
