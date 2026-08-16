# 雷琴韵 · Personal Digital Portfolio

面向研究生复试、导师交流、学术交流与求职面试的个人数字作品集。网站围绕科研能力、AI 应用开发、数据分析实践和综合项目经历组织内容。

## 特点

- React + Vite 单页作品集，完整适配电脑和手机浏览。
- **明暗双主题**：默认跟随系统偏好，可一键切换并记忆选择，刷新无闪烁。
- **自托管字体**：Space Grotesk（西文标题）+ Noto Sans SC（中文，按需子集加载）+ JetBrains Mono（标签编号），不依赖 Google Fonts CDN，国内访问也稳定。
- **交互细节**：滚动进度条、导航 scrollspy 高亮、卡片鼠标聚光灯、列表 stagger 渐入、技能跑马灯（悬停暂停）、数字滚动统计、名片 3D 倾斜、返回顶部按钮、项目详情弹窗动画。
- 所有动效均适配 `prefers-reduced-motion`，对减弱动效偏好的访问者自动降级。
- 所有公开文案集中在 `src/data/portfolio.json`，便于持续维护。
- 默认不公开邮箱、手机号码、证件号、成绩单、证书、申请材料或推荐信。

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

终端会显示本地预览地址。生产构建：

```bash
npm run build
```

构建产物在 `dist/` 目录。

## 更新内容与素材

1. 在 `src/data/portfolio.json` 更新文字、技能、项目和获奖信息。
2. 将确认可公开的图片或视频放入 `public/assets/`，再在 JSON 中以 `assets/文件名` 引用。
3. 如需展示 GitHub 主页链接，在 `profile.github` 填入仓库地址即可在联系区块出现按钮。
4. 当前仅带有一张经过检查、不包含个人填报内容的 Agent 功能界面图。

不要加入身份证、成绩单、证书原图、申请表、录取通知书、推荐信、含二维码或个人编号的截图。发布前请再次检查所有新增素材。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个空仓库，例如 `portfolio`。
2. 将本项目文件推送至仓库的 `main` 分支。
3. 打开仓库 **Settings → Pages**，将 Source 选择为 **GitHub Actions**。
4. 推送后，Actions 中的 **Deploy portfolio to GitHub Pages** 会自动构建并发布。
5. 部署完成后，访问 `https://<GitHub 用户名>.github.io/<仓库名>/`。

工作流文件位于 `.github/workflows/deploy.yml`。因为网站使用相对资源路径，项目既可发布在 GitHub Pages 的子路径，也可直接部署到其他静态站点平台。

## 项目结构

```text
.
├── .github/workflows/deploy.yml  # GitHub Pages 自动部署
├── public/assets/                # 仅存放已审核的公开素材
├── src/
│   ├── data/portfolio.json       # 网站内容数据源
│   ├── App.jsx                   # 页面组件与交互逻辑
│   ├── main.jsx                  # 应用入口（字体加载）
│   └── styles.css                # 设计系统与响应式样式
├── index.html
├── package.json
└── vite.config.js
```
