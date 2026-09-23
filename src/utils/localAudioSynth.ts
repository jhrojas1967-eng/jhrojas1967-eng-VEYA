/**
 * localAudioSynth.ts
 * Motor de síntesis vocal y tonos acústicos local para VEYA.
 * Utiliza Web Speech API (window.speechSynthesis) con fallback a Web Audio API (tonos armónicos).
 * Funciona de manera 100% offline y local en el navegador/preview.
 */

class LocalAudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Sintetiza voz en español local usando la Web Speech API
   */
  public speak(
    text: string,
    options: {
      voiceId?: string;
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onError?: () => void;
    } = {}
  ): void {
    if (typeof window === 'undefined') return;

    this.stop();

    if ('speechSynthesis' in window) {
      // Cancelar cualquier síntesis previa
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;

      // Obtener voces disponibles en el navegador
      const voices = window.speechSynthesis.getVoices();
      const spanishVoices = voices.filter((v) => v.lang.startsWith('es'));

      if (spanishVoices.length > 0) {
        if (options.voiceId === 'voice_aura' || options.voiceId === 'aura') {
          // Preferir voz femenina o primera española
          const female = spanishVoices.find((v) =>
            /helena|sabina|monica|laura|elena|maría|female/i.test(v.name)
          );
          utterance.voice = female || spanishVoices[0];
        } else if (options.voiceId === 'voice_brisa' || options.voiceId === 'brisa') {
          const brisa = spanishVoices.find((v) =>
            /lucia|sofia|carmen|rosa|conchita/i.test(v.name)
          );
          utterance.voice = brisa || spanishVoices[0];
        } else if (options.voiceId === 'voice_eco' || options.voiceId === 'eco') {
          // Preferir voz grave o masculina
          const male = spanishVoices.find((v) =>
            /jorge|enrique|pablo|diego|manuel|male/i.test(v.name)
          );
          utterance.voice = male || spanishVoices[spanishVoices.length - 1];
        } else {
          utterance.voice = spanishVoices[0];
        }
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        options.onEnd?.();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        // Si SpeechSynthesis falla en el iframe/sandbox, usamos el sintetizador armónico acústico de respaldo
        this.playHarmonicChime(options.onEnd);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback a tono acústico si no hay SpeechSynthesis
      this.playHarmonicChime(options.onEnd);
    }
  }

  /**
   * Muestra acústica de despertar progresivo según la curva elegida
   */
  public playWakeupSample(curveType: 'progressive' | 'zen' | 'bioacoustic', onEnd?: () => void): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      if (curveType === 'zen') {
        // Melodía tipo cuenco tibetano y piano suave en 432Hz
        const notes = [216, 288, 324, 432];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.35);
          gain.gain.setValueAtTime(0, now + idx * 0.35);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.35 + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.35 + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.35);
          osc.stop(now + idx * 0.35 + 2.0);
        });
        setTimeout(() => onEnd?.(), 2600);
      } else if (curveType === 'bioacoustic') {
        // Oleaje suave / bosque con armónicos triangulares relajantes
        const notes = [196, 246.94, 293.66, 392];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.4);
          gain.gain.setValueAtTime(0, now + idx * 0.4);
          gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.4 + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.4 + 2.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.4);
          osc.stop(now + idx * 0.4 + 2.2);
        });
        setTimeout(() => onEnd?.(), 2800);
      } else {
        // Progresivo: arpegio ascendente suave en piano C-Major
        const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.22);
          gain.gain.setValueAtTime(0, now + idx * 0.22);
          gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.22 + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.22 + 1.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.22);
          osc.stop(now + idx * 0.22 + 1.6);
        });
        setTimeout(() => onEnd?.(), 2400);
      }
    } catch {
      onEnd?.();
    }
  }

  /**
   * Detiene cualquier locución o sonido en curso
   */
  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Tono armónico zen acústico con Web Audio API (garantiza audio incluso si el TTS del sistema está silenciado o en iframe)
   */
  public playHarmonicChime(onEnd?: () => void): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Tríada armónica cálida: C4 (261.63Hz), E4 (329.63Hz), G4 (392.00Hz), C5 (523.25Hz)
      const freqs = [261.63, 329.63, 392.0, 523.25];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });

      setTimeout(() => {
        onEnd?.();
      }, 1500);
    } catch {
      onEnd?.();
    }
  }
}

export const localAudio = new LocalAudioSynthesizer();
