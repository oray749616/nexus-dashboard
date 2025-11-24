/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark';

/**
 * 光球配置
 */
export interface OrbConfig {
  color: string;
  blur: string;
}

/**
 * 光球主题（多个光球配置的数组）
 */
export type OrbTheme = OrbConfig[];

/**
 * 背景光球完整配置
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
