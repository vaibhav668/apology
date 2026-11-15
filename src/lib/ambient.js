// A tiny generative ambient pad built with the Web Audio API.
// No audio files to download, and it only ever starts after the user taps the music button.

const CHORDS = [
  [220.0, 261.63, 329.63, 392.0], // Am7
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [196.0, 246.94, 293.66, 392.0], // G
  [164.81, 207.65, 246.94, 329.63], // E
]
const MELODY = [659.25, 587.33, 523.25, 493.88, 440.0, 523.25, 587.33, 783.99]

export class AmbientEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.timer = null
    this.step = 0
    this.playing = false
  }

  init() {
    if (this.ctx) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) throw new Error('Web Audio unavailable')
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0

    // Soft feedback delay for a dreamy tail
    const delay = this.ctx.createDelay(2)
    delay.delayTime.value = 0.42
    const feedback = this.ctx.createGain()
    feedback.gain.value = 0.38
    const wet = this.ctx.createGain()
    wet.gain.value = 0.35
    const lowpass = this.ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 2200

    this.bus = this.ctx.createGain()
    this.bus.connect(lowpass)
    lowpass.connect(this.master)
    lowpass.connect(delay)
    delay.connect(feedback)
    feedback.connect(delay)
    delay.connect(wet)
    wet.connect(this.master)
    this.master.connect(this.ctx.destination)
  }

  voice(freq, start, dur, { type = 'sine', gain = 0.05, attack = 1.2 } = {}) {
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    osc.detune.value = (Math.random() - 0.5) * 8
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(gain, start + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    osc.connect(g)
    g.connect(this.bus)
    osc.start(start)
    osc.stop(start + dur + 0.1)
  }

  tick() {
    const now = this.ctx.currentTime + 0.05
    const chord = CHORDS[Math.floor(this.step / 2) % CHORDS.length]
    if (this.step % 2 === 0) {
      chord.forEach((f, i) => this.voice(f, now + i * 0.04, 6.5, { type: i === 0 ? 'triangle' : 'sine', gain: 0.035 }))
      this.voice(chord[0] / 2, now, 6.5, { type: 'sine', gain: 0.05, attack: 1.8 })
    }
    if (Math.random() > 0.25) {
      const note = MELODY[(this.step * 3 + Math.floor(Math.random() * 3)) % MELODY.length]
      this.voice(note, now + 0.6 + Math.random() * 0.8, 2.6, { type: 'sine', gain: 0.022, attack: 0.04 })
    }
    this.step += 1
  }

  async start() {
    this.init()
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    if (this.playing) return
    this.playing = true
    const t = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setValueAtTime(this.master.gain.value, t)
    this.master.gain.linearRampToValueAtTime(0.9, t + 2.5)
    this.tick()
    this.timer = window.setInterval(() => this.tick(), 3200)
  }

  stop() {
    if (!this.ctx || !this.playing) return
    this.playing = false
    window.clearInterval(this.timer)
    const t = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setValueAtTime(this.master.gain.value, t)
    this.master.gain.linearRampToValueAtTime(0, t + 1.2)
  }

  dispose() {
    this.stop()
    window.setTimeout(() => this.ctx?.close().catch(() => {}), 1400)
  }
}
