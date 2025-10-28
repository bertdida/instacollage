import React, { useRef, useState } from 'react'
import cn from '../cn'
import Tile from './Tile'
import { useExportImage } from '../hooks/useExportImage'
import { useImagePicker } from '../hooks/useImagePicker'
import DownloadButton from './DownloadButton'

type Layout01Props = {
  images: string[]
}

const Layout01: React.FC<Layout01Props> = ({ images: imagesProp }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [borderRadius, setBorderRadius] = useState(true)
  const [gap, setGap] = useState(4)

  const { images, handleImageSelect } = useImagePicker(imagesProp)
  const { isExporting, exportImage } = useExportImage(ref)

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
                onPick={handleImageSelect(index)}
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
                onPick={handleImageSelect(index)}
                className={'h-[calc((100%)/3)]'}
                ImageProps={{
                  className: borderRadius ? 'rounded-xl' : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <DownloadButton isLoading={isExporting} onClick={exportImage} />
      </div>
    </div>
  )
}

export default Layout01
