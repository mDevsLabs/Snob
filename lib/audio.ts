"use client";

class SoundManager {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playClick(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playMove(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playClear(enabled: boolean, lines: number) {
    if (!enabled || lines <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const baseFreq = 261.63; // C4
      // Pentatonic / major scale steps for a very harmonious clean clear sound
      const scale = [1, 1.25, 1.5, 1.667, 1.875, 2.0]; 

      for (let i = 0; i < lines; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = "sine";
        const freq = baseFreq * (scale[i % scale.length] || 1) * (1 + Math.floor(i / scale.length) * 0.5);
        const startTime = now + i * 0.08;
        const duration = 0.25;

        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + duration);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playGameOver(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playReward(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
      notes.forEach((freq, i) => {
        const start = now + i * 0.07;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playWin(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5 E5 G5 C6 E6
      notes.forEach((freq, i) => {
        const start = now + i * 0.09;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.14, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playPrestige(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Majestic rising chord
      const notes = [392, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const start = now + i * 0.06;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.16, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);
        osc.start(start);
        osc.stop(start + 1);
      });
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playBoxShake(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playBoxReveal(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Bright sparkling scale C5 - E5 - G5 - C6 - E6 - G6 with sawtooth/sine mix
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568.0];
      notes.forEach((freq, i) => {
        const start = now + i * 0.05;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = i % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.15, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }
  playCombo(enabled: boolean, comboLevel: number) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "sine";
      const baseFreq = 440;
      const freq = baseFreq * Math.pow(1.059463, comboLevel * 2);
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playFreeze(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const gain = this.ctx.createGain();
      
      lfo.type = "sine";
      lfo.frequency.value = 20;
      lfoGain.gain.value = 50;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.start(now);
      lfo.start(now);
      osc.stop(now + 0.3);
      lfo.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playExplosion(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playAchievement(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const start = now + i * 0.1;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.2, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
        osc.start(start);
        osc.stop(start + 0.7);
      });
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playDailyChallenge(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [392, 466.16, 587.33, 783.99]; // G minor arpeggio
      notes.forEach((freq, i) => {
        const start = now + i * 0.12;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.15, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);
        osc.start(start);
        osc.stop(start + 0.9);
      });
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playClubJoin(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now);
      osc2.frequency.setValueAtTime(659.25, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.1);
      osc2.stop(now + 1.1);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playThemeChange(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playAvatarEquip(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playCountdown(enabled: boolean) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(1000, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  private ambienceOscillators: OscillatorNode[] = [];
  private ambienceGain: GainNode | null = null;
  private isAmbiencePlaying = false;

  startAmbience(type: 'lofi' | 'synthwave' | 'classical' | 'none', volume: number) {
    if (type === 'none') {
      this.stopAmbience();
      return;
    }
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.stopAmbience();

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.connect(this.ctx.destination);
      this.ambienceGain.gain.value = volume;

      const now = this.ctx.currentTime;

      if (type === 'lofi') {
        const freqs = [196, 246.94, 293.66]; // G3, B3, D4
        freqs.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          osc.type = "triangle";
          osc.frequency.value = freq;
          const lfo = this.ctx!.createOscillator();
          const lfoGain = this.ctx!.createGain();
          lfo.type = "sine";
          lfo.frequency.value = 0.5;
          lfoGain.gain.value = 5;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          osc.connect(this.ambienceGain!);
          osc.start(now);
          lfo.start(now);
          this.ambienceOscillators.push(osc, lfo);
        });
      } else if (type === 'synthwave') {
        const freqs = [130.81, 196, 261.63]; // C3, G3, C4
        freqs.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.value = freq;
          const filter = this.ctx!.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = 800;
          osc.connect(filter);
          filter.connect(this.ambienceGain!);
          osc.start(now);
          this.ambienceOscillators.push(osc);
        });
      } else if (type === 'classical') {
        const freqs = [261.63, 329.63, 392]; // C4, E4, G4
        freqs.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          osc.type = "sine";
          osc.frequency.value = freq;
          osc.connect(this.ambienceGain!);
          osc.start(now);
          this.ambienceOscillators.push(osc);
        });
      }
      this.isAmbiencePlaying = true;
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  stopAmbience() {
    if (this.isAmbiencePlaying && this.ambienceOscillators.length > 0) {
      try {
        const now = this.ctx?.currentTime || 0;
        if (this.ambienceGain) {
          this.ambienceGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        }
        setTimeout(() => {
          this.ambienceOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) {}
          });
          this.ambienceOscillators = [];
          if (this.ambienceGain) {
            this.ambienceGain.disconnect();
            this.ambienceGain = null;
          }
          this.isAmbiencePlaying = false;
        }, 600);
      } catch (e) {
        console.warn("Audio Context stop error:", e);
      }
    }
  }

  setAmbienceVolume(volume: number) {
    if (this.ambienceGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambienceGain.gain.linearRampToValueAtTime(volume, now + 0.1);
    }
  }
}

export const sounds = new SoundManager();


