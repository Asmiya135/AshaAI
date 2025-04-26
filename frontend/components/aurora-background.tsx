"use client"

import { useEffect, useRef } from "react"

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawAurora = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bgGradient.addColorStop(0, "rgba(2, 44, 34, 0.5)")
      bgGradient.addColorStop(1, "rgba(0, 0, 0, 0.5)")

      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw aurora waves
      for (let i = 0; i < 5; i++) {
        drawWave(ctx, time + i, i * 0.2, canvas.width, canvas.height, i)
      }

      time += 0.005
      animationFrameId = requestAnimationFrame(drawAurora)
    }

    const drawWave = (
      ctx: CanvasRenderingContext2D,
      time: number,
      offset: number,
      width: number,
      height: number,
      index: number,
    ) => {
      const colors = [
        "rgba(16, 185, 129, 0.2)", // emerald-500
        "rgba(5, 150, 105, 0.15)", // emerald-600
        "rgba(4, 120, 87, 0.1)", // emerald-700
        "rgba(20, 184, 166, 0.15)", // teal-500
        "rgba(13, 148, 136, 0.2)", // teal-600
      ]

      const y = height * 0.5
      const amplitude = 50 + index * 10
      const frequency = 0.005 - index * 0.0005

      ctx.beginPath()
      ctx.moveTo(0, y)

      for (let x = 0; x < width; x++) {
        const dx = x * frequency + time + offset
        const dy = Math.sin(dx) * amplitude
        ctx.lineTo(x, y + dy)
      }

      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()

      const gradient = ctx.createLinearGradient(0, y - amplitude, 0, height)
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)")
      gradient.addColorStop(0.5, colors[index])
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fill()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    drawAurora()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}
