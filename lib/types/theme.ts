/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark';

/**
 * RGB 颜色配置
 */
export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  opacity: number;
}

/**
 * 光球配置（新版 - 使用 RGB 值）
 */
export interface OrbConfig {
  lightColor: RGBAColor;
  darkColor: RGBAColor;
  blur: number; // 像素值
}

/**
 * 光球主题（多个光球配置的数组）
 */
export type OrbTheme = OrbConfig[];

/**
 * 背景光球完整配置（旧版 CSS 动画，保留兼容）
 */
export interface BackgroundOrb {
  top: string;
  bottom: string;
  left: string;
  right: string;
  size: string;
  color: string;
  blur: string;
  animation: string;
}

/**
 * 动画光球配置（JavaScript 动画版本 - v4 使用内联样式）
 */
export interface AnimatedOrbConfig {
  id: string;
  size: number;              // 35-65 (百分比)
  initialX: number;          // 初始 X 坐标 (0-100)
  initialY: number;          // 初始 Y 坐标 (0-100)
  noiseOffsetX: number;      // Noise 采样偏移 X
  noiseOffsetY: number;      // Noise 采样偏移 Y
  noiseOffsetScale: number;  // Noise 采样偏移 (缩放)
  speed: number;             // 运动速度因子
}
