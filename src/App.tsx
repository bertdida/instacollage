import React, { useRef, useState } from 'react'
import { type ClassValue, clsx } from 'clsx'
import * as htmlToImage from 'html-to-image'
import { IconSearch, IconPlus, IconLoader } from '@tabler/icons-react'
import { twMerge } from 'tailwind-merge'

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

const App: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('autumn mood')
  const [isDownloading, setIsDownloading] = useState(false)
  const [borderRadius, setBorderRadius] = useState(true)
  const [showSearchBar, setShowSearchBar] = useState(true)
  const [gap, setGap] = useState(2)
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1670141545540-7ffd026a6c74?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=736',
    'https://images.unsplash.com/photo-1542996416-2d720327bdd3?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
    'https://plus.unsplash.com/premium_photo-1668967516060-624b8a7021f4?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687',
    'https://images.unsplash.com/photo-1602447468280-77fc96bd9285?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=735',
    'https://images.unsplash.com/photo-1603331651359-86dd9d0a92c2?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
    'https://images.unsplash.com/photo-1507546602-311207b97bfa?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=627',
  ])

  const handlePick = (idx: number) => (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setImages((prev) => {
        const next = [...prev]
        next[idx] = url
        return next
      })
    }
    reader.readAsDataURL(file)
  }

  async function handleExport() {
    if (!ref.current) return
    if (isDownloading) return

    setIsDownloading(true)
    const node = ref.current

    try {
      // Scale clone to 1080x1920 without reflowing your live DOM
      const { width: w, height: h } = node.getBoundingClientRect()
      const targetW = 1080
      const targetH = 1920
      const scaleX = targetW / w
      const scaleY = targetH / h

      const dataUrl = await htmlToImage.toPng(node, {
        width: targetW,
        height: targetH,
        cacheBust: true,
        pixelRatio: 1,
        style: {
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: 'top left',
          margin: '0',
          display: 'block',
        },
      })

      const link = document.createElement('a')
      link.download = query.replace(/\s+/g, '-').toLowerCase() + '.png'
      link.href = dataUrl
      link.click()
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="mb-2 flex items-center gap-4">
        <fieldset className="fieldset">
          <label className="label text-primary">
            <input
              type="checkbox"
              checked={borderRadius}
              className="toggle"
              onChange={() => setBorderRadius((v) => !v)}
            />
            Border radius
          </label>
        </fieldset>

        <fieldset className="fieldset">
          <label className="label text-primary">
            <input
              type="checkbox"
              checked={showSearchBar}
              className="toggle"
              onChange={() => setShowSearchBar((v) => !v)}
            />
            Show search bar
          </label>
        </fieldset>

        <fieldset className="fieldset">
          <select
            defaultValue="Select spacing"
            className="select"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
          >
            <option disabled={true}>Select spacing</option>
            <option value={0}>0 spacing</option>
            <option value={2}>2 spacing</option>
            <option value={4}>4 spacing</option>
            <option value={8}>8 spacing</option>
          </select>
        </fieldset>
      </div>

      <div
        ref={ref}
        className="relative mx-auto aspect-9/16 w-full max-w-[450px] overflow-hidden bg-[#f8f5f0] shadow-lg"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={images[0]}
            alt=""
            className="h-full w-full scale-105 object-cover blur-lg"
            style={{ filter: 'blur(16px) brightness(0.8)' }}
          />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
        </div>

        <div
          className={cn('absolute inset-0 z-1 grid grid-cols-2', {
            'gap-0': gap === 0,
            'gap-2': gap === 2,
            'gap-4': gap === 4,
            'gap-8': gap === 8,
            'px-0': gap === 0,
            'px-2': gap === 2,
            'px-4': gap === 4,
            'px-8': gap === 8,
          })}
        >
          <div
            className={cn('relative flex h-full min-h-0 flex-col', {
              'bottom-0': gap === 0,
              'bottom-2': gap === 2,
              'bottom-4': gap === 4,
              'bottom-8': gap === 8,
              'gap-0': gap === 0,
              'gap-2': gap === 2,
              'gap-4': gap === 4,
              'gap-8': gap === 8,
            })}
          >
            {[0, 1, 2].map((index) => (
              <Tile
                key={index}
                src={images[index]}
                onPick={handlePick(index)}
                className={'h-[calc((100%)/3)]'}
                ImageProps={{
                  className: borderRadius ? 'rounded-xl' : undefined,
                }}
              />
            ))}
          </div>

          <div
            className={cn('relative flex h-full min-h-0 flex-col', {
              'top-0': gap === 0,
              'top-2': gap === 2,
              'top-4': gap === 4,
              'top-8': gap === 8,
              'gap-0': gap === 0,
              'gap-2': gap === 2,
              'gap-4': gap === 4,
              'gap-8': gap === 8,
            })}
          >
            {[3, 4, 5].map((index) => (
              <Tile
                src={images[index]}
                onPick={handlePick(index)}
                className={'h-[calc((100%)/3)]'}
                ImageProps={{
                  className: borderRadius ? 'rounded-xl' : undefined,
                }}
              />
            ))}
          </div>
        </div>

        {showSearchBar && (
          <div className="absolute top-1/2 left-1/2 z-2 h-10 w-1/2 -translate-x-1/2">
            <div className="relative flex h-full w-full items-center gap-2 rounded-full bg-white/90 pr-2 pl-4 shadow backdrop-blur-sm">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search…"
                className="border-none bg-transparent font-medium text-gray-700 placeholder-gray-400 outline-none"
              />
              <span className="absolute right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/80">
                <IconSearch className="h-4 w-4 text-white" />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleExport}
          disabled={isDownloading}
          aria-disabled={isDownloading}
          className={clsx('btn relative', isDownloading && 'btn-disabled')}
        >
          <span className={isDownloading ? 'invisible' : undefined}>
            Download collage
          </span>
          {isDownloading && (
            <IconLoader className="absolute top-1/2 left-1/2 mx-auto h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin" />
          )}
        </button>
      </div>
    </div>
  )
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default App
