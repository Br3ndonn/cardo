/*Compact variation of EpisodeCard */

import { useEffect, useState } from "react";
import { EpisodeData, NewEpisodeData } from "..";
import * as icons from "../Icons"
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { useDB } from "../DB";
import { usePlayer } from "./AudioPlayer";
import { useSettings } from "../Settings";
import { useTranslation } from "react-i18next";
import { showMenu } from "tauri-plugin-context-menu";



export default function EpisodePreviewCard({ episode }: { episode: EpisodeData | NewEpisodeData }) {
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate()
  const [reprState, setReprState] = useState({ position: 0, total: episode.duration, complete: false })
  const { queue, history: { getEpisodeState, updateEpisodeState } } = useDB()
  const { play, playing, position: playingPosition, quit: quitPlayer } = usePlayer()
  const [{ globals: { locale } },] = useSettings()
  const { t } = useTranslation()
  const [inQueue, setInqueue] = useState(queue.includes(episode.src))

  useEffect(() => {
    getEpisodeState(episode.src).then(state => {
      if (state !== undefined) {
        setReprState({ position: state.position, total: state.total, complete: state.position >= state.total })
      } else {
        // render a not played episode
        setReprState({ position: 0, total: episode.duration, complete: false })
      }

    })
  }, [])



  return (
    <div className="flex flex-col w-24 flex-shrink-0 rounded-md hover:p-[3px] cursor-pointer transition-all duration-100 amber-600"
      onContextMenu={() => {
        showMenu({
          items: [
            {
              label: t(reprState.complete ? 'mark_not_played' : 'mark_played'),
              event: () => {
                if (reprState.complete) {
                  updateEpisodeState(episode.src, episode.podcastUrl, 0, episode.duration)
                setReprState({ complete: false, position: 0, total: reprState.total })
                } else {
                  updateEpisodeState(episode.src, episode.podcastUrl, reprState.total, reprState.total)
                  setReprState({ complete: true, position: reprState.total, total: reprState.total })
                  if (playing?.src == episode.src) {
                    quitPlayer()
                  }
                }
              }
            },
            {
              label: t(inQueue ? 'remove_queue' : 'add_queue'),
              event: async () => {
                if (inQueue) {
                  await queue.remove(episode.src)
                  setInqueue(false)
                } else {
                  await queue.push(episode)
                  setInqueue(true)
                }
              }
            }
          ]
        });
      }}
    >
      <div className='flex flex-col rounded-md overflow-hidden relative'>
        {
          imageError ?
            icons.photo :
            <img
              className='w-full'
              onClick={() => {
                navigate('/episode-preview', {
                  state: {
                    episode: episode,
                  }
                })
              }}
              alt=""
              src={episode.coverUrl}
              onError={() => setImageError(true)}
            />
        }
        <ProgressBar position={playing?.src == episode.src ? playingPosition : reprState.position}
          total={episode.duration}
          showTime={false}
          className={{ div: "h-[5px]" }} />
        <button className="absolute bottom-2 right-2 bg-accent-7 w-7 p-[4px] pl-[6px] aspect-square flex justify-center items-center hover:p-[1px] border-2 border-accent-8 rounded-full transition-all"
          onClick={e => {
            e.stopPropagation()
            play(episode)
          }}
        >
          {icons.play}
        </button>
      </div>
      <div className="relative">
        <h1 className="text-sm line-clamp-2" title={episode.title}>{episode.title}</h1>
        <div className="flex items-center gap-2 ">
          {
            (episode as NewEpisodeData).new &&
            <span className="h-2 w-2 rounded-full bg-accent-5" title={t('new')} />
          }
          <h2 className="0 text-sm">
            {
              episode.pubDate.toLocaleDateString(locale, {
                day: 'numeric',
                month: 'short',
                year: episode.pubDate.getFullYear() < (new Date().getFullYear()) ? 'numeric' : undefined
              })
            }
          </h2>
        </div>
      </div>
    </div>
  )
}