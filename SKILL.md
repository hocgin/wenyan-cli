# Wenyan CLI 服务器模式技能

这个技能主要用于 Wenyan CLI 的**服务器模式**，重点覆盖：

- 启动 `wenyan serve`
- 使用 `wenyan publish --server ...` 连接远程服务
- `publish` 本地模式下使用 `--appId` / `--appSecret`
- 配置 API Key 认证
- 部署在固定 IP / 云服务器 / CI 场景下的发布流程

## 先看结论

如果你的机器没有固定公网 IP，或者需要统一管理多个公众号，优先使用服务器模式；如果是本地直连公众号 API，则给 `publish` 传 `--appId` 和 `--appSecret`：

1. 在云服务器上启动 Wenyan Server
2. 客户端通过 `--server` 和 `--api-key` 远程发布
3. 本地模式下，`publish` 直接携带 `--appId` 和 `--appSecret`

## 服务端启动

```bash
pnpm add -g @wenyan-md/cli
wenyan serve --port 3000 --api-key your-secret-key
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `--port` / `-p` | 服务端口 | `3000` |
| `--api-key` | 服务端认证密钥 | - |

## 客户端发布

```bash
wenyan publish -f article.md \
  --server https://api.example.com \
  --api-key your-secret-key
```

本地直连公众号 API 时，也可以直接传参：

```bash
wenyan publish -f article.md \
  --appId your_app_id \
  --appSecret your_app_secret
```

说明：

- `--server` 指向 Wenyan Server 地址
- `--api-key` 必须与服务端一致
- `--appId` / `--appSecret` 适用于本地直连公众号 API
- 客户端负责读取 Markdown、上传文件并发起发布请求

## 服务端接口

Server 模式会暴露以下接口：

- `GET /health`：健康检查
- `GET /verify`：鉴权探针
- `POST /upload`：上传 Markdown、图片或主题文件
- `POST /publish`：触发远程发布

## 适用场景

- 需要绕过微信公众号 IP 白名单
- 需要多公众号统一管理
- 需要 CI/CD 自动发布
- 需要 AI Agent 自动发文

## 关键环境变量

服务端建议配置：

```bash
export WECHAT_APP_ID=xxx
export WECHAT_APP_SECRET=xxx
```

如果只管理一个公众号，也可以把凭据放在服务端运行环境里，减少客户端参数传递。

## 参考文档

- [Server 模式文档](docs/server.md)
- [发布命令文档](docs/publish.md)
