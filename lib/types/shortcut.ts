/**
 * 快捷方式数据结构
 */
export interface Shortcut {
  id: string;
  title: string;
  url: string;
  customIcon?: string; // Base64 编码的自定义图标
}

/**
 * 右键菜单状态
 */
export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  shortcutId: string | null; // null 表示点击背景（添加新快捷方式）
}

/**
 * 模态框状态
 */
export interface ModalState {
  isOpen: boolean;
  type: 'add' | 'edit' | null;
  shortcutId?: string;
}
