<p align="center">
  <img src="https://img.630226.xyz/file/logo/android-chrome-512x512.png" width="100" height="100" alt="Service Dashboard Logo">
</p>

<h1 align="center">服务导航台</h1>

<p align="center">优雅的服务导航和状态监控面板</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.3-4FC08D?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/Vite-4.4-646CFF?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/QiXiuYuano/service-dashboard-vue" title="使用 Vercel 部署">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <a href="https://dash.cloudflare.com/" title="使用 Cloudflare Pages 部署">
    <img src="https://img.shields.io/badge/-Deploy-F38020?style=for-the-badge&labelColor=F38020&color=F38020&logo=cloudflare&logoColor=white&borderRadius=6" alt="部署到 Cloudflare Pages" height="32" />
  </a>
</p>

<p align="center">🌐 在线演示：
  <a href="https://navsite.630226.xyz" target="_blank">
    https://navsite.630226.xyz
  </a>
</p>

## 📖 简介

服务导航台是一个基于 Vue 3 + Vite 构建的轻量级服务管理导航页面，采用 iOS 16 风格设计。支持多服务状态监控、实时通知、分类筛选等功能。界面简洁美观，响应式设计，支持亮暗主题切换。

## ✨ 功能预览

![功能预览](https://img.630226.xyz/file/inbox/Lb8jyMGo.png)

## ✨ 特性

- 🎨 **iOS 16 风格设计** - 玻璃拟态效果，现代化视觉体验
- 📱 **完全响应式** - 完美适配电脑、平板、手机各种设备
- 🔍 **智能搜索** - 支持服务名称和描述的实时搜索
- 🏷️ **收起式分类** - 点击展开按钮显示分类筛选，节省界面空间
- 📊 **状态监控** - 实时显示服务在线状态和统计信息
- 🌓 **深色模式** - 自动跟随系统主题切换
- ⚡ **性能优化** - 基于 Vite 构建，加载速度超快
- 🎭 **流畅动画** - 精心设计的过渡动画和交互效果
- 📦 **PWA 支持** - 支持安装为桌面应用，离线访问

## ⚙️ 部署配置

### 环境要求

- Node.js >= 16.0.0
- NPM >= 8.0.0 或 Yarn >= 1.22.0

### 快速开始

1. 克隆项目
```bash
git clone https://github.com/QiXiuYuano/service-dashboard-vue.git
cd service-dashboard-vue
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 开发调试
```bash
npm run dev
# 或
yarn dev
```

4. 构建部署
```bash
npm run build
# 或
yarn build
```

构建的文件在 `dist` 目录下，将 `dist` 目录部署到服务器即可。

### 部署到 Vercel

1. 点击上方 "Deploy with Vercel" 按钮
2. 连接到 GitHub，选择项目
3. 填写项目名称，点击 Create
4. 部署完成后即可访问


### 部署到 Cloudflare Pages

1. 点击上方橙色 "部署到 Cloudflare Pages" 按钮
2. 找到计算(worker) 部分
3. 点击创建，选择 Pages，连接到 GitHub，选择项目，点击开始创建
4. 框架预设选择 Vue，点击保持并部署

## 📝 配置说明

### 添加服务

要添加新服务，请修改 `src/data/services.js` 文件中的 `services` 数组：

```javascript
{
  id: "unique-id",
  name: "服务名称",
  description: "服务描述",
  url: "https://example.com",
  icon: "�アイコン", // Emoji 或文字
  logo: "https://example.com/logo.png",
  category: "服务分类",
  status: "checking",
  lastCheck: null
}
```

### 自定义 PWA

要自定义 PWA 信息，请修改 `vite.config.js` 文件中的 `VitePWA` 插件配置部分：

```javascript
manifest: {
  name: '服务导航台',
  short_name: '服务导航',
  description: '一个基于Vue 3构建的轻量级服务管理导航页面',
  theme_color: '#3B82F6',
  background_color: '#F8FAFC',
  // ...
}
```

## 📝 开源协议

本项目基于 [MIT License](LICENSE) 开源，使用时请遵守开源协议。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Vite PWA](https://vite-pwa-org.netlify.app/) - Vite 的 PWA 插件