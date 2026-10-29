'use client'

import { useRef, useState, useEffect } from 'react'
import { formatDuration } from '@/lib/audio'

export default function AudioPlayer({
  src,
  duration,
}: {
  src: string
  duration?: number | null
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(duration || 0)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setCurrent(a.currentTime)
    const onMeta = () => setTotal(a.duration)
    const onEnd = () => { setPlaying(false); setCurrent(0) }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('ended', onEnd)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('ended', onEnd)
    }
  }, [])

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play(); setPlaying(true) }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current
    if (!a || !total) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    a.currentTime = ratio * total
    setCurrent(a.currentTime)
  }

  const pct = total ? (current / total) * 100 : 0

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      backgroundColor: '#ffffff', border: '1px solid #eceef1',
      borderRadius: '999px', padding: '8px 16px 8px 8px',
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play / Pause */}
      <button
        onClick={toggle}
        aria-label={playing ? 'Duraklat' : 'Oynat'}
        style={{
          flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%',
          backgroundColor: '#d00202', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: '2px' }}>
            <path d="M8 5.14v13.72c0 .78.85 1.26 1.54.86l11.1-6.86a1 1 0 000-1.72L9.54 4.28A1 1 0 008 5.14z" />
          </svg>
        )}
      </button>

      {/* Progress */}
      <div
        onClick={seek}
        style={{
          flex: 1, height: '6px', backgroundColor: '#f0f0f0',
          borderRadius: '999px', cursor: 'pointer', position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct}%`, backgroundColor: '#d00202', borderRadius: '999px',
        }} />
      </div>

      {/* Time */}
      <span style={{
        flexShrink: 0, fontSize: '12px', color: '#9ca3af',
        fontVariantNumeric: 'tabular-nums', minWidth: '78px', textAlign: 'right',
      }}>
        {formatDuration(current)} / {formatDuration(total)}
      </span>
    </div>
  )
}
