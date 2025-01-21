# paddle-annual-report

一个基于 Vue.js 开发的 PaddlePaddle 社区年度总结网站，以星系探索的方式展现贡献者在2024年的开源贡献历程。在这个数字星系中，每个贡献者都是独特的星光，共同构建了 PaddlePaddle 的开源宇宙。

## 功能特点

- 个人成就展示
  - PR、Issue、代码评审数据统计
  - 代码贡献量可视化
  - 个性化贡献者标签

- 时间记录
  - 最大代码提交记录
  - 最快PR合入时间
  - 凌晨提交记录
  - 代码优化统计

- 贡献趋势
  - 月度贡献趋势图表
  - PR、Issue、合入数据对比
  - 交互式数据展示

- 分享功能
  - 生成个性化海报
  - 支持社交媒体分享
  - 多平台适配

## 技术栈

- 前端框架：Vue 3
- 状态管理：Pinia
- 路由管理：Vue Router
- 图表库：ECharts
- 数据处理：PapaParse
- 样式设计：CSS3 动画
- 构建工具：Vite
- 包管理器：pnpm

## 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0
- 现代浏览器（支持 ES6+ 特性）

## 安装说明

1. 安装 Node.js
```bash
# 使用 nvm 安装 Node.js（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 或直接从官网下载安装：https://nodejs.org/
```

2. 安装 pnpm
```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 或使用其他方式安装：https://pnpm.io/installation
```

3. 克隆项目
```bash
git clone https://github.com/yourusername/paddle-annual-report.git
cd paddle-annual-report
```

4. 安装依赖
```bash
pnpm install
```

5. 启动开发服务器
```bash
pnpm dev
```

6. 构建生产版本
```bash
pnpm build
```

7. 预览生产版本
```bash
pnpm preview
```

## 项目结构

```
paddle-annual-report/
├── public/                 # 静态资源
│   ├── paddle-logo.png
│   └── data/              # CSV数据文件
├── src/
│   ├── components/        # 组件
│   ├── store/            # Pinia状态管理
│   ├── views/            # 页面视图
│   ├── router/           # 路由配置
│   └── App.vue           # 根组件
├── index.html            # 入口 HTML
├── package.json          # 项目配置
├── pnpm-lock.yaml        # pnpm 依赖锁定文件
└── vite.config.js        # Vite 配置
```

## 数据文件说明

项目使用三个 CSV 文件存储数据：

- `userpaddle_summary_2024.csv`: 用户年度总结数据
  - 包含用户的 PR、Issue、代码量等基础统计信息
  - 用于生成个人成就和贡献者标签

- `userpaddle_timerecord_contributions_2024.csv`: 时间记录数据
  - 记录用户的代码提交、PR合入等时间节点
  - 用于展示特殊时间成就

- `userpaddle_monthly_contributions_2024.csv`: 月度贡献数据
  - 按月统计用户的各类贡献数据
  - 用于生成贡献趋势图表

## 开发指南

1. 代码规范
```bash
# 运行代码检查
pnpm lint

# 运行代码格式化
pnpm format
```

2. 提交规范
```bash
# 示例
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue #123"
```

3. 分支管理
- main: 主分支，用于发布
- develop: 开发分支
- feature/*: 特性分支
- fix/*: 修复分支

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
