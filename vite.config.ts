/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 部署在 GitHub Pages 项目站点（https://<user>.github.io/HFUT-algorithm-design/）。
// 若仓库改名，请同步修改此处的 base。
export default defineConfig({
  base: '/HFUT-algorithm-design/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
