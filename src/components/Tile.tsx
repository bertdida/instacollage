import React, { useRef, useState, useLayoutEffect } from 'react'
import { IconPlus } from '@tabler/icons-react'
import cn from '../cn'

type TileProps = {
  src: string
  onPick: (file: File) => void
  className?: string
  ImageProps?: React.ImgHTMLAttributes<HTMLImageElement>
}

const Tile: React.FC<TileProps> = ({ src, onPick, className, ImageProps }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [bounds, setBounds] = useState({ minX: 0, maxX: 0, minY: 0, maxY: 0 })
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )

  // Calculate bounds for clamping
  useLayoutEffect(() => {
    const container = containerRef.current
    const img = imgRef.current
    if (!container || !img) return
    const cRect = container.getBoundingClientRect()
    const cW = cRect.width,
      cH = cRect.height
    const iW = img.naturalWidth,
      iH = img.naturalHeight
    if (!iW || !iH) return
    const scale = Math.max(cW / iW, cH / iH)
    const displayW = iW * scale
    const displayH = iH * scale
    const maxX = (displayW - cW) / 2
    const maxY = (displayH - cH) / 2
    setBounds({ minX: -maxX, maxX: maxX, minY: -maxY, maxY: maxY })
    setOffset((prev) => ({
      x: Math.max(-maxX, Math.min(maxX, prev.x)),
      y: Math.max(-maxY, Math.min(maxY, prev.y)),
    }))
  }, [src])

  // Mouse/touch event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    if (e.button !== 0) return // Only left click
    setDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!dragging || !dragStart) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    setOffset((prev) => {
      let newX = prev.x + dx
      let newY = prev.y + dy
      newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX))
      newY = Math.max(bounds.minY, Math.min(bounds.maxY, newY))
      return { x: newX, y: newY }
    })
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    setDragging(false)
    setDragStart(null)
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative block cursor-pointer touch-none overflow-hidden focus:outline-none',
        className,
      )}
    >
      <button
        onClick={() => inputRef.current?.click()}
        aria-label="Change image"
        className="absolute right-2 bottom-2 z-10 flex h-10 w-10 cursor-pointer flex-col items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <IconPlus className="h-8 w-8 text-white" />
      </button>

      <img
        ref={imgRef}
        crossOrigin="anonymous"
        className={cn(
          'h-full w-full bg-gray-200 object-cover',
          ImageProps?.className,
        )}
        alt=""
        src={src}
        style={{
          objectPosition: `calc(50% + ${offset.x}px) calc(50% + ${offset.y}px)`,
          cursor: dragging ? 'grabbing' : 'grab',
          transition: dragging ? 'none' : 'object-position 0.2s',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        draggable={false}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onPick(file)
          event.currentTarget.value = ''
        }}
      />
    </div>
  )
}

export default Tile
