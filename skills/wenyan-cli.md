# WenYan CLI

微信公众号 Markdown 渲染和发布工具，支持将 Markdown 文档转换为样式化的 HTML 并直接发布到微信公众号。

## 主要功能

- **渲染**：将 Markdown 转换为微信公众号兼容的 HTML
- **发布**：直接发布到微信公众号（本地模式或服务器模式）
- **主题**：管理内置和自定义主题
- **服务**：启动 HTTP API 服务器
- **AI 生图**：集成 AI 生图服务（如七牛云）
- **草稿发布**：发布已有的草稿文章

## 安装

```bash
pnpm install -g @hocgin/wenyan-cli
```

## 主要命令

### 1. publish - 渲染并发布

将 Markdown 渲染为 HTML 并发布到微信公众号。

#### 本地模式（直接发布）

```bash
# 从字符串输入发布
wenyan publish "Hello World" --appId your_app_id --appSecret your_app_secret

# 从文件发布
wenyan publish -f README.md --appId your_app_id --appSecret your_app_secret

# 从 URL 发布
wenyan publish -f https://example.com/article.md --appId your_app_id --appSecret your_app_secret
```

#### 服务器模式（通过远程服务器）

```bash
# 通过远程服务器发布
wenyan publish -f article.md \
  --server https://api.yourdomain.com \
  --api-key your_api_key
```

### 2. render - 仅渲染

将 Markdown 渲染为 HTML，不发布。

```bash
# 从字符串渲染
wenyan render "# Hello World"

# 从文件渲染
wenyan render -f README.md

# 输出到文件
wenyan render -f README.md > output.html
```

### 3. theme - 主题管理

管理内置和自定义主题。

```bash
# 列出所有主题
wenyan theme --list

# 添加自定义主题
wenyan theme --add --name my-theme --path /path/to/theme.css

# 删除自定义主题
wenyan theme --rm my-theme
```

### 4. serve - 启动服务器

启动 HTTP API 服务器提供渲染和发布接口。

```bash
# 启动服务器（默认端口 3000）
wenyan serve

# 指定端口
wenyan serve -p 8080

# 启用 API 认证
wenyan serve --api-key your_secret_key
```

### 5. image - AI 生图

使用 AI 服务生成图片。

```bash
# 使用七牛云生图
wenyan image \
  --service qiniu \
  --model kling-v1-5 \
  --token your_token \
  --prompt "一只可爱的小猫" \
  --path ./output.png \
  --timeout 180 \
  --aspect-ratio 16:9
```

### 6. submit - 发布草稿

发布已有的草稿文章。

```bash
wenyan submit \
  --appId your_app_id \
  --appSecret your_app_secret \
  --mediaId your_media_id
```

## 通用选项

适用于 `publish` 和 `render` 命令：

| 选项 | 简写 | 说明 | 默认值 |
|------|------|------|--------|
| `--file <path>` | `-f` | 从文件或 URL 读取内容 | - |
| `--theme <theme-id>` | `-t` | 使用指定主题 | `default` |
| `--highlight <theme-id>` | `-h` | 代码高亮主题 | `solarized-light` |
| `--custom-theme <path>` | `-c` | 自定义主题 CSS 文件路径 | - |
| `--mac-style` | - | 显示 Mac 风格代码块 | `true` |
| `--no-mac-style` | - | 禁用 Mac 风格代码块 | - |
| `--footnote` | - | 将链接转换为脚注 | `true` |
| `--no-footnote` | - | 禁用脚注转换 | - |

## 使用示例

### 完整发布流程

```bash
# 1. 渲染并发布文章
wenyan publish -f article.md \
  --appId wx1234567890abcdef \
  --appSecret your_secret_key \
  --theme github \
  --highlight monokai

# 2. 仅预览渲染结果
wenyan render -f article.md > preview.html

# 3. 添加自定义主题后发布
wenyan theme --add --name my-brand --path brand.css
wenyan publish -f article.md --theme my-brand
```

### 服务器模式部署

```bash
# 1. 启动服务器
wenyan serve -p 3000 --api-key secret_key

# 2. 客户端通过服务器发布
wenyan publish -f article.md \
  --server http://localhost:3000 \
  --api-key secret_key
```

### AI 生图集成

```bash
# 生成文章配图
wenyan image \
  --service qiniu \
  --model kling-v1-5 \
  --token your_qiniu_token \
  --prompt "科技感未来城市" \
  --path ./images/cover.png \
  --aspect-ratio 16:9

# 发布文章（可配合使用）
wenyan publish -f article.md --appId your_app_id --appSecret your_secret
```

## 工作模式

### 本地模式
- 直接在本地调用微信公众号 API
- 需要 appId 和 appSecret
- 适合个人使用

### 服务器模式
- 通过远程服务器进行渲染和发布
- 需要 server URL 和 api-key
- 适合团队协作和部署

## 错误处理

所有命令都包含统一的错误处理：
- 错误信息会以红色显示在 stderr
- 非 0 退出码表示失败
- 详细的错误消息帮助快速定位问题

## 常见问题

### 主题列表为空
```bash
wenyan theme --list
```

### 发布失败
检查 appId 和 appSecret 是否正确，确保网络连接正常。

### 生图超时
调整 `--timeout` 参数（默认 180 秒）。

## 相关资源

- GitHub: https://github.com/hocgin/wenyan-cli
- 文档: https://docs.wenyan-cli.com
