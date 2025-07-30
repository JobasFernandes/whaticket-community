import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    outDir: "build",
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings about problematic imports that work in runtime
        if (
          warning.code === "UNRESOLVED_IMPORT" &&
          (warning.message.includes("jss-plugin-globalThis") ||
            warning.message.includes("mic-recorder-to-mp3-fixed"))
        ) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          materialui: [
            "@material-ui/core",
            "@material-ui/icons",
            "@material-ui/lab"
          ],
          router: ["react-router-dom"],
          socket: ["socket.io-client"]
        }
      }
    }
  },
  resolve: {
    alias: {
      // Resolve problematic Material-UI imports
      "jss-plugin-globalThis": "jss-plugin-global"
    }
  },
  define: {
    "process.env": {},
    global: "globalThis"
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["jss-plugin-globalThis"]
  }
});
