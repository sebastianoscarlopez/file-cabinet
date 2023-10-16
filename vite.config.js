import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    // ... other configurations
    resolve: {
        alias: {
            "@": resolve(__dirname, "src/")
        }
    }
});