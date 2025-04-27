import { useEffect, useState } from "react"

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(
        (err) => console.error(`Error attempting to enable fullscreen: ${err.message}`)
      )
    }
  }

  const exitFullscreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(
        (err) => console.error(`Error attempting to exit fullscreen: ${err.message}`)
      )
    }
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    };
  }, [])

  return { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen }
}
