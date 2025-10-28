import { useRef, useState } from 'react'
import Tile from './Tile'

type Layout02Props = {
  images: string[]
}

const Layout02: React.FC<Layout02Props> = ({ images: imagesProp }) => {
  const ref = useRef<HTMLDivElement>(null)
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

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-9/16 w-full max-w-[450px] overflow-hidden bg-[#f8f5f0] shadow-lg"
    >
      <div className="absolute inset-0 z-0">
        <Tile
          src={images[0]}
          onPick={handlePick(0)}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute flex h-full w-[55%] flex-col justify-center gap-4 pl-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="border-10 border-white">
            <Tile
              src={images[index]}
              onPick={handlePick(index)}
              className="aspect-square w-full"
              ImageProps={{
                className: 'object-cover',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Layout02
