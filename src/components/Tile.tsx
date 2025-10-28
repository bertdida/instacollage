import React, { useRef, useState, useCallback } from 'react'
import { IconCamera } from '@tabler/icons-react'
import cn from '../cn'

type TileProps = {
  src: string
  onPick: (file: File) => void
  className?: string
  alt?: string
  ImageProps?: {
    className?: string
  }
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

const Tile: React.FC<TileProps> = ({
  src,
  onPick,
  className,
  alt = '',
  ImageProps,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const imageElementRef = useRef<HTMLImageElement>(null)
  const containerElementRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [bounds, setBounds] = useState({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  })
  const [dragStartPosition, setDragStartPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  /**
   * Compute how far the image can be moved in each direction
   * based on its natural size vs. container size.
   */
  const computeImageBounds = useCallback(() => {
    const containerElement = containerElementRef.current
    const imageElement = imageElementRef.current
    if (!containerElement || !imageElement) {
      return
    }

    const imageNaturalWidth = imageElement.naturalWidth
    const imageNaturalHeight = imageElement.naturalHeight
    if (!imageNaturalWidth || !imageNaturalHeight) {
      return
    }

    const containerRect = containerElement.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    const scaleFactor = Math.max(
      containerWidth / imageNaturalWidth,
      containerHeight / imageNaturalHeight,
    )

    const scaledImageWidth = imageNaturalWidth * scaleFactor
    const scaledImageHeight = imageNaturalHeight * scaleFactor

    const horizontalLimit = (scaledImageWidth - containerWidth) / 2
    const verticalLimit = (scaledImageHeight - containerHeight) / 2

    setBounds({
      minX: -horizontalLimit,
      maxX: horizontalLimit,
      minY: -verticalLimit,
      maxY: verticalLimit,
    })

    // Clamp existing offset to ensure it remains within new bounds
    setOffset((previousOffset) => ({
      x: Math.max(
        -horizontalLimit,
        Math.min(horizontalLimit, previousOffset.x),
      ),
      y: Math.max(-verticalLimit, Math.min(verticalLimit, previousOffset.y)),
    }))
  }, [])

  useIsomorphicLayoutEffect(() => {
    computeImageBounds()
  }, [src, computeImageBounds])

  // Recompute when the container is resized
  useIsomorphicLayoutEffect(() => {
    if (!containerElementRef.current) {
      return
    }

    const resizeObserver = new ResizeObserver(() => computeImageBounds())
    resizeObserver.observe(containerElementRef.current)

    if (imageElementRef.current) {
      resizeObserver.observe(imageElementRef.current)
    }

    return function cleanUp() {
      resizeObserver.disconnect()
    }
  }, [computeImageBounds])

  const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (event.button !== 0) {
      return // Only respond to left-click
    }

    setIsDragging(true)
    setDragStartPosition({ x: event.clientX, y: event.clientY })
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!isDragging || !dragStartPosition) {
      return
    }

    const deltaX = event.clientX - dragStartPosition.x
    const deltaY = event.clientY - dragStartPosition.y

    setDragStartPosition({ x: event.clientX, y: event.clientY })

    setOffset((previousOffset) => {
      let newX = previousOffset.x + deltaX
      let newY = previousOffset.y + deltaY
      newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX))
      newY = Math.max(bounds.minY, Math.min(bounds.maxY, newY))
      return { x: newX, y: newY }
    })
  }

  const handlePointerEnd = (event: React.PointerEvent<HTMLImageElement>) => {
    setIsDragging(false)
    setDragStartPosition(null)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  /** Keyboard-based panning for accessibility */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const stepSize = 10
    if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown'
    ) {
      event.preventDefault()
      setOffset((previousOffset) => {
        let newX = previousOffset.x
        let newY = previousOffset.y
        if (event.key === 'ArrowLeft') newX -= stepSize
        if (event.key === 'ArrowRight') newX += stepSize
        if (event.key === 'ArrowUp') newY -= stepSize
        if (event.key === 'ArrowDown') newY += stepSize
        newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX))
        newY = Math.max(bounds.minY, Math.min(bounds.maxY, newY))
        return { x: newX, y: newY }
      })
    }
  }

  return (
    <div
      ref={containerElementRef}
      className={cn(
        'group relative block touch-none overflow-hidden select-none focus:outline-none',
        className,
      )}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Image tile. Use mouse drag or arrow keys to pan."
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Change image"
        className="absolute right-3 bottom-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <IconCamera className="h-7 w-7 text-white" />
      </button>

      <img
        ref={imageElementRef}
        crossOrigin="anonymous"
        className={cn(
          'h-full w-full bg-gray-200 object-cover',
          ImageProps?.className,
        )}
        alt={alt}
        src={src}
        style={{
          objectPosition: `calc(50% + ${offset.x}px) calc(50% + ${offset.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'object-position 0.2s',
          willChange: 'object-position',
        }}
        onLoad={() => {
          computeImageBounds()
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onDragStart={(event) => event.preventDefault()}
        draggable={false}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0]
          if (selectedFile) onPick(selectedFile)
          event.currentTarget.value = ''
        }}
      />
    </div>
  )
}

export default Tile
