import { useEffect, useRef, useState } from 'react'

export const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260611_104107_121bfb5a-b1df-4e0d-8240-25b81f7cc85d.mp4'

const MAX_WIDTH = 1280

function waitFor(target: EventTarget, event: string, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const cleanUp = () => {
      target.removeEventListener(event, done)
      target.removeEventListener('error', fail)
      signal.removeEventListener('abort', abort)
    }
    const done = () => {
      cleanUp()
      resolve()
    }
    const fail = () => {
      cleanUp()
      reject(new Error(`video ${event} failed`))
    }
    const abort = () => {
      cleanUp()
      reject(signal.reason ?? new DOMException('Frame extraction cancelled', 'AbortError'))
    }
    target.addEventListener(event, done, { once: true })
    target.addEventListener('error', fail, { once: true })
    signal.addEventListener('abort', abort, { once: true })
  })
}

async function seekTo(video: HTMLVideoElement, time: number, signal: AbortSignal) {
  if (Math.abs(video.currentTime - time) <= 0.001 && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return
  }
  const seeked = waitFor(video, 'seeked', signal)
  video.currentTime = time
  await seeked
}

async function extractFrames(src: string, signal: AbortSignal) {
  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.src = src

  if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
    await waitFor(video, 'loadedmetadata', signal)
  }
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    await waitFor(video, 'loadeddata', signal)
  }

  const duration = video.duration
  const scale = Math.min(1, MAX_WIDTH / video.videoWidth)
  const width = Math.round(video.videoWidth * scale)
  const height = Math.round(video.videoHeight * scale)
  const count = Math.min(120, Math.max(30, Math.round(duration * 24)))
  const span = Math.max(0, duration - 0.05)
  const frames: ImageBitmap[] = []

  try {
    for (let i = 0; i < count; i++) {
      if (signal.aborted) throw signal.reason
      const time = count === 1 ? 0 : (span * i) / (count - 1)
      await seekTo(video, time, signal)
      frames.push(
        await createImageBitmap(video, {
          resizeWidth: width,
          resizeHeight: height,
          resizeQuality: 'high',
        }),
      )
    }
  } catch (error) {
    frames.forEach((frame) => frame.close())
    throw error
  } finally {
    video.removeAttribute('src')
    video.load()
  }
  return frames
}

export function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const framesRef = useRef<ImageBitmap[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let objectUrl = ''

    fetch(VIDEO_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`video fetch ${response.status}`)
        return response.blob()
      })
      .then((blob) => {
        if (controller.signal.aborted) throw controller.signal.reason
        objectUrl = URL.createObjectURL(blob)
        return extractFrames(objectUrl, controller.signal)
      })
      .then((frames) => {
        if (controller.signal.aborted) {
          frames.forEach((frame) => frame.close())
          return
        }
        framesRef.current = frames
        setReady(true)
      })
      .catch(() => {
        // The fallback video keeps scrubbing when frame extraction is unavailable.
      })

    return () => {
      controller.abort()
      framesRef.current.forEach((frame) => frame.close())
      framesRef.current = []
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    let target = 0
    let smoothed = 0
    let lastIndex = -1
    let raf = 0
    let seeking = false

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      lastIndex = -1
    }

    const onSeeked = () => {
      seeking = false
    }
    const fallback = videoRef.current
    fallback?.addEventListener('seeked', onSeeked)

    const draw = (frame: ImageBitmap) => {
      if (!context) return
      const scale = Math.max(canvas.width / frame.width, canvas.height / frame.height)
      const width = frame.width * scale
      const height = frame.height * scale
      context.drawImage(frame, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
    }

    const tick = () => {
      smoothed += (target - smoothed) * 0.1
      const frames = framesRef.current
      if (frames.length) {
        const index = Math.min(frames.length - 1, Math.round(smoothed * (frames.length - 1)))
        if (index !== lastIndex) {
          draw(frames[index])
          lastIndex = index
        }
      } else if (fallback && fallback.duration && !seeking) {
        const time = smoothed * Math.max(0, fallback.duration - 0.05)
        if (Math.abs(fallback.currentTime - time) > 0.001) {
          seeking = true
          fallback.currentTime = time
        }
      }
      raf = requestAnimationFrame(tick)
    }

    readScroll()
    resize()
    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', resize)
    window.addEventListener('resize', readScroll)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', readScroll)
      fallback?.removeEventListener('seeked', onSeeked)
    }
  }, [ready])

  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0a]" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {!ready && (
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
}
