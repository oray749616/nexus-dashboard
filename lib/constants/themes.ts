import { OrbTheme } from '@/lib/types'

/**
 * 背景光球主题配置
 * 包含 6 种不同的配色方案
 */
export const ORB_THEMES: OrbTheme[] = [
  // Theme 1: Purple Dream (原版靛蓝紫色系)
  [
    { color: 'bg-indigo-200/40 dark:bg-indigo-900/20', blur: 'blur-[120px]' },
    { color: 'bg-pink-200/40 dark:bg-purple-900/20', blur: 'blur-[100px]' },
    { color: 'bg-blue-100/50 dark:bg-slate-900/40', blur: 'blur-[130px]' },
  ],
  // Theme 2: Ocean Breeze (海洋蓝绿色系)
  [
    { color: 'bg-cyan-200/40 dark:bg-cyan-900/20', blur: 'blur-[110px]' },
    { color: 'bg-teal-200/40 dark:bg-teal-900/20', blur: 'blur-[120px]' },
    { color: 'bg-blue-200/50 dark:bg-blue-900/30', blur: 'blur-[130px]' },
    { color: 'bg-sky-100/40 dark:bg-sky-950/20', blur: 'blur-[100px]' },
  ],
  // Theme 3: Sunset Glow (日落橙红色系)
  [
    { color: 'bg-orange-200/40 dark:bg-orange-900/20', blur: 'blur-[115px]' },
    { color: 'bg-rose-200/40 dark:bg-rose-900/20', blur: 'blur-[125px]' },
    { color: 'bg-amber-100/50 dark:bg-amber-950/25', blur: 'blur-[120px]' },
  ],
  // Theme 4: Forest Whisper (森林绿色系)
  [
    { color: 'bg-emerald-200/40 dark:bg-emerald-900/20', blur: 'blur-[120px]' },
    { color: 'bg-lime-200/40 dark:bg-lime-950/20', blur: 'blur-[110px]' },
    { color: 'bg-green-100/50 dark:bg-green-950/30', blur: 'blur-[130px]' },
    { color: 'bg-teal-100/40 dark:bg-teal-950/20', blur: 'blur-[100px]' },
  ],
  // Theme 5: Candy Pop (糖果粉色系)
  [
    { color: 'bg-pink-300/40 dark:bg-pink-900/20', blur: 'blur-[125px]' },
    { color: 'bg-fuchsia-200/40 dark:bg-fuchsia-900/20', blur: 'blur-[115px]' },
    { color: 'bg-purple-200/50 dark:bg-purple-950/25', blur: 'blur-[120px]' },
  ],
  // Theme 6: Midnight Aurora (极光紫蓝色系)
  [
    { color: 'bg-violet-200/40 dark:bg-violet-900/20', blur: 'blur-[120px]' },
    { color: 'bg-indigo-300/40 dark:bg-indigo-950/25', blur: 'blur-[130px]' },
    { color: 'bg-purple-100/50 dark:bg-purple-950/30', blur: 'blur-[110px]' },
    { color: 'bg-blue-200/40 dark:bg-blue-950/20', blur: 'blur-[115px]' },
  ],
]

/**
 * 背景动画类名数组
 */
export const BACKGROUND_ANIMATIONS = ['animate-float-1', 'animate-float-2', 'animate-float-3']
