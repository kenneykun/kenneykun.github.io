// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 部署后把 site 换成你的真实域名（RSS / sitemap / canonical / OG 都依赖它）
export default defineConfig({
  site: 'https://kenneykun.github.io',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // 单一深色主题：浅色页面上是一块“深色卡片”，深色模式下也协调，无需额外 CSS 切换
      theme: 'github-dark-dimmed',
      wrap: false,
    },
  },
});
