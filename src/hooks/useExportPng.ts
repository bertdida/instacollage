import { type RefObject, useCallback, useState } from 'react'
import * as htmlToImage from 'html-to-image'

type UseExportPngOptions = {
  fileName: string
}

const WIDTH = 1080
const HEIGHT = 1920

export function useExportPng<T extends HTMLElement>(
  nodeRef: RefObject<T | null>,
  { fileName }: UseExportPngOptions,
) {
  const [isExporting, setIsExporting] = useState(false)

  const exportPng = useCallback(async () => {
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
      link.download = `${fileName.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setIsExporting(false)
    }
  }, [nodeRef, isExporting, fileName])

  return {
    isExporting,
    exportPng,
  }
}
