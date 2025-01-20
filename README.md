# PaddleGalaxy

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

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/yourusername/paddle-annual-2024.git
cd paddle-annual-2024
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 项目结构

```
paddle-annual-2024/
├── public/                 # 静态资源
│   ├── paddle-logo.png
│   └── data/              # CSV数据文件
├── src/
│   ├── components/        # 组件
│   ├── store/            # Pinia状态管理
│   ├── views/            # 页面视图
│   ├── router/           # 路由配置
│   └── App.vue           # 根组件
├── package.json          # 项目配置
└── vite.config.js        # Vite配置
```

## 数据文件说明

- `userpaddle_summary_2024.csv`: 用户年度总结数据
- `userpaddle_timerecord_contributions_2024.csv`: 时间记录数据
- `userpaddle_monthly_contributions_2024.csv`: 月度贡献数据

## 环境要求

- Node.js >= 16.0.0
- Python >= 3.8 (后端服务)
- 现代浏览器支持

## 后端服务

1. 安装Python依赖
```bash
pip install -r requirements.txt
```

2. 启动服务
```bash
python app.py
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
