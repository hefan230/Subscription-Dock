# Subscription-Dock
Manage all your subscriptions online.
Visitor Test：https://subscriptions.hefan.me/
轻量自托管订阅管理面板，适合通过docker部署。当前版本不依赖 npm 第三方包，后端使用 Node.js 标准库，数据保存在 `data/subscription-dock.json`。

## 功能

- 管理订阅、域名、VPS、许可证、云服务等周期性支出
- 登录保护，可在设置中开启只读访客访问
- 新增、编辑、删除、续期
- 上传 400x400 自定义图标
- 月均支出、年化支出、30 天内续费、按付款货币自动统计，总览可临时切换折算货币
- 多货币换算，支持 CNY、USD、JPY、EUR、TRY、INR、SGD、BRL、GBP、NGN、CAD、AUD、HKD、PHP、MYR、PKR
- 设置页可一键刷新参考汇率，默认使用无需 API key 的 Frankfurter 公共汇率接口
- 图标库管理，可上传、重命名、删除 400x400 的 PNG、JPG、WebP 图标，单个图标限制 20KB
- Pushover、Bark、Telegram 到期提醒，默认提前 3 天推送
- JSON 备份导入、导出
- Docker / Docker Compose 部署

## Docker 部署
下载subscription-dock-v1.7z到服务器上解压
进入目录修改.env配置文件，设置账号密码

进入解压后的目录执行启动docker容器
docker-compose down
docker-compose up -d --build

```bash
# 如果项目目录里还没有 .env，再复制示例文件
cp .env.example .env
nano .env
mkdir -p data
docker compose up -d --build
```

如果你不使用反向代理，可以临时访问：

```text
http://你的服务器IP:3537
```

更推荐使用 Nginx / 宝塔反向代理。当前 `compose.yaml` 默认只把服务绑定到 VPS 本机：

```yaml
ports:
  - "127.0.0.1:3537:3537"
```

这样公网不能直接访问 `3537`，只能通过 Nginx 代理访问。

登录账号、密码和 `SESSION_SECRET` 都放在 `.env` 里。开源示例默认账号和密码都是 `admin`，正式部署到公网前请务必修改：

```bash
ADMIN_USER=admin
ADMIN_PASSWORD=admin
SESSION_SECRET=change-this-to-a-long-random-string
```

建议把 `ADMIN_USER`、`ADMIN_PASSWORD` 都改成自己的值，并用一串长随机字符串作为 `SESSION_SECRET`。登录接口带有简单限速：同一来源用户名或密码连续错误 3 次后会封禁 30 分钟。如果只允许通过 Nginx 反向代理访问，可以设置 `TRUST_PROXY=true`，否则保持默认 `false`。

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

## 本地运行

需要 Node.js 22 或更新版本。

```bash
cp .env.example .env
node server.js
```

默认地址：

```text
http://localhost:3537
```

## 数据备份

所有数据都在：

```text
data/subscription-dock.json
```

直接备份这个文件即可。也可以在网页设置里导出 JSON。

## 到期提醒

在网页的「设置」里选择通知渠道并填写对应字段：

- `Pushover API Token`
- `Pushover User Key`
- `Bark Server URL`，默认可填 `https://api.day.app`
- `Bark Device Key`
- `Telegram Bot Token`
- `Telegram Chat ID`
- 提前提醒天数，例如 `3`

打开「启用到期提醒」并保存后，服务会在启动后检查一次，之后每小时检查一次。到达提醒条件时，同一个订阅、同一个续费日只会推送一次。可以先点击「测试通知」确认当前渠道配置可用。

## 反向代理

如果你使用 Nginx 或宝塔反向代理，可以把域名代理到：

```text
http://127.0.0.1:3537
```

启用 HTTPS 后，把 `.env` 里的配置改成：

```bash
COOKIE_SECURE=true
TRUST_PROXY=true
```

如果只通过 HTTP 或内网 IP 访问，保持 `COOKIE_SECURE=false`。如果你没有配置反向代理，保持 `TRUST_PROXY=false`。

宝塔面板里可以这样配置：

1. 添加站点并绑定你的域名
2. 给站点申请 SSL 证书并开启强制 HTTPS
3. 打开站点设置里的反向代理
4. 目标 URL 填 `http://127.0.0.1:3537`
5. 发送域名保持 `$host`
6. 保存后访问你的域名
