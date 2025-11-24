import { BackgroundOrb, OrbTheme } from '@/lib/types'

/**
 * 生成随机位置配置
 * 确保垂直和水平方向各有一个定位值
 */
export const randomPosition = () => {
  const useTop = Math.random() > 0.5
  const useLeft = Math.random() > 0.5

  return {
    top: useTop ? `${Math.random() * 30 - 10}%` : 'auto',
    bottom: !useTop ? `${Math.random() * 30 - 10}%` : 'auto',
    left: useLeft ? `${Math.random() * 40 - 10}%` : 'auto',
    right: !useLeft ? `${Math.random() * 40 - 10}%` : 'auto',
  }
}

/**
 * 生成背景光球
 * @param themes - 主题数组
 * @param animations - 动画类名数组
 * @returns 背景光球配置数组
 */
export const generateBackgroundOrbs = (
  themes: OrbTheme[],
  animations: string[]
): BackgroundOrb[] => {
  // 随机选择一个主题
  const selectedTheme = themes[Math.floor(Math.random() * themes.length)]

  // 为每个光球生成随机位置和大小
  return selectedTheme.map((orb, index) => ({
    ...randomPosition(),
    size: `${35 + Math.random() * 30}%`, // 35-65%
    color: orb.color,
    blur: orb.blur,
    animation: animations[index % animations.length],
  }))
}
