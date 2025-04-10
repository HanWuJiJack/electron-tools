# Electron跨平台桌面工具集

## 项目概述
基于Electron + Vue3构建的现代化桌面应用，整合多种实用工具链。支持Windows/macOS/Linux多平台部署，主要功能包含文件格式转换、数据处理、自动化办公等模块。

## 核心功能
- 文件转换：PNG/ICO互转、WebP转换、DOCX模板生成
- 数据处理：Excel报表导出、SparkMD5哈希生成、数据加密
- 自动化工具：网页截图、PDF生成、Puppeteer爬虫
- 系统集成：剪贴板监控、自动更新、日志追踪

## 技术栈
**前端框架**
- Vue3 + Vuex + Vue Router
- ElementPlus + @element-plus/icons-vue
- CodeMirror编辑器集成

**Electron生态**
- Electron-builder多平台打包
- Electron-log进程日志
- Electron-updater自动更新

**核心依赖**
- 文件处理：jszip、file-saver、pdf-lib
- 数据转换：xlsx、docxtemplater
- 工具库：lodash、axios、puppeteer

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## 环境配置
```bash
# 开发模式
MODE=dev npm run dev

# 生产构建
MODE=production npm run build
```

## 贡献指南
1. 安装开发依赖
2. 创建feature分支开发新功能
3. 提交PR时附带测试用例
4. 遵循ElementPlus组件规范
5. 使用Prettier统一代码格式