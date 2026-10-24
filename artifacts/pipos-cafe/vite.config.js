import path from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;
if (!basePath) {
  throw new Error("BASE_PATH environment variable is required but was not provided.");
}

export default defineConfig({
  base: basePath,
  plugins: [
    vue(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((module) =>
            module.cartographer({ root: path.resolve(rootDir, "..") }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((module) =>
            module.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      "@assets": path.resolve(rootDir, "..", "..", "attached_assets"),
    },
    dedupe: ["vue"],
  },
  root: rootDir,
  build: {
    outDir: path.resolve(rootDir, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
