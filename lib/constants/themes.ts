import { OrbTheme } from '@/lib/types'

/**
 * 背景光球主题配置（v4 版本 - 使用 RGB 值）
 * 包含 6 种不同的配色方案
 */
export const ORB_THEMES: OrbTheme[] = [
  // Theme 1: Purple Dream (原版靛蓝紫色系)
  [
    {
      lightColor: { r: 199, g: 210, b: 254, opacity: 0.4 }, // indigo-200/40
      darkColor: { r: 49, g: 46, b: 129, opacity: 0.2 },    // indigo-900/20
      blur: 120,
    },
    {
      lightColor: { r: 251, g: 207, b: 232, opacity: 0.4 }, // pink-200/40
      darkColor: { r: 88, g: 28, b: 135, opacity: 0.2 },    // purple-900/20
      blur: 100,
    },
    {
      lightColor: { r: 219, g: 234, b: 254, opacity: 0.5 }, // blue-100/50
      darkColor: { r: 15, g: 23, b: 42, opacity: 0.4 },     // slate-900/40
      blur: 130,
    },
  ],

  // Theme 2: Ocean Breeze (海洋蓝绿色系)
  [
    {
      lightColor: { r: 165, g: 243, b: 252, opacity: 0.4 }, // cyan-200/40
      darkColor: { r: 22, g: 78, b: 99, opacity: 0.2 },     // cyan-900/20
      blur: 110,
    },
    {
      lightColor: { r: 153, g: 246, b: 228, opacity: 0.4 }, // teal-200/40
      darkColor: { r: 19, g: 78, b: 74, opacity: 0.2 },     // teal-900/20
      blur: 120,
    },
    {
      lightColor: { r: 191, g: 219, b: 254, opacity: 0.5 }, // blue-200/50
      darkColor: { r: 30, g: 58, b: 138, opacity: 0.3 },    // blue-900/30
      blur: 130,
    },
    {
      lightColor: { r: 224, g: 242, b: 254, opacity: 0.4 }, // sky-100/40
      darkColor: { r: 8, g: 47, b: 73, opacity: 0.2 },      // sky-950/20
      blur: 100,
    },
  ],

  // Theme 3: Sunset Glow (日落橙红色系)
  [
    {
      lightColor: { r: 254, g: 215, b: 170, opacity: 0.4 }, // orange-200/40
      darkColor: { r: 124, g: 45, b: 18, opacity: 0.2 },    // orange-900/20
      blur: 115,
    },
    {
      lightColor: { r: 254, g: 205, b: 211, opacity: 0.4 }, // rose-200/40
      darkColor: { r: 136, g: 19, b: 55, opacity: 0.2 },    // rose-900/20
      blur: 125,
    },
    {
      lightColor: { r: 254, g: 243, b: 199, opacity: 0.5 }, // amber-100/50
      darkColor: { r: 69, g: 26, b: 3, opacity: 0.25 },     // amber-950/25
      blur: 120,
    },
  ],

  // Theme 4: Forest Whisper (森林绿色系)
  [
    {
      lightColor: { r: 167, g: 243, b: 208, opacity: 0.4 }, // emerald-200/40
      darkColor: { r: 6, g: 78, b: 59, opacity: 0.2 },      // emerald-900/20
      blur: 120,
    },
    {
      lightColor: { r: 217, g: 249, b: 157, opacity: 0.4 }, // lime-200/40
      darkColor: { r: 26, g: 46, b: 5, opacity: 0.2 },      // lime-950/20
      blur: 110,
    },
    {
      lightColor: { r: 220, g: 252, b: 231, opacity: 0.5 }, // green-100/50
      darkColor: { r: 5, g: 46, b: 22, opacity: 0.3 },      // green-950/30
      blur: 130,
    },
    {
      lightColor: { r: 204, g: 251, b: 241, opacity: 0.4 }, // teal-100/40
      darkColor: { r: 4, g: 47, b: 46, opacity: 0.2 },      // teal-950/20
      blur: 100,
    },
  ],

  // Theme 5: Candy Pop (糖果粉色系)
  [
    {
      lightColor: { r: 249, g: 168, b: 212, opacity: 0.4 }, // pink-300/40
      darkColor: { r: 131, g: 24, b: 67, opacity: 0.2 },    // pink-900/20
      blur: 125,
    },
    {
      lightColor: { r: 245, g: 208, b: 254, opacity: 0.4 }, // fuchsia-200/40
      darkColor: { r: 112, g: 26, b: 117, opacity: 0.2 },   // fuchsia-900/20
      blur: 115,
    },
    {
      lightColor: { r: 233, g: 213, b: 255, opacity: 0.5 }, // purple-200/50
      darkColor: { r: 59, g: 7, b: 100, opacity: 0.25 },    // purple-950/25
      blur: 120,
    },
  ],

  // Theme 6: Midnight Aurora (极光紫蓝色系)
  [
    {
      lightColor: { r: 221, g: 214, b: 254, opacity: 0.4 }, // violet-200/40
      darkColor: { r: 76, g: 29, b: 149, opacity: 0.2 },    // violet-900/20
      blur: 120,
    },
    {
      lightColor: { r: 165, g: 180, b: 252, opacity: 0.4 }, // indigo-300/40
      darkColor: { r: 23, g: 23, b: 71, opacity: 0.25 },    // indigo-950/25
      blur: 130,
    },
    {
      lightColor: { r: 243, g: 232, b: 255, opacity: 0.5 }, // purple-100/50
      darkColor: { r: 59, g: 7, b: 100, opacity: 0.3 },     // purple-950/30
      blur: 110,
    },
    {
      lightColor: { r: 191, g: 219, b: 254, opacity: 0.4 }, // blue-200/40
      darkColor: { r: 23, g: 37, b: 84, opacity: 0.2 },     // blue-950/20
      blur: 115,
    },
  ],
]
