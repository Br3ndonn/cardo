

export interface PodcastData {
  podcastName: string,
  artistName: string,
  coverUrl: string,
  coverUrlLarge: string,
  feedUrl: string
}

export interface EpisodeData {
  title: string,
  description: string,
  audioUrl: string,
  pubDate: Date,
  duration?: number,
  coverUrl?: string
}