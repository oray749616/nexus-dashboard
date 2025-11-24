# Public Assets

此目录存放静态资源文件，可直接通过 URL 访问。

## 目录结构

- `icons/` - 图标资源（SVG, PNG）
- `images/` - 图片资源（背景图、占位图等）
- `fonts/` - 本地字体文件（如需自托管字体）

## 使用示例

```tsx
// Next.js Image 组件
import Image from 'next/image'
<Image src="/images/logo.png" alt="Logo" width={100} height={100} />

// 直接引用
<img src="/icons/default-favicon.svg" alt="Icon" />
```

## 注意事项

- 静态资源会被 Next.js 自动优化
- 文件路径区分大小写
- 不要在 public 目录中使用与 app/ 目录重名的文件夹
