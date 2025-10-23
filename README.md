# 寻宝冒险游戏 - Vue版

这是一个基于Vue 3开发的寻宝冒险游戏项目。

## 项目功能

- 用户注册和登录系统
- 交互式寻宝地图
- 多个可探索的位置（图书馆、神庙、洞穴）
- 游戏进度保存
- 排行榜功能

## 开发环境设置

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
npm run dev
```

在浏览器中打开 http://localhost:5173/ 查看项目。

### 构建项目

```bash
npm run build
```

构建后的文件将输出到 `dist` 目录。

## GitHub Pages 部署说明

### 方法一：使用GitHub Actions自动部署（推荐）

1. 确保项目中包含 `.github/workflows/deploy.yml` 文件（已创建）
2. 将代码推送到GitHub仓库的main或master分支
3. 在仓库设置中，导航到 Settings > Pages
4. 在 Build and deployment 部分，选择 Source 为 GitHub Actions
5. GitHub Actions 将自动构建并部署项目

### 方法二：手动部署

1. 修改 `vite.config.js` 中的 `base` 配置为你的仓库名称
2. 构建项目：`npm run build`
3. 将 `dist` 目录的内容推送到 `gh-pages` 分支

## 注意事项

- 确保 `vite.config.js` 中的 `base` 配置与你的GitHub仓库名称一致
- 部署后通常需要等待几分钟才能访问
- 如果遇到资源加载问题，请检查浏览器控制台的错误信息