import React, { useRef } from 'react'
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

  return (
    <button
      type="button"
      className={cn(
        'group relative block cursor-pointer overflow-hidden focus:outline-none',
        className,
      )}
      onClick={() => inputRef.current?.click()}
      aria-label="Change image"
    >
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <IconPlus className="h-8 w-8 text-white" />
      </div>

      <img
        crossOrigin="anonymous"
        className={cn(
          'h-full w-full bg-gray-200 object-cover',
          ImageProps?.className,
        )}
        alt=""
        src={src}
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
    </button>
  )
}

export default Tile
