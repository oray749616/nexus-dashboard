import { Shortcut } from '@/lib/types'

/**
 * 安全保存到 localStorage，带配额管理
 * 存储满时自动删除最旧的自定义图标
 */
export const saveToLocalStorage = (key: string, data: Shortcut[]): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    // 检测配额超限错误
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage 配额不足，正在尝试自动清理自定义图标...')

      // 查找所有带自定义图标的快捷方式，按时间排序（假设 ID 越小越旧）
      const customIconShortcuts = data.filter(s => s.customIcon)

      if (customIconShortcuts.length === 0) {
        // 没有自定义图标可清理，无法解决配额问题
        alert('存储配额已满！请删除一些快捷方式或清理浏览器缓存。')
        return false
      }

      // 移除最旧的自定义图标（保留快捷方式本身）
      const oldestCustomIcon = customIconShortcuts[0]
      const cleanedData = data.map(s =>
        s.id === oldestCustomIcon.id ? { ...s, customIcon: undefined } : s
      )

      // 显示友好提示
      const message = `存储配额已满。已自动移除 "${oldestCustomIcon.title}" 的自定义图标。\n将使用默认网站图标代替。`
      console.warn(message)

      // 延迟弹窗避免阻塞 UI
      setTimeout(() => alert(message), 100)

      // 递归重试
      return saveToLocalStorage(key, cleanedData)
    }

    // 其他错误
    console.error('localStorage 保存失败:', error)
    return false
  }
}
