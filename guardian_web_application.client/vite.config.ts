import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { env } from 'process';

const baseFolder =
     env.APPDATA !== undefined && env.APPDATA !== ''
          ? `${env.APPDATA}/ASP.NET/https`
          : `${env.HOME}/.aspnet/https`;

const certificateName = "guardian_ids_web_app.client";

// Uncomment these lines if you plan to use HTTPS in your dev server
// const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
// const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// Only use HTTPS in development if the cert files exist
const useHttps = fs.existsSync(path.join(baseFolder, `${certificateName}.pem`)) &&
     fs.existsSync(path.join(baseFolder, `${certificateName}.key`));


// https://vitejs.dev/config/
export default defineConfig({
     plugins: [plugin()],
     resolve: {
          alias: {
               '@': fileURLToPath(new URL('./src', import.meta.url))
          }
     },
     server: {
          proxy: {
               '^/weatherforecast': {
                    target: 'https://localhost:7272',
                    secure: false,
               },
               '^/pingauth': {
                    target: 'https://localhost:7272/',
                    secure: false
               },
               '/login': {
                    target: 'http://localhost:5264', // Change to the new port
                    changeOrigin: true,
                    secure: false,
               },
               '/register': {
                    target: 'http://localhost:5264', // Change to the new port
                    changeOrigin: true,
                    secure: false,
               },
               '^/logout': {
                    target: 'https://localhost:7272/',
                    secure: false
               }
          },
          port: 5173,
          // Use the following configuration for HTTPS
          https: useHttps ? {
               key: fs.readFileSync(path.join(baseFolder, `${certificateName}.key`)),
               cert: fs.readFileSync(path.join(baseFolder, `${certificateName}.pem`)),
          } : undefined, // Use undefined if not using HTTPS
     }
});
