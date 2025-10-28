import { IconLoader } from '@tabler/icons-react'
import cn from '../cn'

type DownloadButtonProps = {
  isLoading: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  isLoading,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      aria-disabled={isLoading}
      className={cn('btn relative', isLoading && 'btn-disabled')}
    >
      <span className={isLoading ? 'invisible' : undefined}>
        Download collage
      </span>
      {isLoading && (
        <IconLoader className="absolute top-1/2 left-1/2 mx-auto h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin" />
      )}
    </button>
  )
}

export default DownloadButton
