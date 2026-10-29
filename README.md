# 再来一把

一个用 Astro 搭建的极简静态博客：Markdown 写作、无数据库、无后台。需要 Node.js ≥ 22.12（`.nvmrc` 指定 Node 22）。

站名是一句玩家口头禅：玩游戏时最常说的一句话，做游戏时最常有的念头。

线上地址：<https://kenneykun.github.io/>（先用 GitHub Pages 放着，以后想绑自己的域名再说）

## 本地运行

```powershell
cd D:\godot\my-blog
npm install        # 首次
npm run dev        # http://localhost:4321
npm run build      # 产物在 dist/
npm run preview    # 本地预览构建结果
```

> PowerShell 如果报 `npm.ps1 cannot be loaded because running scripts is disabled`，把命令换成 `npm.cmd ...`，
> 或者执行一次 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`。

## 目录结构

```text
my-blog/
├── astro.config.mjs        # 站点配置（域名、集成）
├── .nvmrc                  # Node 版本，GitHub Actions 会读它
├── .github/workflows/      # 推送到 main 后自动构建发布
├── src/
│   ├── consts.ts           # 站点标题 / 描述 / 作者 / 联系方式
│   ├── content.config.ts   # 文章集合的 frontmatter 校验规则
│   ├── content/blog/       # ← 文章都放这里
│   ├── layouts/            # 页面骨架
│   ├── components/         # 页头、页脚、日期、<head> 元信息
│   ├── pages/              # 路由：/ /blog/ /about/ /404 /rss.xml /robots.txt
│   └── styles/global.css   # 全站样式（含深色模式）
└── public/                 # 静态资源，原样拷贝
```

## 写一篇新文章

在 `src/content/blog/` 新建 `.md` 文件，文件名即 URL（例如 `my-post.md` → `/blog/my-post/`）：

```md
---
title: '标题'
description: '一句话摘要，显示在列表里'
pubDate: 2026-11-01
tags: ['标签']
draft: false
---
```

`draft: true` 的文章不会被构建，也不会出现在列表和 RSS 里。

## 改站点信息

- 标题、副标题、作者、邮箱 / GitHub：`src/consts.ts`（联系方式留空就不显示）
- 导航链接：`src/components/Header.astro`
- 主题色、字号、深色模式：`src/styles/global.css` 顶部的 CSS 变量
- 部署域名：`astro.config.mjs` 里的 `site`（RSS、sitemap、canonical 都依赖它）

## 已经有的东西

- 首页最近 5 篇 + 完整列表，按发布时间倒序
- RSS（`/rss.xml`）、sitemap（`/sitemap-index.xml`）、`robots.txt`
- 每页的 canonical、Open Graph、Twitter 卡片；文章页带 `article:published_time`
- 自定义 404 页
- 深色模式跟随系统
- frontmatter 用 zod 校验，写错字段构建会直接报错
- 推送到 `main` 自动构建并发布到 GitHub Pages

## 部署（GitHub Pages）

仓库名就是用户站：`kenneykun.github.io`，地址 <https://kenneykun.github.io/>。根路径部署，不需要配 `base`。

推送到 `main` 之后，`.github/workflows/deploy.yml` 会自动：

1. 按 `.nvmrc` 装 Node 22，跑 `npm ci` 和 `npm run build`
2. 把 `dist/` 作为 Pages 产物发布

首次需要在仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**（工作流里的 `configure-pages` 带 `enablement: true`，一般会自动打开）。

以后发文章就三步：

```powershell
git add .
git commit -m "post: 标题"
git push
```

一分钟左右线上更新。

以后想换自定义域名：Settings → Pages → Custom domain，同时把 `astro.config.mjs` 里的 `site` 改成新域名——RSS、sitemap、canonical 都依赖它。

> 国内访问 GitHub Pages 偶尔不稳定；以后想要更快的线路，可以换 Cloudflare Pages 或 EdgeOne Pages，构建命令和产物目录都不变。
