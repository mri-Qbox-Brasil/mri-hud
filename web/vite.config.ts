import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { minify } from "html-minifier";

const minifyHtml = () => ({
  name: "html-transform",
  transformIndexHtml(html: string) {
    return minify(html, { collapseWhitespace: true });
  },
});

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  return {
    plugins: [
      react(),
      isProduction && minifyHtml(),
    ].filter(Boolean),
    base: "./",
    // dedupe garante uma unica copia de React mesmo com @mriqbox/ui-kit linkado
    // localmente (link:) durante o desenvolvimento — sem isso o pacote linkado
    // poderia trazer sua propria React e quebrar os hooks ("invalid hook call").
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    build: {
      minify: isProduction,
      emptyOutDir: true,
      outDir: "../html",
      assetsDir: "./",
      rollupOptions: {
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`,
        },
      },
    },
  };
});
