# Subscription Dock

Subscription Dock is a lightweight self-hosted subscription manager for VPS users who want a simple web panel to track recurring payments, renewal dates, currencies, icons, and reminders.

It is designed for quick Docker deployment on Ubuntu servers. The backend uses only Node.js standard libraries, with no npm runtime dependencies. Data is stored in a single JSON file at `data/subscription-dock.json`.

## Quick Docker Deployment

1. Download `subscription-dock-v1.7z` to your server and extract it.

   ```bash
   7z x subscription-dock-v1.7z
   cd subscription-dock
   ```

2. Edit `.env` and set your own admin username, password, and session secret.

   ```bash
   nano .env
   ```

   The open-source default is:

   ```env
   ADMIN_USER=admin
   ADMIN_PASSWORD=admin
   SESSION_SECRET=change-this-to-a-long-random-string
   ```

   Change these values before exposing the panel to the internet.

3. Start the Docker container from the extracted project directory.

   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

4. Check the service.

   ```bash
   curl http://127.0.0.1:3537/healthz
   ```

   If it returns `{"ok":true}`, the service is running.

## Features

- Manage subscriptions, domains, VPS plans, licenses, cloud services, memberships, APIs, and other recurring costs
- Admin login protection with IP-based brute-force blocking
- Optional read-only guest mode
- Overview dashboard with monthly average, annual spend, upcoming renewals, and payment-currency grouping
- Dashboard currency switcher
- Supported currencies: CNY, USD, JPY, EUR, TRY, INR, SGD, BRL, GBP, NGN, CAD, AUD, HKD, PHP, MYR, PKR
- One-click reference exchange-rate refresh with the Frankfurter public API
- Icon library with upload, rename, delete, and reusable icons
- Built-in default WebP icon library
- Custom icons must be PNG, JPG, or WebP, exactly 400x400 pixels, up to 20KB each
- Renewal reminders through Pushover, Bark, or Telegram
- JSON backup import and export
- Chinese, English, and Japanese interface switching
- Black and yellow compact dark theme

## Default Port And Access

The application listens inside the container on port `3537`.

The default `compose.yaml` binds the service only to the VPS local loopback address:

```yaml
ports:
  - "127.0.0.1:3537:3537"
```

This means the Docker service is not directly exposed to the public internet. It is intended to be accessed through a local reverse proxy such as Nginx or aaPanel/BT Panel.

If you want to change the host-side port, keep the container port unchanged and edit only the left side:

```yaml
ports:
  - "127.0.0.1:3536:3537"
```

Then proxy to:

```text
http://127.0.0.1:3536
```

Keep `.env` as:

```env
HOST=0.0.0.0
PORT=3537
```

Inside Docker, do not set `HOST=127.0.0.1`, because that may make the app listen only inside the container itself.

## Reverse Proxy

With Nginx or aaPanel/BT Panel, proxy your domain to:

```text
http://127.0.0.1:3537
```

After enabling HTTPS, set these values in `.env`:

```env
COOKIE_SECURE=true
TRUST_PROXY=true
```

For plain HTTP or local-only testing, keep:

```env
COOKIE_SECURE=false
TRUST_PROXY=false
```

Basic aaPanel/BT Panel flow:

1. Create a website and bind your domain.
2. Issue and enable an SSL certificate.
3. Enable reverse proxy in the website settings.
4. Set the target URL to `http://127.0.0.1:3537`.
5. Keep the sent host as `$host`.
6. Save and visit your domain.

## Install Docker On Ubuntu 24

If your VPS does not have Docker yet:

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Some servers provide the old Compose command as `docker-compose`; this project uses that command in the quick-start section for compatibility.

## Local Node.js Run

For local development without Docker, use Node.js 22 or newer:

```bash
cp .env.example .env
node server.js
```

Open:

```text
http://localhost:3537
```

## Data And Backup

All app data is stored in:

```text
data/subscription-dock.json
```

Back up this file directly, or use the JSON export button in the settings page.

## Notifications

In the settings page, choose one notification channel and fill in the required fields:

- `Pushover API Token`
- `Pushover User Key`
- `Bark Server URL`, usually `https://api.day.app`
- `Bark Device Key`
- `Telegram Bot Token`
- `Telegram Chat ID`
- Reminder days before renewal, for example `3`

After reminders are enabled and saved, the service checks once after startup and then once per hour. The same subscription and renewal date will only send one reminder.

---

# Subscription Dock 中文说明

Subscription Dock 是一个轻量自托管订阅管理面板，适合部署在 Ubuntu VPS 上，用来管理各种订阅、域名、VPS、许可证、云服务、会员服务等周期性支出。

