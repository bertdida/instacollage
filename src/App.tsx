import { useRef, useState } from 'react'
import clsx from 'clsx'
import * as htmlToImage from 'html-to-image'
import { IconSearch, IconPlus, IconLoader } from '@tabler/icons-react'

type TileProps = {
  src: string
  onPick: (file: File) => void
  className?: string
}

const Tile: React.FC<TileProps> = ({ src, onPick, className }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <button
      type="button"
      className={clsx(
        'cursor-pointer relative block overflow-hidden rounded-xl focus:outline-none group',
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
        className="w-full h-full object-cover bg-gray-200"
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

function App() {
  const ref = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('autumn mood')
  const [isDownloading, setIsDownloading] = useState(false)

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300 gap-4">
      <div
        ref={ref}
        className="relative mx-auto w-full max-w-[400px] aspect-9/16 overflow-hidden shadow-lg bg-[#f8f5f0]"
      >
        <div className="absolute inset-0 grid grid-cols-2 gap-2 px-2 z-1">
          <div className="flex flex-col gap-2 h-full min-h-0 relative bottom-3">
            <Tile
              src={images[0]}
              onPick={handlePick(0)}
              className="h-[calc((100%-1rem)/3)]"
            />
            <Tile
              src={images[1]}
              onPick={handlePick(1)}
              className="h-[calc((100%-1rem)/3)]"
            />
            <Tile
              src={images[2]}
              onPick={handlePick(2)}
              className="h-[calc((100%-1rem)/3)]"
            />
          </div>

          <div className="flex flex-col gap-2 h-full min-h-0 relative top-3">
            <Tile
              src={images[3]}
              onPick={handlePick(3)}
              className="h-[calc((100%-1rem)/3)]"
            />
            <Tile
              src={images[4]}
              onPick={handlePick(4)}
              className="h-[calc((100%-1rem)/3)]"
            />
            <Tile
              src={images[5]}
              onPick={handlePick(5)}
              className="h-[calc((100%-1rem)/3)]"
            />
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 z-2">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full pl-4 pr-2 py-2 shadow">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search…"
              className="bg-transparent outline-none border-none text-gray-700 font-medium placeholder-gray-400"
            />
            <span className="inline-flex h-7 w-7 rounded-full bg-black/80 items-center justify-center">
              <IconSearch className="h-4 w-4 text-white" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleExport}
          disabled={isDownloading}
          className={clsx(
            'cursor-pointer px-4 py-2 bg-amber-700 text-white rounded-lg shadow hover:bg-amber-800 transition relative',
            isDownloading && 'opacity-50',
          )}
        >
          <span className={isDownloading ? 'invisible' : undefined}>
            Download collage
          </span>
          {isDownloading && (
            <IconLoader className="h-5 w-5 animate-spin mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </button>
      </div>
    </div>
  )
}

export default App
