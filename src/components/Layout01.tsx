import React, { useRef, useState } from 'react'
import * as htmlToImage from 'html-to-image'
import { IconSearch, IconLoader } from '@tabler/icons-react'
import cn from '../cn'
import Tile from './Tile'

type Layout01Props = {
  images: string[]
}

const Layout01: React.FC<Layout01Props> = ({ images: imagesProp }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('autumn mood')
  const [isDownloading, setIsDownloading] = useState(false)
  const [borderRadius, setBorderRadius] = useState(true)
  const [showSearchBar, setShowSearchBar] = useState(true)
  const [gap, setGap] = useState(2)
  const [images, setImages] = useState<string[]>(imagesProp)

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
    <div>
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
          className={cn('btn relative', isDownloading && 'btn-disabled')}
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

export default Layout01
