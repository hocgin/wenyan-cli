# WenYan CLI

WenYan CLI 是一个 Markdown 渲染和发布工具。这个技能以**服务器模式**为主，帮助你搭建远程发布链路，适合固定 IP、团队协作和自动化发文场景。

## 这个技能主要解决什么

- 本地机器没有固定公网 IP
- 需要统一管理多个公众号
- 需要 CI/CD 或 AI Agent 自动发布
- 需要把微信公众号 API 调用集中放到服务端

## 核心命令

### 1. 启动服务器

```bash
pnpm add -g @wenyan-md/cli
wenyan serve --port 3000 --api-key your_secret_key
```

### 2. 通过远程服务器发布

```bash
wenyan publish -f article.md \
  --server https://api.yourdomain.com \
  --api-key your_secret_key
  --appId your_app_id \
  --appSecret your_app_secret \
```

客户端负责读取 Markdown 和图片，服务端负责上传素材并创建草稿。

### 3. 本地模式直接发布

```bash
wenyan publish -f article.md \
  --appId your_app_id \
  --appSecret your_app_secret
```

### 4. 发布草稿

```bash
wenyan submit \
  --appId your_app_id \
  --appSecret your_app_secret \
  --mediaId your_media_id
```

## 服务器模式说明

服务器模式的推荐流程是：

1. 在云服务器上启动 `wenyan serve`
2. 客户端执行 `wenyan publish --server ... --api-key ...`

## 部署建议

- 使用云服务器或固定 IP 主机
- 开启 `--api-key` 做基础鉴权
- 将公众号凭据放在服务端环境变量中
- 对外只暴露必要端口

## 常见选项

### `serve`

| 选项 | 说明 | 默认值 |
| --- | --- | --- |
| `-p, --port <port>` | 监听端口 | `3000` |
| `--api-key <apiKey>` | 服务端认证密钥 | - |

### `publish`

| 选项 | 说明 | 默认值 |
| --- | --- | --- |
| `-f, --file <path>` | 从本地文件或 URL 读取 Markdown | - |
| `--server <url>` | 远程 Wenyan Server 地址 | - |
| `--api-key <apiKey>` | 远程服务密钥 | - |
| `--appId <appId>` | 本地直连公众号 API 的 appId | - |
| `--appSecret <appSecret>` | 本地直连公众号 API 的 appSecret | - |
| `-t, --theme <theme-id>` | 排版主题 | `default` |
| `-h, --highlight <theme-id>` | 代码高亮主题 | `solarized-light` |
| `-c, --custom-theme <path>` | 自定义主题 CSS | - |
| `--no-mac-style` | 禁用 Mac 风格代码块 | 启用 |
| `--no-footnote` | 禁用脚注转换 | 启用 |

## 使用示例

### 启动服务器并检查健康状态

```bash
wenyan serve --port 3000 --api-key secret_key
curl http://localhost:3000/health
```

### 客户端远程发布

```bash
wenyan publish -f ./article.md \
  --server http://localhost:3000 \
  --api-key secret_key
```


## 工作模式对比

- 本地模式：直接在本机调用微信公众号 API
- `publish` 可以直接携带 `--appId` 和 `--appSecret`
- 服务器模式：客户端只负责提交内容，公众号 API 调用由服务端完成

如果你主要关心部署和自动化，优先看服务器模式。
