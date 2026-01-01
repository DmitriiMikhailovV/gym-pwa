let audioContext: AudioContext | null = null
let silentSource: AudioBufferSourceNode | null = null

const getContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new window.AudioContext()
  }
  return audioContext
}

export const timerAudio = {
  startSilent: async () => {
    try {
      const ctx = getContext()
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }

      // Stop previous if exists
      if (silentSource) {
        try {
          silentSource.stop()
          silentSource.disconnect()
        } catch (e) {
          // ignore error if already stopped
        }
        silentSource = null
      }

      // Create a silent buffer (1 second)
      const buffer = ctx.createBuffer(1, 44100, 44100)
      const channelData = buffer.getChannelData(0)

      // Fill with tiny amount of noise so iOS doesn't suspend the hardware
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = 0.0001
      }

      silentSource = ctx.createBufferSource()
      silentSource.buffer = buffer
      silentSource.loop = true
      silentSource.connect(ctx.destination)
      silentSource.start()
    } catch (error) {
      console.error('Failed to start silent audio:', error)
    }
  },

  stopSilent: () => {
    if (silentSource) {
      try {
        silentSource.stop()
        silentSource.disconnect()
      } catch (e) {
        // ignore
      }
      silentSource = null
    }
  },

  playBeep: () => {
    try {
      const ctx = getContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      // Nice "ding" sound
      osc.frequency.setValueAtTime(880, ctx.currentTime) // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1)

      gain.gain.setValueAtTime(0.5, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

      osc.type = 'sine'
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
    } catch (error) {
      console.error('Failed to play beep:', error)
    }
  },
}
