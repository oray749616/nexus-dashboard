'use client'

import React, { useEffect, useRef, useMemo, useState } from 'react'
import { createNoise2D, type NoiseFunction2D } from 'simplex-noise'
import { ORB_THEMES } from '@/lib/constants'
import type { AnimatedOrbConfig } from '@/lib/types'

interface BackgroundOrbsProps {
  className?: string
}

/**
 * 背景光球组件 - 使用 Simplex Noise 实现流体漂移动画
 *
 * 特性：
 * - 光球在整个视口范围内随机漂移
 * - 每个光球有独立的运动轨迹
 * - 使用 requestAnimationFrame + 直接 DOM 操作，避免 React re-render
 * - 支持 light/dark 主题切换
 */
export const BackgroundOrbs: React.FC<BackgroundOrbsProps> = ({ className }) => {
  const [isClient, setIsClient] = useState(false)
  const orbRefs = useRef<(HTMLDivElement | null)[]>([])
  const animationRef = useRef<number | null>(null)
  const noiseRef = useRef<NoiseFunction2D | null>(null)

  // 客户端初始化时生成光球配置
  const orbs = useMemo<AnimatedOrbConfig[]>(() => {
    if (!isClient) return []

    // 随机选择主题
    const theme = ORB_THEMES[Math.floor(Math.random() * ORB_THEMES.length)]

    return theme.map((config, index) => ({
      id: `orb-${index}`,
      color: config.color,
      blur: config.blur,
      size: 35 + Math.random() * 30, // 35-65%
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000,
      noiseOffsetScale: Math.random() * 1000,
      speed: 0.0001 + Math.random() * 0.0002, // 0.0003-0.0005 较快流动
    }))
  }, [isClient])

  // 确保仅在客户端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 动画循环
  useEffect(() => {
    if (orbs.length === 0) return

    // 初始化 noise 函数
    noiseRef.current = createNoise2D()

    const animate = (timestamp: number) => {
      const noise = noiseRef.current
      if (!noise) return

      orbs.forEach((orb, index) => {
        const element = orbRefs.current[index]
        if (!element) return

        const time = timestamp * orb.speed

        // 计算 noise 值 (-1 到 1)
        const noiseX = noise(orb.noiseOffsetX, time)
        const noiseY = noise(orb.noiseOffsetY, time)
        const noiseScale = noise(orb.noiseOffsetScale, time * 0.5)

        // 映射到屏幕坐标 (-20% 到 120% 允许超出边界)
        const x = ((noiseX + 1) / 2) * 140 - 20
        const y = ((noiseY + 1) / 2) * 140 - 20
        // 缩放范围 0.85 到 1.15
        const scale = 0.85 + ((noiseScale + 1) / 2) * 0.3

        // 直接操作 DOM，避免 React re-render
        element.style.transform = `translate(${x}vw, ${y}vh) scale(${scale})`
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // 页面可见性处理 - 隐藏时暂停动画节省性能
    const handleVisibility = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      } else {
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [orbs])

  // 服务端渲染时返回空容器，避免 hydration mismatch
  if (!isClient || orbs.length === 0) {
    return <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${className || ''}`} />
  }

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${className || ''}`}>
      {orbs.map((orb, index) => (
        <div
          key={orb.id}
          ref={el => { orbRefs.current[index] = el }}
          className={`absolute rounded-full ${orb.color} ${orb.blur} transition-colors duration-1000 will-change-transform`}
          style={{
            width: `${orb.size}%`,
            height: `${orb.size}%`,
            // 初始位置，动画启动后会被 transform 覆盖
            transform: `translate(${orb.initialX}vw, ${orb.initialY}vh)`,
          }}
        />
      ))}
    </div>
  )
}

export default BackgroundOrbs
