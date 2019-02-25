const OscillatorType = {
  sine: 'sine',
  square: 'square',
  sawtooth: 'sawtooth',
  triangle: 'triangle',
}

const OscillatorDefault = {
  type: OscillatorType.sine,
  frequency: 440,
}

class Sounder {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

    this.gainNode = this.audioContext.createGain()
    this.gainNode.connect(this.audioContext.destination)

    this.oscillator = null

    this.type = OscillatorDefault.type
    this.freq = OscillatorDefault.frequency
  }

  start = () => {
    if (!this.oscillator) {
      this.oscillator = this.audioContext.createOscillator()
      this.oscillator.connect(this.gainNode)
      this.oscillator.frequency.value = this.freq
      this.oscillator.type = this.type
      this.oscillator.start()
    }
  }

  stop = () => {
    if (this.oscillator) {
      this.oscillator.stop()
      this.oscillator = null
    }
  }

  setVol = (volumn, rampTime) => {
    if (isNumber(volumn)) {
      let _rampTime = isNumber(rampTime) && rampTime >= 0 ? rampTime : 0
      let currentTime = this.audioContext.currentTime

      this.gainNode.gain.linearRampToValueAtTime(
        volumn,
        currentTime + _rampTime
      )
    }
  }

  setFreq = (frequency, rampTime) => {
    if (isNumber(frequency)) {
      if (this.oscillator) {
        let _rampTime = isNumber(rampTime) && rampTime >= 0 ? rampTime : 0
        let currentTime = this.audioContext.currentTime

        this.oscillator.frequency.linearRampToValueAtTime(
          frequency,
          currentTime + _rampTime
        )
      }

      this.freq = frequency
    }
  }

  setType = type => {
    if (OscillatorType.hasOwnProperty(type)) {
      if (this.oscillator) {
        this.oscillator.type = type
      }

      this.type = type
    }
  }
}

const isNumber = value => {
  return typeof value === 'number' && !isNaN(value)
}

export default Sounder
