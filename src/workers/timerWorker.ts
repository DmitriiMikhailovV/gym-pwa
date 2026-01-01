let timerId: number | null = null
let endTime: number | null = null

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data

  if (type === 'START') {
    endTime = payload.endTime

    if (timerId) {
      clearInterval(timerId)
    }

    timerId = setInterval(() => {
      if (!endTime) return

      const now = Date.now()
      const remaining = Math.ceil((endTime - now) / 1000)

      if (remaining <= 0) {
        self.postMessage({ type: 'FINISHED' })

        if (timerId) {
          clearInterval(timerId)
          timerId = null
        }
        endTime = null
      } else {
        self.postMessage({ type: 'TICK', remaining })
      }
    }, 1000) as unknown as number
  } else if (type === 'STOP') {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
    endTime = null
  }
}

export {}
