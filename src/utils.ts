

export function secondsToStr(seconds: number) {
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padEnd(2, '0')}`
}