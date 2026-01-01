import { useEffect, useRef, useCallback, useState } from 'react'

interface UseTimerWorkerOptions {
  onFinished: () => void
  onTick?: (remaining: number) => void
}

export const useTimerWorker = ({ onFinished, onTick }: UseTimerWorkerOptions) => {
  const workerRef = useRef<Worker | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/timerWorker.ts', import.meta.url), {
      type: 'module',
    })

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { type, remaining } = e.data

      if (type === 'FINISHED') {
        setIsRunning(false)
        onFinished()
      } else if (type === 'TICK' && onTick) {
        onTick(remaining)
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [onFinished, onTick])

  const start = useCallback((seconds: number) => {
    const endTime = Date.now() + seconds * 1000
    workerRef.current?.postMessage({ type: 'START', payload: { endTime } })
    setIsRunning(true)
  }, [])

  const stop = useCallback(() => {
    workerRef.current?.postMessage({ type: 'STOP' })
    setIsRunning(false)
  }, [])

  return { start, stop, isRunning }
}
