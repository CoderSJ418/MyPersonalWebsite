// vite.config.ts
import { defineConfig } from "file:///E:/work/AI/MyPersonalWebsite/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/work/AI/MyPersonalWebsite/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import viteCompression from "file:///E:/work/AI/MyPersonalWebsite/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\work\\AI\\MyPersonalWebsite";
var vite_config_default = defineConfig({
  // Vercel base 路径（根路径）
  // 开发环境使用根路径 `/`，生产环境使用 `/my-personal-website/`
  base: process.env.NODE_ENV === "development" ? "/" : "/my-personal-website/",
  plugins: [
    vue(),
    // Gzip 压缩
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,
      // 只压缩大于 10KB 的文件
      deleteOriginFile: false
    }),
    // Brotli 压缩
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
      deleteOriginFile: false
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 目标浏览器 - 提升到 ES2020 以支持现代 JavaScript 特性
    target: "es2020",
    // 最小化
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        // 生产环境移除 console
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.warn"],
        // 启用更多压缩优化
        dead_code: true,
        unused: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        if_return: true,
        join_vars: true,
        collapse_vars: true,
        reduce_vars: true
      },
      format: {
        comments: false
        // 移除注释
      }
    },
    rollupOptions: {
      output: {
        // 手动代码分割 - 优化缓存策略
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("vue")) {
              return "vue-core";
            }
            if (id.includes("vue-router")) {
              return "vue-router";
            }
            if (id.includes("pinia")) {
              return "pinia";
            }
            if (id.includes("gsap")) {
              return "gsap";
            }
            if (id.includes("lucide")) {
              return "lucide";
            }
            if (id.includes("web-vitals")) {
              return "web-vitals";
            }
            if (id.includes("loglevel")) {
              return "loglevel";
            }
            return "vendor";
          }
        },
        // 文件名哈希 - 使用内容哈希优化缓存
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    },
    chunkSizeWarningLimit: 1e3,
    // 预构建依赖 - 优化开发体验
    optimizeDeps: {
      include: ["vue", "vue-router", "pinia", "lucide-vue-next", "gsap", "web-vitals", "loglevel"],
      exclude: []
    },
    // 启用源码映射（用于生产环境调试）
    sourcemap: false
  },
  server: {
    port: 5173,
    open: true,
    // 开发服务器性能优化
    hmr: {
      overlay: false
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx3b3JrXFxcXEFJXFxcXE15UGVyc29uYWxXZWJzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx3b3JrXFxcXEFJXFxcXE15UGVyc29uYWxXZWJzaXRlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi93b3JrL0FJL015UGVyc29uYWxXZWJzaXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvLyBWZXJjZWwgYmFzZSBcdThERUZcdTVGODRcdUZGMDhcdTY4MzlcdThERUZcdTVGODRcdUZGMDlcbiAgLy8gXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RjdGXHU3NTI4XHU2ODM5XHU4REVGXHU1Rjg0IGAvYFx1RkYwQ1x1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NEY3Rlx1NzUyOCBgL215LXBlcnNvbmFsLXdlYnNpdGUvYFxuICBiYXNlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/ICcvJyA6ICcvbXktcGVyc29uYWwtd2Vic2l0ZS8nLFxuXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICAvLyBHemlwIFx1NTM4Qlx1N0YyOVxuICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICBhbGdvcml0aG06ICdnemlwJyxcbiAgICAgIGV4dDogJy5neicsXG4gICAgICB0aHJlc2hvbGQ6IDEwMjQwLCAvLyBcdTUzRUFcdTUzOEJcdTdGMjlcdTU5MjdcdTRFOEUgMTBLQiBcdTc2ODRcdTY1ODdcdTRFRjZcbiAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IGZhbHNlXG4gICAgfSksXG4gICAgLy8gQnJvdGxpIFx1NTM4Qlx1N0YyOVxuICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycsXG4gICAgICBleHQ6ICcuYnInLFxuICAgICAgdGhyZXNob2xkOiAxMDI0MCxcbiAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IGZhbHNlXG4gICAgfSlcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gXHU1NDJGXHU3NTI4IENTUyBcdTRFRTNcdTc4MDFcdTUyMDZcdTUyNzJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgLy8gXHU3NkVFXHU2ODA3XHU2RDRGXHU4OUM4XHU1NjY4IC0gXHU2M0QwXHU1MzQ3XHU1MjMwIEVTMjAyMCBcdTRFRTVcdTY1MkZcdTYzMDFcdTczQjBcdTRFRTMgSmF2YVNjcmlwdCBcdTcyNzlcdTYwMjdcbiAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICAgIC8vIFx1NjcwMFx1NUMwRlx1NTMxNlxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLCAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTc5RkJcdTk2NjQgY29uc29sZVxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUuaW5mbycsICdjb25zb2xlLndhcm4nXSxcbiAgICAgICAgLy8gXHU1NDJGXHU3NTI4XHU2NkY0XHU1OTFBXHU1MzhCXHU3RjI5XHU0RjE4XHU1MzE2XG4gICAgICAgIGRlYWRfY29kZTogdHJ1ZSxcbiAgICAgICAgdW51c2VkOiB0cnVlLFxuICAgICAgICBjb25kaXRpb25hbHM6IHRydWUsXG4gICAgICAgIGV2YWx1YXRlOiB0cnVlLFxuICAgICAgICBib29sZWFuczogdHJ1ZSxcbiAgICAgICAgbG9vcHM6IHRydWUsXG4gICAgICAgIGlmX3JldHVybjogdHJ1ZSxcbiAgICAgICAgam9pbl92YXJzOiB0cnVlLFxuICAgICAgICBjb2xsYXBzZV92YXJzOiB0cnVlLFxuICAgICAgICByZWR1Y2VfdmFyczogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGZvcm1hdDoge1xuICAgICAgICBjb21tZW50czogZmFsc2UgLy8gXHU3OUZCXHU5NjY0XHU2Q0U4XHU5MUNBXG4gICAgICB9XG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gXHU2MjRCXHU1MkE4XHU0RUUzXHU3ODAxXHU1MjA2XHU1MjcyIC0gXHU0RjE4XHU1MzE2XHU3RjEzXHU1QjU4XHU3QjU2XHU3NTY1XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgIC8vIFZ1ZSBcdTY4MzhcdTVGQzNcdTVFOTMgLSBcdTdBMzNcdTVCOUFcdUZGMENcdTVGODhcdTVDMTFcdTUzRDhcdTUzMTZcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygndnVlJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICd2dWUtY29yZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFZ1ZSBSb3V0ZXJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygndnVlLXJvdXRlcicpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAndnVlLXJvdXRlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFBpbmlhIFx1NzJCNlx1NjAwMVx1N0JBMVx1NzQwNlxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdwaW5pYScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAncGluaWEnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBcdTUyQThcdTc1M0JcdTVFOTMgLSBcdThGODNcdTU5MjdcdUZGMENcdTUzNTVcdTcyRUNcdTUyMDZcdTUyNzJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZ3NhcCcpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnZ3NhcCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVJIFx1NTZGRVx1NjgwN1x1NUU5M1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdsdWNpZGUnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2x1Y2lkZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFx1NjAyN1x1ODBGRFx1NzZEMVx1NjNBN1x1NUU5M1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd3ZWItdml0YWxzJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICd3ZWItdml0YWxzJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gXHU2NUU1XHU1RkQ3XHU1RTkzXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2xvZ2xldmVsJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdsb2dsZXZlbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFx1NTE3Nlx1NEVENlx1N0IyQ1x1NEUwOVx1NjVCOVx1NUU5M1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBcdTY1ODdcdTRFRjZcdTU0MERcdTU0QzhcdTVFMEMgLSBcdTRGN0ZcdTc1MjhcdTUxODVcdTVCQjlcdTU0QzhcdTVFMENcdTRGMThcdTUzMTZcdTdGMTNcdTVCNThcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJ1xuICAgICAgfVxuICAgIH0sXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICAgIC8vIFx1OTg4NFx1Njc4NFx1NUVGQVx1NEY5RFx1OEQ1NiAtIFx1NEYxOFx1NTMxNlx1NUYwMFx1NTNEMVx1NEY1M1x1OUE4Q1xuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYScsICdsdWNpZGUtdnVlLW5leHQnLCAnZ3NhcCcsICd3ZWItdml0YWxzJywgJ2xvZ2xldmVsJ10sXG4gICAgICBleGNsdWRlOiBbXVxuICAgIH0sXG4gICAgLy8gXHU1NDJGXHU3NTI4XHU2RTkwXHU3ODAxXHU2NjIwXHU1QzA0XHVGRjA4XHU3NTI4XHU0RThFXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU4QzAzXHU4QkQ1XHVGRjA5XG4gICAgc291cmNlbWFwOiBmYWxzZVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICAgIG9wZW46IHRydWUsXG4gICAgLy8gXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU2MDI3XHU4MEZEXHU0RjE4XHU1MzE2XG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiBmYWxzZVxuICAgIH1cbiAgfVxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQThRLFNBQVMsb0JBQW9CO0FBQzNTLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxxQkFBcUI7QUFINUIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQTtBQUFBLEVBRzFCLE1BQU0sUUFBUSxJQUFJLGFBQWEsZ0JBQWdCLE1BQU07QUFBQSxFQUVyRCxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUE7QUFBQSxJQUVKLGdCQUFnQjtBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ1gsS0FBSztBQUFBLE1BQ0wsV0FBVztBQUFBO0FBQUEsTUFDWCxrQkFBa0I7QUFBQSxJQUNwQixDQUFDO0FBQUE7QUFBQSxJQUVELGdCQUFnQjtBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ1gsS0FBSztBQUFBLE1BQ0wsV0FBVztBQUFBLE1BQ1gsa0JBQWtCO0FBQUEsSUFDcEIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLGNBQWM7QUFBQTtBQUFBLElBRWQsUUFBUTtBQUFBO0FBQUEsSUFFUixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixjQUFjO0FBQUE7QUFBQSxRQUNkLGVBQWU7QUFBQSxRQUNmLFlBQVksQ0FBQyxlQUFlLGdCQUFnQixjQUFjO0FBQUE7QUFBQSxRQUUxRCxXQUFXO0FBQUEsUUFDWCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxVQUFVO0FBQUEsUUFDVixVQUFVO0FBQUEsUUFDVixPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxXQUFXO0FBQUEsUUFDWCxlQUFlO0FBQUEsUUFDZixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sVUFBVTtBQUFBO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sYUFBYSxJQUFJO0FBQ2YsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBRS9CLGdCQUFJLEdBQUcsU0FBUyxLQUFLLEdBQUc7QUFDdEIscUJBQU87QUFBQSxZQUNUO0FBRUEsZ0JBQUksR0FBRyxTQUFTLFlBQVksR0FBRztBQUM3QixxQkFBTztBQUFBLFlBQ1Q7QUFFQSxnQkFBSSxHQUFHLFNBQVMsT0FBTyxHQUFHO0FBQ3hCLHFCQUFPO0FBQUEsWUFDVDtBQUVBLGdCQUFJLEdBQUcsU0FBUyxNQUFNLEdBQUc7QUFDdkIscUJBQU87QUFBQSxZQUNUO0FBRUEsZ0JBQUksR0FBRyxTQUFTLFFBQVEsR0FBRztBQUN6QixxQkFBTztBQUFBLFlBQ1Q7QUFFQSxnQkFBSSxHQUFHLFNBQVMsWUFBWSxHQUFHO0FBQzdCLHFCQUFPO0FBQUEsWUFDVDtBQUVBLGdCQUFJLEdBQUcsU0FBUyxVQUFVLEdBQUc7QUFDM0IscUJBQU87QUFBQSxZQUNUO0FBRUEsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBO0FBQUEsUUFFQSxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLHVCQUF1QjtBQUFBO0FBQUEsSUFFdkIsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDLE9BQU8sY0FBYyxTQUFTLG1CQUFtQixRQUFRLGNBQWMsVUFBVTtBQUFBLE1BQzNGLFNBQVMsQ0FBQztBQUFBLElBQ1o7QUFBQTtBQUFBLElBRUEsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBRU4sS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
