import type { APIRoute } from 'astro';

// 静态输出时会生成 /robots.txt，Sitemap 地址取自 astro.config.mjs 的 site
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://example.com');
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('sitemap-index.xml', base).href}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
