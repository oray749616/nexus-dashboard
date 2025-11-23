/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 React 严格模式
  reactStrictMode: true,

  // 图片域名白名单（用于外部图标获取）
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.google.com' },
      { protocol: 'https', hostname: 'icons.duckduckgo.com' },
      { protocol: 'https', hostname: 'icon.horse' },
      { protocol: 'https', hostname: 'logo.clearbit.com' },
    ],
  },
}

export default nextConfig
