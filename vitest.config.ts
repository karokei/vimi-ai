import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'node',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/*.spec.ts'],
        alias: {
            '@': resolve(__dirname, './src')
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
})
