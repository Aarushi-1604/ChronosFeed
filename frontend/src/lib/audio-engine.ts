// generative sound engine using Web Audio API

class AudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private oscillator: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private tickInterval: any = null;
  private isAmbientPlaying = false;
  private volumeLevel = 0.15; // default low ambient volume

  constructor() {
    // Audio engine is lazily initialized on user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
  }

  // Generates brown/pink noise for the steam hum
  private createNoiseNode(): AudioNode {
    if (!this.ctx) throw new Error('No audio context');
    
    // ScriptProcessor is deprecated but widely supported in all browsers without hosting worklet files
    const bufferSize = 4096;
    let lastOut = 0.0;
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    
    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Filter white noise to create brown/pink-like noise
        output[i] = (lastOut * 0.985 + white * 0.015);
        lastOut = output[i];
        output[i] *= 2.5; // Gain compensation
      }
    };
    
    this.noiseNode = node;
    return node;
  }

  public startAmbient() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.isAmbientPlaying) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = this.volumeLevel;

      // 1. Steam Machine Hum (45Hz Low Oscillator + LFO volume modulation)
      this.oscillator = this.ctx.createOscillator();
      this.oscillator.type = 'sine';
      this.oscillator.frequency.value = 45; // Low bass rumble

      const oscGain = this.ctx.createGain();
      oscGain.gain.value = 0.25;

      // LFO to make the hum "breathe"
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.value = 0.25; // 4 seconds cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 0.1;
      
      this.lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);

      this.oscillator.connect(oscGain);
      
      // 2. Filtered steam hiss (Brownian noise through a low-pass filter)
      const noise = this.createNoiseNode();
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 180; // keep it deep and non-intrusive

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.value = 0.08;

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);

      // Connect sources to master ambient gain
      oscGain.connect(this.ambientGain);
      noiseGain.connect(this.ambientGain);

      // Master output
      this.ambientGain.connect(this.ctx.destination);

      this.oscillator.start(0);
      this.lfo.start(0);
      
      // 3. Start mechanical ticking (gear turning)
      this.startClockworkTicks();

      this.isAmbientPlaying = true;
    } catch (err) {
      console.warn('Failed to start ambient audio:', err);
    }
  }

  private startClockworkTicks() {
    if (this.tickInterval) clearInterval(this.tickInterval);
    
    // Play a tick every 1.8 seconds representing gears locking
    this.tickInterval = setInterval(() => {
      this.playTickSound();
    }, 1800);
  }

  private playTickSound() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    
    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.03);
      
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 2;

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // ignore
    }
  }

  public stopAmbient() {
    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.lfo) {
        this.lfo.stop();
        this.lfo.disconnect();
        this.lfo = null;
      }
      if (this.noiseNode) {
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
      if (this.tickInterval) {
        clearInterval(this.tickInterval);
        this.tickInterval = null;
      }
      this.isAmbientPlaying = false;
    } catch (e) {
      console.warn('Failed to stop ambient audio:', e);
    }
  }

  // Satisfying mechanical typing click
  public playClick() {
    this.initContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    try {
      // Slightly randomize frequency to sound realistic
      const pitch = 1400 + Math.random() * 800;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.value = pitch;

      filter.type = 'highpass';
      filter.frequency.value = 1200;

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.012);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.015);
    } catch (e) {
      // ignore
    }
  }

  // Satisfying page flip / newspaper rustle
  public playPageRustle() {
    this.initContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.25; // 250ms rustle
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // smooth noise to feel like friction/paper
        data[i] = lastOut * 0.85 + white * 0.15;
        lastOut = data[i];
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.0;

      // Animate filter frequency sweep for the friction slide sound
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3200, this.ctx.currentTime + 0.22);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.24);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      // ignore
    }
  }

  // Telegraph Morse code chirps for compilation
  public playTelegraphSequence() {
    this.initContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    try {
      const playChirp = (delay: number, duration: number, pitch = 880) => {
        const time = this.ctx!.currentTime + delay;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.value = pitch;

        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(0.02, time + 0.005);
        gain.gain.setValueAtTime(0.02, time + duration - 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(time);
        osc.stop(time + duration + 0.01);
      };

      // Morse Code: "C" ( - . - . ) and "F" ( . . - . )
      const dot = 0.06;
      const dash = 0.15;
      const gap = 0.08;

      let current = 0.1;
      
      // Chirps
      playChirp(current, dash); current += dash + gap;
      playChirp(current, dot); current += dot + gap;
      playChirp(current, dash); current += dash + gap;
      playChirp(current, dot); current += dot + gap + 0.2; // space

      playChirp(current, dot); current += dot + gap;
      playChirp(current, dot); current += dot + gap;
      playChirp(current, dash); current += dash + gap;
      playChirp(current, dot);
    } catch (e) {
      // ignore
    }
  }

  public getIsPlaying() {
    return this.isAmbientPlaying;
  }
}

// Singleton helper
let instance: AudioEngine | null = null;

export const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!instance) {
    instance = new AudioEngine();
  }
  return instance;
};
