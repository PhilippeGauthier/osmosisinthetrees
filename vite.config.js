import laravel from "laravel-vite-plugin";
import { defineConfig, loadEnv } from "vite";
import path from "path";

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        build: {
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        if (id.includes("node_modules"))
                            return id
                                .toString()
                                .split("node_modules/")[1]
                                .split("/")[0]
                                .toString();
                    },
                },
            },
        },
        plugins: [
            laravel({
                refresh: true,
                input: [
                    "resources/css/site.css",
                    "resources/js/site.js",
                    "resources/js/effects/text-animation/text-animation-1.js",
                    "resources/js/effects/svg-filter/main.js",
                    "resources/js/effects/svg-filter/filters/filter1.js",
                ],
            }),
        ],
        server: {
            open: env.APP_URL,
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "resources"),
            },
        },
    };
});
