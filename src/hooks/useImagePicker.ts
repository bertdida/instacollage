import { useCallback, useState } from 'react'

export function useImagePicker(initialImages: string[] = []) {
  const [images, setImages] = useState<string[]>(initialImages)

  const handleImageSelect = useCallback(
    (idx: number) => (file: File) => {
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
    },
    [],
  )

  return { images, handleImageSelect }
}
