import { PodcastData } from '..'
import { useNavigate } from 'react-router-dom'
import { PodcastCover } from './Cover'

function PodcastCard({ podcast }: { podcast: PodcastData }) {
  const navigate = useNavigate()

  return (
    <div
      className="flex min-h-20 cursor-pointer justify-between gap-2 border-b-2 border-primary-8 p-2 transition-colors hover:bg-primary-8"
      onClick={() => {
        navigate('/preview', {
          state: {
            podcast: podcast,
          },
        })
      }}
    >
      <PodcastCover className="aspect-square h-20 rounded-md bg-primary-7" podcast={podcast} />

      <div className="flex flex-col text-right">
        <p className="text-lg">{podcast.podcastName}</p>
        <p>{podcast.artistName}</p>
      </div>
    </div>
  )
}

export default PodcastCard
