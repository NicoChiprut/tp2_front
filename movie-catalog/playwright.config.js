import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'https://tp2-front-lac.vercel.app/',
    headless: true,
  },
})