项目优先考虑简洁、高效、方便部署。后端只使用 Node.js 标准库，不依赖 npm 第三方运行库，数据保存在 `data/subscription-dock.json` 一个 JSON 文件中。

## 快速 Docker 部署

1. 下载 `subscription-dock-v1.7z` 到服务器并解压。

   ```bash
   7z x subscription-dock-v1.7z
   cd subscription-dock
   ```

2. 进入目录后修改 `.env` 配置文件，设置自己的后台账号、密码和会话密钥。

   ```bash
   nano .env
   ```

   开源默认值是：

   ```env
   ADMIN_USER=admin
   ADMIN_PASSWORD=admin
   SESSION_SECRET=change-this-to-a-long-random-string
   ```

   如果要部署到公网，请务必改掉这些默认值。

3. 在解压后的项目目录执行启动命令。

   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

4. 检查服务是否正常。

   ```bash
   curl http://127.0.0.1:3537/healthz
   ```

   返回 `{"ok":true}` 就代表服务已经启动。

## 主要功能

- 管理订阅、域名、VPS、许可证、云服务、会员、API 等周期性支出
- 登录保护，并带有简单的防爆破封禁
- 可在设置中开启只读访客访问
- 新增、编辑、删除、续期订阅
- 主页总览显示月均支出、年化支出、30 天内续费、付款货币统计
- 总览可临时切换折算货币
- 支持 CNY、USD、JPY、EUR、TRY、INR、SGD、BRL、GBP、NGN、CAD、AUD、HKD、PHP、MYR、PKR
- 设置页可一键刷新参考汇率，默认使用无需 API key 的 Frankfurter 公共汇率接口
- 图标库管理，可上传、重命名、删除图标
- 内置一批默认 WebP 图标库
- 自定义图标限制为 PNG、JPG、WebP，必须 400x400 像素，单个不超过 20KB
- 支持 Pushover、Bark、Telegram 到期提醒
- 支持 JSON 备份导入、导出
- 支持简体中文、English、日本語 三语言切换
- 黑黄紧凑暗色主题

## 默认端口和访问方式

应用在容器内部监听 `3537` 端口。

默认 `compose.yaml` 只把服务绑定到 VPS 本机：

```yaml
ports:
  - "127.0.0.1:3537:3537"
```

这表示公网不能直接访问 `3537`，需要通过 Nginx 或宝塔面板反向代理访问。

如果你想把宿主机本地端口改成 `3536`，只改左边：

```yaml
ports:
  - "127.0.0.1:3536:3537"
```

然后反代地址填写：

```text
http://127.0.0.1:3536
```

`.env` 建议保持：

```env
HOST=0.0.0.0
PORT=3537
```

Docker 容器里不要把 `HOST` 改成 `127.0.0.1`，否则服务可能只监听容器内部自己的本地地址，导致端口映射访问不到。

## 反向代理

如果使用 Nginx 或宝塔面板反向代理，把域名代理到：

```text
http://127.0.0.1:3537
```

启用 HTTPS 后，把 `.env` 改成：

```env
COOKIE_SECURE=true
TRUST_PROXY=true
```

如果只是 HTTP 或本地测试，保持：

```env
COOKIE_SECURE=false
TRUST_PROXY=false
```

宝塔面板可以这样配置：

1. 添加站点并绑定域名
2. 给站点申请 SSL 证书并开启 HTTPS
3. 打开站点设置里的反向代理
4. 目标 URL 填 `http://127.0.0.1:3537`
5. 发送域名保持 `$host`
6. 保存后访问域名

## Ubuntu 24 安装 Docker

如果 VPS 还没有 Docker：

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

有些服务器环境提供的是旧命令 `docker-compose`，所以快速部署部分使用 `docker-compose`，兼容性更好。

## 本地 Node.js 运行

如果不使用 Docker，本地需要 Node.js 22 或更新版本：

```bash
cp .env.example .env
node server.js
```

默认访问：

```text
http://localhost:3537
```

## 数据和备份

所有数据都在：

```text
data/subscription-dock.json
```

可以直接备份这个文件，也可以在网页设置页导出 JSON。

## 到期提醒

在网页「设置」里选择通知渠道并填写对应字段：

- `Pushover API Token`
- `Pushover User Key`
- `Bark Server URL`，通常可填 `https://api.day.app`
- `Bark Device Key`
- `Telegram Bot Token`
- `Telegram Chat ID`
- 提前提醒天数，例如 `3`

打开「启用到期提醒」并保存后，服务会在启动后检查一次，之后每小时检查一次。同一个订阅、同一个续费日只会推送一次。

