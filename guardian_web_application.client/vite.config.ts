import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { spawnSync } from 'child_process';
import type { ProxyOptions } from 'vite';

const baseFolder = process.env.APPDATA
     ? `${process.env.APPDATA}/ASP.NET/https`
     : `${process.env.HOME}/.aspnet/https`;

const certificateName = "guardian_web_application.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// Create certificates if they don't exist
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
     const result = spawnSync('dotnet', [
          'dev-certs',
          'https',
          '--export-path',
          certFilePath,
          '--format',
          'Pem',
          '--no-password',
     ], { stdio: 'inherit' });

     if (result.status !== 0) {
          throw new Error("Could not create certificate.");
     }
}

// Define proxy configuration
const apiProxy: ProxyOptions = {
     target: 'https://localhost:7024',
     secure: false,
     changeOrigin: true,
     configure: (proxy) => {
          proxy.on('error', (err) => {
               console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
               // Add CORS headers to the proxy request
               proxyReq.setHeader('Access-Control-Allow-Origin', 'https://localhost:5173');
               proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');
          });
          proxy.on('proxyRes', (proxyRes) => {
               // Add CORS headers to the proxy response
               proxyRes.headers['access-control-allow-origin'] = 'https://localhost:5173';
               proxyRes.headers['access-control-allow-credentials'] = 'true';
          });
     }
};

// Configuration
export default defineConfig({
     plugins: [
          react({
               // Enable Fast Refresh
               fastRefresh: true,
          })
     ],
     base: '/app/',
     resolve: {
          alias: {
               '@': path.resolve(__dirname, './src')
          }
     },
     server: {
          port: 5173,
          https: {
               key: fs.readFileSync(keyFilePath),
               cert: fs.readFileSync(certFilePath),
          },
          proxy: {
               '/api': {
                    ...apiProxy,
                    rewrite: (path) => path.replace(/^\/api/, '/api')
               },
               '/Auth': {
                    ...apiProxy,
                    rewrite: (path) => path.replace(/^\/Auth/, '/Auth')
               }
          },
          watch: {
               usePolling: true,
               interval: 1000
          },
          hmr: {
               protocol: 'wss',
               host: 'localhost',
               port: 5173,
               clientPort: 5173,
          }
     },
     optimizeDeps: {
          include: ['react', 'react-dom', 'react-router-dom']
     },
     build: {
          sourcemap: true,
          commonjsOptions: {
               include: []
          }
     }
});