export interface Shortcut {
  id: string;
  title: string;
  url: string;
  customIcon?: string; // Base64 编码的自定义图标
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  shortcutId: string | null; // null means clicked on background (add new)
}

export interface ModalState {
  isOpen: boolean;
  type: 'add' | 'edit' | null;
  shortcutId?: string;
}
