import { type RefObject, useCallback, useState } from 'react'
import * as htmlToImage from 'html-to-image'
import { nanoid } from 'nanoid'

const WIDTH = 1080
const HEIGHT = 1920

export function useExportImage<T extends HTMLElement>(
  nodeRef: RefObject<T | null>,
) {
  const [isExporting, setIsExporting] = useState(false)

  const exportImage = useCallback(async () => {
    if (typeof window === 'undefined') {
      return
    }

    const node = nodeRef.current
    if (!node || isExporting) {
      return
    }

    setIsExporting(true)
    try {
      const { width: w, height: h } = node.getBoundingClientRect()
      const scaleX = WIDTH / w
      const scaleY = HEIGHT / h

      const dataUrl = await htmlToImage.toPng(node, {
        width: WIDTH,
        height: HEIGHT,
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
      link.download = `${nanoid()}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setIsExporting(false)
    }
  }, [nodeRef, isExporting])

  return {
    isExporting,
    exportImage,
  }
}
