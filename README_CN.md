# Subscription Dock

[首页](README.md) · [English](README_EN.md) · **中文**

Subscription Dock 是一个轻量的自托管订阅管理工作台，用于管理周期性支出、续费日期与提醒。后端只使用 Node.js 标准库，没有 npm 运行依赖，全部数据保存在一个便于迁移的 JSON 文件中。

## 目录

- [功能](#功能)
- [运行要求](#运行要求)
- [安装](#安装)
- [配置](#配置)
- [反向代理](#反向代理)
- [通知](#通知)
- [备份与恢复](#备份与恢复)
- [访客模式](#访客模式)
- [日常运维](#日常运维)
- [常见问题](#常见问题)
- [参与贡献](#参与贡献)

## 功能

- 集中管理订阅与周期性支出。
- 汇总月度和年度成本。
- 支持 16 种货币、手动汇率和 Frankfurter 参考汇率刷新。
- 提供续费和到期提醒。
- 原生深色仪表盘。
- 面向 Docker 的自托管部署。
- 适配反向代理。
- 受限访客体验。
- 通过 Pushover、Bark 或 Telegram 发送续费提醒。
- JSON 导入与导出。
- 简体中文、English、日本語界面。
- 可复用的 400×400 图标库。

## 运行要求

Docker 部署需要 Docker Engine 与 Docker Compose v2；直接运行源码需要 Node.js 22 或更高版本。项目不需要数据库服务、安装依赖或执行构建。

## 安装

### Docker Compose

从最新的 GitHub Release 下载 [`subscription-dock-v1.7z`](https://github.com/hefan230/Subscription-Dock/releases/latest/download/subscription-dock-v1.7z)，然后执行：

```bash
7z x subscription-dock-v1.7z
cd subscription-dock-v1
cp .env.example .env
nano .env
docker compose up -d --build
```

首次启动前编辑 `.env`，修改默认管理员账号、密码和会话密钥。启动后检查服务状态：

```bash
docker compose ps
docker compose logs --tail=100
```

升级：

```bash
git pull --ff-only
docker compose pull
docker compose up -d --build
```

### 从源码运行

```bash
cp .env.example .env
node server.js
```

打开 `http://localhost:3537`。

## 配置

把 `.env.example` 复制为 `.env`：

| 变量 | 默认值 | 用途 |
|---|---|---|
| `PORT` | `3537` | 应用内部端口 |
| `HOST` | `0.0.0.0` | 监听地址；Docker 内保持此值 |
| `ADMIN_USER` | `admin` | 管理员用户名 |
| `ADMIN_PASSWORD` | `admin` | 管理员密码；部署前必须修改 |
| `SESSION_SECRET` | 占位值 | 用于签名 7 天有效会话 Cookie 的 HMAC 密钥 |
| `DATA_FILE` | `./data/subscription-dock.json` | JSON 数据文件路径 |
| `COOKIE_SECURE` | `false` | 公网使用 HTTPS 时改为 `true` |
| `TRUST_PROXY` | `false` | 位于受信任反向代理后时改为 `true` |

同一 IP 连续登录失败 3 次会被封禁 30 分钟。启用 `TRUST_PROXY` 时，应确保只有受信任的代理能够直接访问应用。

## 反向代理

建议由受信任的反向代理终止 TLS，再把请求转发到应用内部端口。

Nginx 配置结构示例：

```nginx
server {
    listen 443 ssl http2;
    server_name subscriptions.example.com;

    location / {
        proxy_pass http://127.0.0.1:3537;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

生产环境检查清单见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 通知

在设置中选择一种渠道：

- Pushover：API Token 与 User Key。
- Bark：服务地址（默认 `https://api.day.app`）与 Device Key。
- Telegram：Bot Token 与 Chat ID。

设置提前提醒天数，保存后使用测试按钮。服务启动后检查一次，之后每小时检查一次；同一个订阅和续费日期在当前提前天数下只会通知一次。通知凭据目前保存在 JSON 数据文件中，因此也要妥善保护备份。

## 备份与恢复

全部应用数据——包括订阅、设置、上传图标与通知记录——都保存在 `data/subscription-dock.json`。可以使用设置页的导出按钮，或在一致状态下复制文件：

```bash
docker compose stop
# 在此复制挂载的数据目录，或导出数据库。
docker compose start
```

导入 JSON 会覆盖当前状态，因此导入前应先导出一份当前数据。请定期执行恢复演练——没有测试过的备份，只是一份充满希望的文件。

## 访客模式

在设置中启用后，未登录访客可以通过登录页按钮查看总览和订阅列表。访客不能新增、编辑、续期、删除、管理图标、修改设置、导入或导出。访客仍能看到订阅内容，因此包含私人数据的生产实例不应开启此模式。

## 日常运维

### 日志

```bash
docker compose logs -f --tail=200
```

应说明日志中会隐藏哪些敏感字段，以及默认保留策略。

### 健康检查与监控

服务提供 `GET /healthz`，HTTP 进程正常提供服务时返回 `{"ok":true}`。生产环境还建议监控：

- HTTP 可用性。
- 定时提醒任务是否正常执行。
- JSON 数据文件与容器日志的磁盘占用。
- 最近一次成功备份的时间。

### 更新

升级前阅读 [CHANGELOG.md](CHANGELOG.md) 并完成备份。所有需要人工执行的数据迁移都应写入 Release Notes。

## 常见问题

### Subscription Dock 会自动连接银行账户吗？

不会。目前由用户手动维护记录。

### 不使用 Docker 可以运行吗？

可以，前提是文档已写明源码运行环境和数据库要求。为了保证部署可复现，仍推荐使用 Docker。

### 多币种金额如何换算？

汇率相对于 USD 保存，可以手动维护，也可以从 Frankfurter 公共 API 获取参考值。仪表盘折算只用于支出概览，不用于会计或交易。

### 为什么没有收到提醒？

检查部署时区、提供商凭据、通知日志、外网连接以及提前提醒天数。

### 数据保存在哪里？

Docker 将宿主机 `./data` 挂载到 `/app/data`，默认数据文件是宿主机上的 `data/subscription-dock.json`。

## 参与贡献

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。普通问题和功能建议使用 Issue 模板；安全漏洞请按照 [SECURITY.md](SECURITY.md) 私下报告。

## 许可证

Subscription Dock 使用 [GNU General Public License v3.0](LICENSE)。
