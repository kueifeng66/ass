/**
 * Web Audio API Sound Generator for Butt Smacker
 * Completely procedural - no external audio files required!
 */

class SoundController {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;

    // Fly buzzing audio nodes
    this.flyOsc1 = null;
    this.flyOsc2 = null;
    this.flyLfo = null;
    this.flyGain = null;
    this.lastFlyCount = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      if (this.bgmPlaying) this.stopBGM();
      if (this.flyGain && this.ctx) {
        this.flyGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } else {
      if (!this.bgmPlaying) this.startBGM();
      if (this.lastFlyCount > 0) {
        this.setFlyBuzz(this.lastFlyCount);
      }
    }
    return this.muted;
  }

  // Helper: Create a noise buffer
  createNoiseBuffer(duration = 0.2) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. POP UP SOUND (when butt emerges)
  playPop() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn(e);
    }
  }

  // 2. SMACK / SLAP SOUND (crisp skin slap impact)
  playSlap() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Low punch osc
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      oscGain.gain.setValueAtTime(0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);

      // Noise burst for sharp clap/slap crack
      const noiseBuffer = this.createNoiseBuffer(0.07);
      if (noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1600, now);
        filter.Q.setValueAtTime(1.8, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.07);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // 3. POOP SQUIRT / FART SOUND (hilarious wet squirt)
  playSquirt() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Buzzing oscillator for raspberry fart texture
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      // Pitch sweep down with funny vibrato
      const baseFreq = 140 + Math.random() * 50;
      osc1.frequency.setValueAtTime(baseFreq, now);
      osc1.frequency.linearRampToValueAtTime(baseFreq * 1.2, now + 0.04);
      osc1.frequency.exponentialRampToValueAtTime(45, now + 0.22);

      osc2.frequency.setValueAtTime(baseFreq * 0.98, now);
      osc2.frequency.exponentialRampToValueAtTime(40, now + 0.22);

      // Lowpass filter for muffled squelch
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(260, now + 0.22);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.23);
      osc2.stop(now + 0.23);

      // Add a wet squirt noise burst
      const squirtBuffer = this.createNoiseBuffer(0.15);
      if (squirtBuffer) {
        const squirtNoise = this.ctx.createBufferSource();
        squirtNoise.buffer = squirtBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1100, now);
        noiseFilter.Q.setValueAtTime(4.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, now + 0.03);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        squirtNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        squirtNoise.start(now + 0.03);
        squirtNoise.stop(now + 0.19);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // 4. MISS / SWOOSH SOUND (when slapping empty air)
  playWhoosh() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const noiseBuffer = this.createNoiseBuffer(0.12);
      if (!noiseBuffer) return;

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(900, now + 0.06);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.12);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.12);
    } catch (e) {
      console.warn(e);
    }
  }

  // 5. BONUS / COMBO SOUND (fanfare or chime)
  playChime(pitchMultiplier = 1) {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * pitchMultiplier, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // 6. TIMER WARNING BEEP
  playTick(isUrgent = false) {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isUrgent ? 'square' : 'sine';
      osc.frequency.setValueAtTime(isUrgent ? 880 : 440, now);

      gain.gain.setValueAtTime(isUrgent ? 0.2 : 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      console.warn(e);
    }
  }

  // 7. GAME OVER FANFARE
  playGameOver() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.18 }, // C5
        { f: 493.88, d: 0.18 }, // B4
        { f: 440.00, d: 0.18 }, // A4
        { f: 392.00, d: 0.22 }, // G4
        { f: 349.23, d: 0.22 }, // F4
        { f: 329.63, d: 0.45 }, // E4
      ];

      let t = now;
      melody.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + item.d);
        t += item.d;
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // 8. Bouncy Chiptune Background Groove (Optional toggle)
  startBGM() {
    if (this.muted || this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;

    // Bassline and cheeky chords
    const bassline = [
      130.81, 0, 130.81, 164.81, 146.83, 0, 174.61, 164.81,
      130.81, 0, 196.00, 164.81, 146.83, 164.81, 130.81, 0
    ];

    const playStep = () => {
      if (!this.bgmPlaying || this.muted) return;
      const now = this.ctx.currentTime;
      const freq = bassline[this.bgmStep % bassline.length];

      if (freq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
      }

      this.bgmStep++;
      this.bgmTimer = setTimeout(playStep, 220);
    };

    playStep();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // 9. Screen Splat Wet Impact (Loud, wet slap against camera screen)
  playScreenSplat() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Heavy wet thud
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.16);

      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);

      // Wet noise splash
      const noiseBuffer = this.createNoiseBuffer(0.22);
      if (noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, now);
        filter.frequency.exponentialRampToValueAtTime(350, now + 0.2);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.45, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.22);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // 10. Realistic & Comedic Fly Buzz Swarm Generator
  setFlyBuzz(count) {
    this.lastFlyCount = count;
    if (!this.ctx) return;

    if (this.muted || count <= 0) {
      if (this.flyGain) {
        this.flyGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      }
      return;
    }

    try {
      const now = this.ctx.currentTime;
      if (!this.flyOsc1) {
        this.flyOsc1 = this.ctx.createOscillator();
        this.flyOsc2 = this.ctx.createOscillator();
        this.flyLfo = this.ctx.createOscillator();
        this.flyLfoGain = this.ctx.createGain();
        this.flyFilter = this.ctx.createBiquadFilter();
        this.flyGain = this.ctx.createGain();

        // Authentic housefly frequency: ~190-210Hz
        this.flyOsc1.type = 'sawtooth';
        this.flyOsc1.frequency.setValueAtTime(192, now);

        this.flyOsc2.type = 'sawtooth';
        this.flyOsc2.frequency.setValueAtTime(201, now); // 9Hz acoustic beating!

        // Wing flutter LFO (~26Hz vibration)
        this.flyLfo.type = 'sine';
        this.flyLfo.frequency.setValueAtTime(26, now);
        this.flyLfoGain.gain.setValueAtTime(20, now);

        this.flyLfo.connect(this.flyOsc1.frequency);
        this.flyLfo.connect(this.flyOsc2.frequency);

        this.flyFilter.type = 'bandpass';
        this.flyFilter.frequency.setValueAtTime(850, now);
        this.flyFilter.Q.setValueAtTime(2.2, now);

        this.flyGain.gain.setValueAtTime(0, now);

        this.flyOsc1.connect(this.flyFilter);
        this.flyOsc2.connect(this.flyFilter);
        this.flyFilter.connect(this.flyGain);
        this.flyGain.connect(this.ctx.destination);

        this.flyOsc1.start(now);
        this.flyOsc2.start(now);
        this.flyLfo.start(now);
      }

      // Dynamic volume and jitter based on fly count
      const targetVol = Math.min(0.24, 0.045 + Math.min(count, 8) * 0.022);
      this.flyGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.15);

      // Subtle random frequency drift for realism
      const drift = 192 + (Math.random() - 0.5) * 16;
      this.flyOsc1.frequency.setTargetAtTime(drift, this.ctx.currentTime, 0.25);
      this.flyOsc2.frequency.setTargetAtTime(drift + 8, this.ctx.currentTime, 0.25);
    } catch (e) {
      console.warn(e);
    }
  }

  // 11. Swatting / squishing a fly
  playFlySwat() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.07);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      console.warn(e);
    }
  }
}

// Global audio instance
window.soundController = new SoundController();
