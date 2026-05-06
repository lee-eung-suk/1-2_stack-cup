class AudioController {
  ctx: AudioContext | null = null;
  enabled = true;

  init() {
    if (!this.enabled) return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch(e) {}
  }

  playRemove() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch(e) {}
  }

  playCrash() {
    if (!this.enabled || !this.ctx) return;
    try {
      // Noise buffer
      const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      
      const gain = this.ctx.createGain();
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      gain.gain.setValueAtTime(1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
      
      noise.start();
    } catch(e) {}
  }

  playRoll() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 1.0);
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.0);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.0);
    } catch(e) {}
  }

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.setValueAtTime(554.37, this.ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch(e) {}
  }

  playFail() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sawtooth';
      
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch(e) {}
  }

  playTing() {
    if (!this.enabled || !this.ctx) return;
    try {
       const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch(e) {}
  }
}

export const soundManager = new AudioController();
