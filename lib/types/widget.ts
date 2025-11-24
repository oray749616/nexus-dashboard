/**
 * Widget 激活状态类型
 */
export type ActiveWidget = 'weather' | 'calendar' | 'todo' | 'notes' | 'currency' | 'password' | null;

/**
 * 天气数据结构
 */
export interface WeatherData {
  temperature: number;
  weathercode: number;
  city: string;
}
