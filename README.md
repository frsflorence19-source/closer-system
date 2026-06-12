# Closer Pro - 专业查询系统

一个功能完整的客户背景查询系统，拥有用户认证、现代化设计和高级功能。

## ✨ 核心功能

- 🔐 **用户认证** - 完整的登录/注册系统
- 🎯 **客户查询** - 按姓名、电话、邮箱查找客户信息
- 📊 **数据统计** - 实时显示客户信息统计
- 🎨 **专业设计** - 高级现代化UI界面
- 🚀 **即插即用** - 一键部署到Render.com

## 📁 项目结构

```
closer-system/
├── server.js           # Express服务器 + 认证API
├── package.json       # 依赖配置
├── Procfile          # Render部署配置
├── .gitignore
├── README.md
├── views/
│   ├── login.html    # 登录页面
│   └── register.html # 注册页面
└── public/
    └── system.html   # 受保护的查询系统
```

## 🚀 本地运行（5分钟快速开始）

### 第1步：进入项目目录
```bash
cd /Users/data1/Library/Application\ Support/Claude/local-agent-mode-sessions/9d958b4e-e5ae-45fa-9527-b263306cafb4/20d66b22-2835-4eb2-9f67-68a71e7afff8/local_6677f2d5-dabd-46cd-bd19-c2e74a4de88d/outputs/closer-system
```

### 第2步：安装依赖
```bash
npm install
```

### 第3步：启动服务器
```bash
npm start
```

### 第4步：打开浏览器
访问：`http://localhost:3000`

## 🧪 测试步骤

1. **注册新账户**
   - 点击"现在注册"
   - 用户名：`admin`
   - 邮箱：`admin@example.com`
   - 密码：`123456`
   - 点击"创建账户"

2. **登录系统**
   - 输入用户名和密码
   - 点击"登录"

3. **使用查询系统**
   - 在搜索框输入姓名、电话或邮箱
   - 点击"搜索"查看结果
   - 右上角显示你的用户名和登出按钮

## 📤 部署到 Render.com

### 第1步：初始化Git并推送到GitHub
```bash
cd /Users/data1/Library/Application\ Support/Claude/local-agent-mode-sessions/9d958b4e-e5ae-45fa-9527-b263306cafb4/20d66b22-2835-4eb2-9f67-68a71e7afff8/local_6677f2d5-dabd-46cd-bd19-c2e74a4de88d/outputs/closer-system

git init
git add .
git commit -m "Closer Pro - 专业查询系统"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/closer-system.git
git push -u origin main
```

### 第2步：在Render.com部署
1. 访问 https://render.com
2. 用GitHub账户登录
3. 点击 **"+ New"** → **"Web Service"**
4. 选择你的仓库
5. 配置：
   - **Name**: `closer-system`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. 点击 **"Create"**

你的网站会在这个地址：
```
https://your-app-name.onrender.com
```

## 🎨 自定义系统

### 修改页面标题
编辑 `public/system.html` 第6行：
```html
<title>Closer Pro</title>
```

### 修改颜色主题
编辑 CSS 中的颜色变量（主要颜色：#1b2c47 和 #c9a84c）

### 添加更多搜索字段
编辑 `public/system.html` 的搜索栏部分

## 🔐 安全建议

- ✅ 修改 `server.js` 中的会话密钥
- ✅ 在生产环境使用 SQLite 文件数据库
- ✅ 启用 HTTPS（Render自动提供）
- ✅ 定期更新依赖版本

## 📝 API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/` | 首页（重定向） |
| GET | `/login` | 登录页面 |
| GET | `/register` | 注册页面 |
| POST | `/api/register` | 用户注册 |
| POST | `/api/login` | 用户登录 |
| GET | `/system` | 查询系统（需要登录） |
| GET | `/api/user` | 获取用户信息 |
| GET | `/api/logout` | 用户登出 |

## 🛑 停止运行

在终端按：**Ctrl + C**

## ❓ 常见问题

**Q: 搜索功能怎么使用？**
A: 输入客户的姓名、电话或邮箱，点击搜索查看购课历史。

**Q: 数据会保存吗？**
A: 默认使用内存数据库，重启时会丢失。要持久化，修改 server.js 使用 SQLite 文件。

**Q: 如何修改查询字段？**
A: 编辑 `public/system.html` 中的搜索表单部分。

**Q: 网站部署后无法打开？**
A: 检查 Render 的日志，确保 npm install 和 npm start 都成功了。

## 📞 需要帮助？

- Render 文档：https://render.com/docs
- Express.js 文档：https://expressjs.com
- SQLite3 文档：https://www.sqlite.org

---

**项目位置**：
```
/Users/data1/Library/Application Support/Claude/local-agent-mode-sessions/9d958b4e-e5ae-45fa-9527-b263306cafb4/20d66b22-2835-4eb2-9f67-68a71e7afff8/local_6677f2d5-dabd-46cd-bd19-c2e74a4de88d/outputs/closer-system/
```

**版本**：Closer Pro 1.0
