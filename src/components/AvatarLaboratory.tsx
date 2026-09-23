import React, { useState, useRef, useEffect } from 'react';
import { CinematicAvatarCanvas } from './CinematicAvatarCanvas';
import { PixarAvatarSvg } from './PixarAvatarSvg';
import { AvatarState, AvatarMood } from '../types';
import { generateLottieAvatarJson, downloadJsonFile } from '../lottieExporter';
import { DEFAULT_LOTTIE_EXPORT_CONFIG, LottieExportConfiguration } from '../lottieConfig';
import {
  Sparkles,
  Copy,
  Check,
  Eye,
  Sliders,
  SunMedium,
  Wind,
  Layers,
  Volume2,
  Code2,
  Smile,
  ShieldCheck,
  Download,
  FileJson,
  FileCode,
  Terminal,
  Settings2,
  BookOpen,
  Boxes,
  Mic,
  MicOff,
  Play,
  Square,
  MousePointer,
  Radio,
  Sunrise,
  Flame,
  RotateCcw,
  Heart,
} from 'lucide-react';

export const AvatarLaboratory: React.FC = () => {
  const [state, setState] = useState<AvatarState>('idle');
  const [mood, setMood] = useState<AvatarMood>('sereno');
  const [amplitude, setAmplitude] = useState<number>(0.55);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [size, setSize] = useState<number>(260);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedLottie, setCopiedLottie] = useState<boolean>(false);
  const [copiedAndroidCode, setCopiedAndroidCode] = useState<boolean>(false);
  const [copiedConfigJson, setCopiedConfigJson] = useState<boolean>(false);
  const [renderEngine, setRenderEngine] = useState<'canvas' | 'svg'>('canvas');
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'night' | 'warm'>('studio');
  const [stageLighting, setStageLighting] = useState<'obsidian' | 'claridad'>('obsidian');
  const [showContactShadow, setShowContactShadow] = useState<boolean>(true);
  const [showAtmosphericParticles, setShowAtmosphericParticles] = useState<boolean>(true);
  const [showLottieModal, setShowLottieModal] = useState<boolean>(false);
  const [activeModalTab, setActiveModalTab] = useState<'export' | 'config' | 'guide' | 'statesGuide' | 'stageSpecs'>('export');

  // Advanced Avatar Interaction Controls
  const [interactiveGaze, setInteractiveGaze] = useState<boolean>(true);
  const [enableBlinking, setEnableBlinking] = useState<boolean>(true);
  const [enableTapSquish, setEnableTapSquish] = useState<boolean>(true);
  const [tapFeedbackToast, setTapFeedbackToast] = useState<string | null>(null);

  // Real Microphone Live Stream
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micAnimFrameRef = useRef<number | null>(null);

  // Web Speech TTS Demo
  const [isSpeakingTts, setIsSpeakingTts] = useState<boolean>(false);

  const states: { id: AvatarState; label: string; desc: string }[] = [
    { id: 'idle', label: 'Idle / Reposo', desc: 'Respiración orgánica sinusoidal (1.8 rad/s) y flotación armónica.' },
    { id: 'listening', label: 'Listening / Escucha', desc: 'Dilatación corneal atenta, auras concéntricas y ligera inclinación.' },
    { id: 'thinking', label: 'Thinking / Pensando', desc: 'Mirada ascendente contemplativa, orbe rotatorio de introspección.' },
    { id: 'speaking', label: 'Speaking / Hablando', desc: 'Apertura bucal y squash & stretch modulados por la amplitud RMS acústica.' },
    { id: 'muted', label: 'Muted / Silenciado', desc: 'Atenuación biomórfica de luminiscencia con indicador diagonal de reposo.' },
  ];

  const moods: { id: AvatarMood; name: string; hex: string; desc: string }[] = [
    { id: 'sereno', name: 'Sereno', hex: '#38BDF8', desc: 'Azul zafiro & cielo cristalino · Calma y claridad mental' },
    { id: 'cercano', name: 'Cercano', hex: '#C084FC', desc: 'Lila violeta & orquídea · Empatía y complicidad cordial' },
    { id: 'concentrado', name: 'Concentrado', hex: '#2DD4BF', desc: 'Menta esmeralda profunda · Foco y productividad' },
    { id: 'animado', name: 'Animado', hex: '#FBBF24', desc: 'Ámbar solar cálido · Motivación matinal y vitalidad' },
    { id: 'empatico', name: 'Empático', hex: '#F472B6', desc: 'Rosa coral aterciopelado · Acompañamiento reflexivo' },
    { id: 'espera', name: 'En espera', hex: '#94A3B8', desc: 'Perla y niebla pizarra · Discreción respetuosa' },
    { id: 'vital', name: 'Vital', hex: '#F97316', desc: 'Coral ámbar & destellos solares · Despertar enérgico, luz matinal y vitalidad empática' },
  ];

  // Configuración de exportación actual sincronizada
  const currentExportConfig: LottieExportConfiguration = {
    ...DEFAULT_LOTTIE_EXPORT_CONFIG,
    canvasDimensions: {
      ...DEFAULT_LOTTIE_EXPORT_CONFIG.canvasDimensions,
      recommendedDpSize: size,
    },
    assetConvention: {
      ...DEFAULT_LOTTIE_EXPORT_CONFIG.assetConvention,
      exampleFilename: `veya_avatar_${state}_${mood}.json`,
    },
  };

  // Exportar animación en formato Lottie JSON (.json) descargable directamente
  const handleDownloadLottie = () => {
    const lottieData = generateLottieAvatarJson(state, mood, amplitude, reducedMotion);
    downloadJsonFile(`veya_avatar_${state}_${mood}.json`, lottieData);
  };

  const handleCopyLottieJson = () => {
    const lottieData = generateLottieAvatarJson(state, mood, amplitude, reducedMotion);
    navigator.clipboard.writeText(JSON.stringify(lottieData, null, 2));
    setCopiedLottie(true);
    setTimeout(() => setCopiedLottie(false), 2200);
  };

  // Descargar archivo de configuración Lottie para Android
  const handleDownloadConfigFile = () => {
    downloadJsonFile('LottieExportConfig.json', currentExportConfig);
  };

  const handleCopyConfigFile = () => {
    navigator.clipboard.writeText(JSON.stringify(currentExportConfig, null, 2));
    setCopiedConfigJson(true);
    setTimeout(() => setCopiedConfigJson(false), 2200);
  };

  // Descargar los 5 JSON canónicos base para res/raw
  const [downloadingBatch, setDownloadingBatch] = useState(false);
  const handleDownloadAll5BaseJson = () => {
    setDownloadingBatch(true);
    const baseFiles = [
      { name: 'veya_avatar_idle_sereno.json', state: 'idle' as const, mood: 'sereno' as const, amp: 0.0 },
      { name: 'veya_avatar_listening_sereno.json', state: 'listening' as const, mood: 'sereno' as const, amp: 0.0 },
      { name: 'veya_avatar_thinking_sereno.json', state: 'thinking' as const, mood: 'sereno' as const, amp: 0.0 },
      { name: 'veya_avatar_speaking_animado.json', state: 'speaking' as const, mood: 'animado' as const, amp: 0.5 },
      { name: 'veya_avatar_muted_espera.json', state: 'muted' as const, mood: 'espera' as const, amp: 0.0 },
    ];
    baseFiles.forEach((file, index) => {
      setTimeout(() => {
        const data = generateLottieAvatarJson(file.state, file.mood, file.amp, false);
        downloadJsonFile(file.name, data);
        if (index === baseFiles.length - 1) {
          setDownloadingBatch(false);
        }
      }, index * 250);
    });
  };

  const androidComposeSnippet = `// 1. Añadir en app/build.gradle.kts:
// implementation("com.airbnb.android:lottie-compose:6.4.0")

// 2. Colocar los 5 archivos base en: app/src/main/res/raw/
// - veya_avatar_idle_sereno.json
// - veya_avatar_listening_sereno.json
// - veya_avatar_thinking_sereno.json
// - veya_avatar_speaking_animado.json
// - veya_avatar_muted_espera.json

// 3. Implementación en Jetpack Compose para Claude Code:
package personal.veya.ui.components.avatar

import androidx.annotation.RawRes
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.airbnb.lottie.LottieProperty
import com.airbnb.lottie.RenderMode
import com.airbnb.lottie.compose.LottieAnimation
import com.airbnb.lottie.compose.LottieCompositionSpec
import com.airbnb.lottie.compose.LottieConstants
import com.airbnb.lottie.compose.animateLottieCompositionAsState
import com.airbnb.lottie.compose.rememberLottieComposition
import com.airbnb.lottie.compose.rememberLottieDynamicProperties
import com.airbnb.lottie.compose.rememberLottieDynamicProperty
import personal.veya.R

enum class AvatarState { IDLE, LISTENING, THINKING, SPEAKING, MUTED }
enum class AvatarMood { SERENO, CERCANO, CONCENTRADO, ANIMADO, EMPATICO, ESPERA }

@RawRes
fun resolveAvatarRawRes(state: AvatarState, mood: AvatarMood = AvatarMood.SERENO): Int {
    return when (state) {
        AvatarState.IDLE -> R.raw.veya_avatar_idle_sereno
        AvatarState.LISTENING -> R.raw.veya_avatar_listening_sereno
        AvatarState.THINKING -> R.raw.veya_avatar_thinking_sereno
        AvatarState.SPEAKING -> R.raw.veya_avatar_speaking_animado
        AvatarState.MUTED -> R.raw.veya_avatar_muted_espera
    }
}

@Composable
fun VeyaLottieAvatar(
    modifier: Modifier = Modifier,
    state: AvatarState = AvatarState.${state.toUpperCase()},
    mood: AvatarMood = AvatarMood.${mood.toUpperCase()},
    size: Dp = ${size}.dp,
    amplitude: Float = ${amplitude}f,
    isPlaying: Boolean = true
) {
    val rawResId = resolveAvatarRawRes(state, mood)
    val composition by rememberLottieComposition(
        LottieCompositionSpec.RawRes(rawResId)
    )

    val dynamicSpeed = when (state) {
        AvatarState.SPEAKING -> 1.2f + (amplitude * 0.4f)
        AvatarState.LISTENING -> 1.15f
        AvatarState.THINKING -> 0.85f
        AvatarState.MUTED -> 0.0f
        AvatarState.IDLE -> 1.0f
    }

    val progress by animateLottieCompositionAsState(
        composition = composition,
        isPlaying = isPlaying && state != AvatarState.MUTED,
        iterations = LottieConstants.IterateForever,
        speed = dynamicSpeed
    )

    val reactiveScale by animateFloatAsState(
        targetValue = if (state == AvatarState.SPEAKING) 1.0f + (amplitude * 0.12f) else 1.0f,
        animationSpec = tween(durationMillis = 80),
        label = "reactive_scale"
    )

    val moodColor = remember(mood) {
        when (mood) {
            AvatarMood.SERENO -> Color(0xFF0284C7)
            AvatarMood.CERCANO -> Color(0xFFD97706)
            AvatarMood.CONCENTRADO -> Color(0xFF7C3AED)
            AvatarMood.ANIMADO -> Color(0xFF10B981)
            AvatarMood.EMPATICO -> Color(0xFFEC4899)
            AvatarMood.ESPERA -> Color(0xFF64748B)
        }
    }

    val dynamicProperties = rememberLottieDynamicProperties(
        rememberLottieDynamicProperty(
            property = LottieProperty.STROKE_COLOR,
            value = moodColor.toArgb(),
            keyPath = arrayOf("07_Body_Breathing_Orb", "Main_Sphere", "Rim_Light_Stroke")
        ),
        rememberLottieDynamicProperty(
            property = LottieProperty.COLOR_FILTER,
            value = moodColor.toArgb(),
            keyPath = arrayOf("04_Iris_Bioluminescence", "**")
        ),
        rememberLottieDynamicProperty(
            property = LottieProperty.STROKE_COLOR,
            value = moodColor.toArgb(),
            keyPath = arrayOf("06_Mouth_Micro_Expression", "**")
        )
    )

    Box(
        modifier = modifier
            .size(size)
            .scale(reactiveScale),
        contentAlignment = Alignment.Center
    ) {
        LottieAnimation(
            composition = composition,
            progress = { progress },
            dynamicProperties = dynamicProperties,
            modifier = Modifier.size(size),
            renderMode = RenderMode.HARDWARE,
            enableMergePaths = true
        )
    }
}`;

  const handleCopyAndroidCode = () => {
    navigator.clipboard.writeText(androidComposeSnippet);
    setCopiedAndroidCode(true);
    setTimeout(() => setCopiedAndroidCode(false), 2200);
  };

  const handleCopyComposeSpec = () => {
    const spec = `/**
 * VEYA CINEMATIC AVATAR - JETPACK COMPOSE / LOTTIE SPECIFICATION
 * Estilo Visual: Pixar / Disney 3D Volumetric Porcelain & Subsurface Scattering
 *
 * Configuración Actual:
 * - Estado: ${state.toUpperCase()}
 * - Mood: ${mood.toUpperCase()} (${moods.find((m) => m.id === mood)?.name})
 * - Amplitud acústica (RMS Mic): ${amplitude}
 * - Accesibilidad (Reduced Motion): ${reducedMotion}
 * - Motor de render recomendado en Android: Lottie Compose (res/raw/veya_avatar_${state}_${mood}.json)
 * - Archivo de configuración: lottie-export-config.json (Bodymovin v5.5)
 *
 * Parámetros Físicos de Iluminación Pixar:
 * 1. Keylight Especular: Capa "Eye_Specularity_Glints"
 * 2. Rim Light Translúcido: Capa "Body_Breathing_Orb" con trazado exterior
 * 3. Subsurface Scattering (SSS): Gradiente radial multicapa #38BDF8 a #155E95
 * 4. Micro-expresiones oculares: Capa "Eyes_Pixar_Obsidian" (#0B1522)
 * 5. Ciclo de respiración: Frecuencia 1.8 Hz (120 frames a 60fps), escala X: 97%-103%, Y: 98%-102%
 */
`;
    navigator.clipboard.writeText(spec);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Quick preset actions to demonstrate Pixar reactive dynamism
  const triggerStatePreset = (st: AvatarState, md: AvatarMood, amp = 0.5) => {
    setState(st);
    setMood(md);
    setAmplitude(amp);
  };

  // Real Microphone Stream Controller (Web Audio API)
  const toggleRealMic = async () => {
    if (isMicActive) {
      if (micAnimFrameRef.current) cancelAnimationFrame(micAnimFrameRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      setIsMicActive(false);
      setState('idle');
      setAmplitude(0.45);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.45;
        source.connect(analyser);
        analyserRef.current = analyser;

        setIsMicActive(true);
        setState('listening');
        setMood('concentrado');

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMicLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalizedAmp = Math.min(1, Math.max(0, avg / 110));
          setAmplitude(normalizedAmp);

          if (normalizedAmp > 0.22) {
            setState('listening');
          } else {
            setState('listening');
          }

          micAnimFrameRef.current = requestAnimationFrame(updateMicLevel);
        };
        micAnimFrameRef.current = requestAnimationFrame(updateMicLevel);
      } catch (err) {
        console.warn('Microphone permission error or unavailable:', err);
        setTapFeedbackToast('⚠️ No se pudo acceder al micrófono. Verifica los permisos de tu navegador.');
        setTimeout(() => setTapFeedbackToast(null), 3000);
      }
    }
  };

  // Web Speech API Voice Synthesis Test
  const handleTestSpeech = () => {
    if (!('speechSynthesis' in window)) {
      setTapFeedbackToast('⚠️ Síntesis de voz no disponible en este navegador');
      setTimeout(() => setTapFeedbackToast(null), 2500);
      return;
    }
    if (isSpeakingTts) {
      window.speechSynthesis.cancel();
      setIsSpeakingTts(false);
      setState('idle');
      setAmplitude(0.45);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      'Hola José. Soy VEYA. Todo tu procesamiento es local, privado y respetuoso con tu atención.'
    );
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.06;

    setState('speaking');
    setMood('cercano');
    setIsSpeakingTts(true);

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(interval);
        return;
      }
      const elapsed = (Date.now() - startTime) / 1000;
      const wave = (Math.sin(elapsed * 9) + Math.cos(elapsed * 13) + 2) / 4;
      setAmplitude(0.25 + wave * 0.65);
    }, 60);

    utterance.onend = () => {
      clearInterval(interval);
      setIsSpeakingTts(false);
      setState('idle');
      setAmplitude(0.45);
    };

    utterance.onerror = () => {
      clearInterval(interval);
      setIsSpeakingTts(false);
      setState('idle');
      setAmplitude(0.45);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Tactile Avatar Tap Handler
  const handleAvatarTap = () => {
    setTapFeedbackToast('✨ ¡Interacción táctil! Rebote elástico & destellos bioluminiscentes');
    setTimeout(() => setTapFeedbackToast(null), 2200);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (micAnimFrameRef.current) cancelAnimationFrame(micAnimFrameRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-[#12181F] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#155E95] to-[#38BDF8] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                Laboratorio del Avatar Cinemático VEYA
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300">
                  Estilo Pixar 3D
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistema de volumen tridimensional, respiración orgánica y exportador de animaciones y configuración Lottie-Compose para Android.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Engine Selector: Canvas 60fps vs Advanced SVG */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setRenderEngine('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                renderEngine === 'canvas'
                  ? 'bg-white dark:bg-[#1C242E] text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Canvas 60fps</span>
            </button>
            <button
              onClick={() => setRenderEngine('svg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                renderEngine === 'svg'
                  ? 'bg-white dark:bg-[#1C242E] text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>SVG Vectorial</span>
            </button>
          </div>

          {/* LOTTIE EXPORT & CONFIG BUTTONS */}
          <button
            onClick={() => {
              setActiveModalTab('export');
              setShowLottieModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-xs"
            title="Abrir exportador de Lottie y guía de integración para Android"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Lottie & Compose</span>
          </button>

          <button
            onClick={handleDownloadConfigFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs border border-slate-200/60 dark:border-slate-700"
            title="Descargar archivo de configuración Lottie (lottie-export-config.json)"
          >
            <Settings2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Config JSON</span>
          </button>

          <button
            onClick={handleDownloadLottie}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-xs"
            title="Descargar animación Lottie JSON activa"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>.json</span>
          </button>

          <button
            onClick={handleCopyComposeSpec}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#155E95] hover:bg-[#104873] text-white text-xs font-bold transition-all shadow-xs"
            title="Copiar especificaciones técnicas para Compose"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Spec Copiada' : 'Spec'}</span>
          </button>
        </div>
      </div>

      {/* LOTTIE EXPORTER & INTEGRATION HUB (EXPANDABLE MODAL / DIALOG) */}
      {showLottieModal && (
        <div className="bg-slate-50 dark:bg-[#101721] border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                L
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Lottie-Compose Hub: Exportación & Guía Android
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                    Bodymovin v5.5
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Prepara y sincroniza los parámetros de exportación para Claude Code y el equipo de Android.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Tab Selector */}
              <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveModalTab('export')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    activeModalTab === 'export'
                      ? 'bg-white dark:bg-[#1C2633] text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Animación</span>
                </button>
                <button
                  onClick={() => setActiveModalTab('config')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    activeModalTab === 'config'
                      ? 'bg-white dark:bg-[#1C2633] text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Settings2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Config JSON</span>
                </button>
                <button
                  onClick={() => setActiveModalTab('guide')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    activeModalTab === 'guide'
                      ? 'bg-white dark:bg-[#1C2633] text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                  <span>Guía Kotlin</span>
                </button>
                <button
                  onClick={() => setActiveModalTab('statesGuide')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    activeModalTab === 'statesGuide'
                      ? 'bg-white dark:bg-[#1C2633] text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Avatar ↔ Estados</span>
                </button>
                <button
                  onClick={() => setActiveModalTab('stageSpecs')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    activeModalTab === 'stageSpecs'
                      ? 'bg-white dark:bg-[#1C2633] text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-sky-500" />
                  <span>Specs Escenario 3D</span>
                </button>
              </div>

              <button
                onClick={() => setShowLottieModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1 rounded-md"
              >
                ✕
              </button>
            </div>
          </div>

          {/* TAB 1: EXPORTACIÓN DE ARCHIVO DE ANIMACIÓN */}
          {activeModalTab === 'export' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Action Card 1: Descargar archivo Lottie JSON */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#15212D] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                      <span className="flex items-center gap-1.5">
                        <FileJson className="w-4 h-4 text-emerald-600" />
                        <span>Archivo de Animación Bodymovin</span>
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                        veya_avatar_{state}_{mood}.json
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Generado para: estado <strong>{state}</strong> · matiz <strong>{mood}</strong>.
                      60 fps, 120 frames (2.0s de ciclo respiratorio), squash & stretch sinusoidal de 97% a 103%.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadLottie}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar .json</span>
                    </button>
                    <button
                      onClick={handleCopyLottieJson}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                    >
                      {copiedLottie ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLottie ? 'Copiado' : 'Copiar JSON'}</span>
                    </button>
                  </div>
                </div>

                {/* Action Card 2: Archivo de Configuración de Parámetros */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#15212D] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Settings2 className="w-4 h-4 text-blue-600" />
                        <span>Configuración de Exportación</span>
                      </span>
                      <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded">
                        LottieExportConfig.json
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Especificación de capas Bodymovin, mapeo de nombres para <code className="font-mono text-blue-600 dark:text-blue-400">app/src/main/res/raw</code>, keypaths dinámicos y matriz de velocidades por estado.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadConfigFile}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#155E95] hover:bg-[#104873] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Config</span>
                    </button>
                    <button
                      onClick={handleCopyConfigFile}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                    >
                      {copiedConfigJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedConfigJson ? 'Copiado' : 'Copiar Config'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Batch Download Banner for the 5 Canonical Base Assets */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Paquete Oficial Fase B: 5 Assets Base para res/raw/
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Incluye los 5 archivos canónicos (idle, listening, thinking, speaking, muted) con soporte para tintado dinámico de Mood en Compose.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2 text-[10px] font-mono">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">veya_avatar_idle_sereno.json</span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">veya_avatar_listening_sereno.json</span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">veya_avatar_thinking_sereno.json</span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">veya_avatar_speaking_animado.json</span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">veya_avatar_muted_espera.json</span>
                  </div>
                </div>
                <button
                  onClick={handleDownloadAll5BaseJson}
                  disabled={downloadingBatch}
                  className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingBatch ? 'Descargando 5...' : 'Descargar los 5 .json'}</span>
                </button>
              </div>

              {/* Quick Summary of Current Active Export Parameters */}
              <div className="p-3.5 bg-white dark:bg-[#121A24] rounded-xl border border-slate-200/70 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Destino en Android</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">res/raw/*.json</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Frecuencia / Duración</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">1.8 Hz (120 frames)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Deformación Squash</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">97% - 103% (X/Y)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Librería Android</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">lottie-compose:6.4</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONFIGURACIÓN JSON DETALLADA */}
          {activeModalTab === 'config' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Boxes className="w-4 h-4 text-blue-500" />
                  <span>Estructura de Parámetros de Exportación (Bodymovin / Compose)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyConfigFile}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                  >
                    {copiedConfigJson ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedConfigJson ? 'Copiado' : 'Copiar'}</span>
                  </button>
                  <button
                    onClick={handleDownloadConfigFile}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Download className="w-3 h-3" />
                    <span>Descargar .json</span>
                  </button>
                </div>
              </div>

              {/* JSON Visualizer */}
              <div className="bg-[#0D131A] text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-72 border border-slate-800 select-all">
                <pre>{JSON.stringify(currentExportConfig, null, 2)}</pre>
              </div>

              {/* Layers Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {DEFAULT_LOTTIE_EXPORT_CONFIG.layers.map((layer) => (
                  <div
                    key={layer.name}
                    className="p-2 bg-white dark:bg-[#15212D] rounded-lg border border-slate-200/60 dark:border-slate-800 flex items-start gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[10px]">
                        {layer.name}
                      </span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{layer.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GUÍA DE INTEGRACIÓN JETPACK COMPOSE */}
          {activeModalTab === 'guide' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <FileCode className="w-4 h-4 text-[#155E95]" />
                  <span>VeyaAvatarLottie.kt (Jetpack Compose / Claude Code)</span>
                </div>
                <button
                  onClick={handleCopyAndroidCode}
                  className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#155E95] text-white hover:bg-[#104873] shadow-xs"
                >
                  {copiedAndroidCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAndroidCode ? 'Código Copiado' : 'Copiar Código Kotlin'}</span>
                </button>
              </div>

              <div className="bg-[#0B121A] text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                <pre>{androidComposeSnippet}</pre>
              </div>

              {/* Step by step guide footer */}
              <div className="bg-white dark:bg-[#121A24] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <Terminal className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Pasos de Integración en el Repositorio Android de VEYA:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Coloca <code>LottieExportConfig.json</code> en la raíz de documentación o assets del proyecto Android.</li>
                    <li>Guarda los archivos descargados en <code>app/src/main/res/raw/veya_avatar_*.json</code>.</li>
                    <li>Copia el componente Composable a <code>personal.veya.ui.components.avatar</code>.</li>
                    <li>Consulta el archivo completo en <code>entregas/02_guia_integracion_lottie_compose.md</code>.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GUÍA CANÓNICA AVATAR ↔ ESTADO Y TRANSICIONES */}
          {activeModalTab === 'statesGuide' && (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Guía Técnica Canónica: 5 Estados y Matriz de Transiciones</span>
                </div>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80">
                  Especificación de micro-comportamientos faciales, frecuencias respiratorias y curvas cinéticas en Jetpack Compose.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    st: 'IDLE (Reposo)',
                    freq: '1.8 rad/s (60 FPS, 120f)',
                    desc: 'Respiración orgánica sinusoidal en contrafase. Parpadeo periódico cada 3.5s ± 1.2s. Sonrisa relajada.',
                    file: 'veya_avatar_idle_sereno.json',
                  },
                  {
                    st: 'LISTENING (Escucha)',
                    freq: '1.15x velocidad',
                    desc: 'Dilatación pupilar +15%, inclinación atenta de 1.5º y ondas acústicas concéntricas (00_Acoustic_Listening_Ripples).',
                    file: 'veya_avatar_listening_sereno.json',
                  },
                  {
                    st: 'THINKING (Pensando)',
                    freq: '0.85x velocidad',
                    desc: 'Mirada reflexiva ascendente (Y = -8px), constricción analítica pupilar al 85% y aceleración del latido interno a 2.4 Hz.',
                    file: 'veya_avatar_thinking_sereno.json',
                  },
                  {
                    st: 'SPEAKING (Habla)',
                    freq: 'Reactiva a RMS Mic (1.4x - 1.8x)',
                    desc: 'Apertura oral elíptica con cavidad interna y resonancia lingual. Rebote elástico con squash & stretch sincronizado con la voz.',
                    file: 'veya_avatar_speaking_animado.json',
                  },
                  {
                    st: 'MUTED (Espera/Silencio)',
                    freq: '0.0x (Estático)',
                    desc: 'Barra diagonal de silencio roja (00_Muted_Slash_Indicator), opacidad atenuada al 20% y postura serena de descanso.',
                    file: 'veya_avatar_muted_espera.json',
                  },
                ].map((item) => (
                  <div key={item.st} className="p-3 rounded-2xl bg-white dark:bg-[#141E28] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-slate-100">{item.st}</span>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">{item.freq}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{item.desc}</p>
                    <span className="text-[10px] font-mono text-slate-400 block pt-1 border-t border-slate-100 dark:border-slate-800">
                      Archivo: {item.file}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SPECS CLARIDAD Y ESCENARIO 3D */}
          {activeModalTab === 'stageSpecs' && (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/40 text-xs text-sky-900 dark:text-sky-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>Especificación Óptica: Escenario Tridimensional & Claridad</span>
                </div>
                <p className="text-[11px] text-sky-800/90 dark:text-sky-300/80">
                  Modelo de 4 planos de profundidad, iluminación cenital a 45º, sombra de suelo en contrafase y atmósfera browniana.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141E28] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100">1. Iluminación Keylight Cenital & Rim Light Vítreo</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Keylight a 45º superior izquierda (temperatura 6500K luz diurna). Gradiente de Subsurface Scattering (SSS) de 4 paradas: Highlight Blanco Puro (0.00) &rarr; Borde Translúcido Rim (0.25) &rarr; Dispersión SSS (0.65) &rarr; Sombra de Base (1.00).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141E28] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100">2. Sombra de Contacto en Suelo (Contact Shadow Floor)</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Elipse difusa situada bajo el avatar con deformación en contrafase a la flotación: al subir el avatar, la sombra mengua y se difumina; al bajar, se ensancha y densifica.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141E28] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100">3. Atmósfera de Micro-Partículas Bioluminiscentes (26 Motas)</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    13 partículas en plano de fondo y 13 en primer plano con movimiento browniano y centelleo armónico dependiente del matiz emocional activo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Studio Viewport (Cinematic Diorama Stage) */}
      <div
        className={`relative min-h-[380px] rounded-3xl flex flex-col items-center justify-center p-6 overflow-hidden border transition-all duration-500 ${
          lightingPreset === 'night'
            ? 'bg-gradient-to-b from-[#06090E] via-[#0C131D] to-[#121824] border-slate-800'
            : lightingPreset === 'warm'
            ? 'bg-gradient-to-b from-[#FDFBF7] via-[#F6EFE9] to-[#EFE2D3] dark:from-[#171310] dark:via-[#1F1916] dark:to-[#2A221E] border-amber-200/50 dark:border-amber-900/40'
            : 'bg-gradient-to-b from-[#F0F6FA] via-[#E8F1F7] to-[#DFEAF2] dark:from-[#090E14] dark:via-[#0E151F] dark:to-[#141C29] border-slate-200/70 dark:border-slate-800/80'
        }`}
      >
        {/* Optical Ground Reflection & Atmospheric Shadows */}
        <div
          className="absolute bottom-10 w-64 h-12 rounded-[100%] blur-xl opacity-35 dark:opacity-55 pointer-events-none transition-all duration-700"
          style={{
            backgroundColor: moods.find((m) => m.id === mood)?.hex || '#38BDF8',
          }}
        />

        {/* Top Studio Lighting Controls Overlay */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/40 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Motor: {renderEngine === 'canvas' ? 'Interactive 2D Canvas con Partículas' : 'SVG con Filtros y Radial Shaders'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* 3D Stage Mode: Claridad vs Obsidian */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/40 dark:border-white/10 text-xs">
              <span className="text-[10px] font-bold text-slate-400 px-1.5">3D Stage:</span>
              <button
                onClick={() => setStageLighting('claridad')}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                  stageLighting === 'claridad'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title="Luz diurna cristalina con keylight cenital 6500K"
              >
                Claridad
              </button>
              <button
                onClick={() => setStageLighting('obsidian')}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                  stageLighting === 'obsidian'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title="Fondo cinematográfico oscuro de alta inmersión"
              >
                Obsidian
              </button>
            </div>

            {/* Sombra Suelo & Partículas Toggles */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/40 dark:border-white/10 text-xs">
              <button
                onClick={() => setShowContactShadow(!showContactShadow)}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                  showContactShadow
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Sombra de contacto en suelo con deformación elíptica en contrafase"
              >
                Sombra Suelo
              </button>
              <button
                onClick={() => setShowAtmosphericParticles(!showAtmosphericParticles)}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                  showAtmosphericParticles
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="26 motas atmosféricas bioluminiscentes flotantes"
              >
                Partículas
              </button>
            </div>

            {/* Ambiente Preset */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/40 dark:border-white/10 text-xs">
              {[
                { id: 'studio', label: 'Estudio' },
                { id: 'warm', label: 'Cálido' },
                { id: 'night', label: 'OLED' },
              ].map((lp) => (
                <button
                  key={lp.id}
                  onClick={() => setLightingPreset(lp.id as any)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                    lightingPreset === lp.id
                      ? 'bg-[#155E95] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  {lp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Pixar Avatar Component */}
        <div className="relative my-4 z-10 flex flex-col items-center">
          {tapFeedbackToast && (
            <div className="absolute -top-10 px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md border border-white/20 animate-in fade-in slide-in-from-top-2 duration-150 z-20 pointer-events-none">
              {tapFeedbackToast}
            </div>
          )}
          {renderEngine === 'canvas' ? (
            <CinematicAvatarCanvas
              state={state}
              mood={mood}
              size={size}
              reducedMotion={reducedMotion}
              amplitude={amplitude}
              showMoodBadge
              stageMode={stageLighting}
              showFloorShadow={showContactShadow}
              showAtmosphere={showAtmosphericParticles}
              interactiveGaze={interactiveGaze}
              enableBlinking={enableBlinking}
              enableTapSquish={enableTapSquish}
              onTap={handleAvatarTap}
            />
          ) : (
            <PixarAvatarSvg
              state={state}
              mood={mood}
              size={size}
              reducedMotion={reducedMotion}
              amplitude={amplitude}
              showStatusLabel
            />
          )}
        </div>

        {/* Real-time Interaction Bar: Mic, Voice TTS, Gaze, Blink, Tap */}
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 z-10">
          <button
            onClick={toggleRealMic}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
              isMicActive
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
            title="Activa el micrófono real mediante Web Audio API para modular la amplitud del avatar"
          >
            {isMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-rose-500" />}
            <span>{isMicActive ? 'Detener Micrófono' : 'Hablar al Avatar (Mic Real)'}</span>
          </button>

          <button
            onClick={handleTestSpeech}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
              isSpeakingTts
                ? 'bg-[#155E95] text-white border-[#104873]'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
            title="Sintetiza voz con Web Speech API y modula la boca del avatar"
          >
            {isSpeakingTts ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-blue-500" />}
            <span>{isSpeakingTts ? 'Detener Voz' : 'Probar Voz Sintetizada (TTS)'}</span>
          </button>
        </div>

        {/* Quick Pixar Presets Bar (Instant Personality Demonstrations) */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 z-10">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Escenas rápidas:</span>
          <button
            onClick={() => triggerStatePreset('speaking', 'vital', 0.85)}
            className="px-2.5 py-1 rounded-full bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 text-[11px] font-bold border border-orange-300 dark:border-orange-800 transition-all flex items-center gap-1.5 shadow-xs"
            title="Modelo Vital: Despertar enérgico, calidez vocal y destellos solares"
          >
            <SunMedium className="w-3 h-3 text-orange-500" />
            <span>Vital · Despertar Enérgico</span>
          </button>
          <button
            onClick={() => triggerStatePreset('listening', 'vital', 0.0)}
            className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-300 dark:border-amber-800 transition-all flex items-center gap-1.5 shadow-xs"
            title="Modelo Vital: Ladeo empático de cabeza, micro-asentimiento y mirada atenta"
          >
            <Heart className="w-3 h-3 text-amber-500" />
            <span>Vital · Escucha Empática</span>
          </button>
          <button
            onClick={() => triggerStatePreset('thinking', 'concentrado', 0.1)}
            className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Wind className="w-3 h-3 text-teal-500" />
            <span>Introspección Local</span>
          </button>
          <button
            onClick={() => triggerStatePreset('listening', 'empatico', 0.4)}
            className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Smile className="w-3 h-3 text-pink-500" />
            <span>Escucha Comprensiva</span>
          </button>
        </div>
      </div>

      {/* Control Engineering Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Column 1: Voice & Assistant Reactive States */}
        <div className="space-y-3 bg-slate-50 dark:bg-[#16202A] p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#155E95] dark:text-[#8ECEFF]" />
              <span>1. Estados VeyaVoiceBus</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">5 Estados</span>
          </div>

          <div className="space-y-2">
            {states.map((st) => (
              <button
                key={st.id}
                onClick={() => setState(st.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col gap-0.5 border ${
                  state === st.id
                    ? 'bg-white dark:bg-[#1F2B38] border-[#155E95] dark:border-[#8ECEFF] shadow-xs'
                    : 'bg-transparent border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${state === st.id ? 'text-[#155E95] dark:text-[#8ECEFF]' : 'text-slate-700 dark:text-slate-300'}`}>
                    {st.label}
                  </span>
                  {state === st.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#155E95] dark:bg-[#8ECEFF]" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {st.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Personality & Mood Spectrums */}
        <div className="space-y-3 bg-slate-50 dark:bg-[#16202A] p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-[#7654A7] dark:text-[#DCB8FF]" />
              <span>2. Espectro Emocional / Moods</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{moods.length} Matices</span>
          </div>

          <div className="space-y-2">
            {moods.map((m) => {
              const isVital = m.id === 'vital';
              const isSelected = mood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between border ${
                    isSelected
                      ? isVital
                        ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-400 dark:border-orange-600 shadow-xs ring-1 ring-orange-400'
                        : 'bg-white dark:bg-[#1F2B38] border-slate-300 dark:border-slate-600 shadow-xs'
                      : isVital
                      ? 'bg-orange-50/30 dark:bg-orange-950/10 border-orange-200/70 dark:border-orange-900/40 hover:bg-orange-50/60 dark:hover:bg-orange-950/20'
                      : 'bg-transparent border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: m.hex }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs font-bold ${isSelected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                          {m.name}
                        </p>
                        {isVital && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 tracking-wider">
                            Empático & Amable
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{m.desc.split('·')[0]}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 ${isVital ? 'text-orange-500' : 'text-emerald-500'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Banner de información de gestualidad exclusiva del modelo Vital */}
          {mood === 'vital' && (
            <div className="mt-3 p-3 rounded-xl bg-orange-50/90 dark:bg-orange-950/40 border border-orange-200/90 dark:border-orange-800/70 text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-orange-800 dark:text-orange-300 font-bold mb-1">
                <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
                <span>Modelo Vital: Expresiones Empáticas Activas</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Ladeo empático de cabeza en escucha, asentimiento dulce, mirada luminosa con rubor melocotón, sonrisa cercana con hoyuelos y transiciones continuas a 60 fps exclusivas de este modelo.
              </p>
            </div>
          )}
        </div>

        {/* Column 3: Physical Parameters & Lighting Modulations */}
        <div className="space-y-4 bg-slate-50 dark:bg-[#16202A] p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>3. Modulación & Accesibilidad</span>
            </h3>

            {/* Microphone Amplitude Slider */}
            <div className="space-y-2 mb-4 bg-white dark:bg-[#12181F] p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                  <Volume2 className="w-3.5 h-3.5 text-[#155E95] dark:text-[#8ECEFF]" />
                  <span>Reactividad Acústica (RMS)</span>
                </span>
                <span className="font-mono text-[11px] text-[#155E95] dark:text-[#8ECEFF]">
                  {Math.round(amplitude * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={amplitude}
                onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                className="w-full accent-[#155E95] dark:accent-[#8ECEFF] cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Aumenta el squash & stretch y la apertura fonética al hablar.
              </p>
            </div>

            {/* Dimensions Switcher */}
            <div className="space-y-2 mb-4 bg-white dark:bg-[#12181F] p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Escala de visualización:
              </span>
              <div className="flex gap-2">
                {[180, 220, 260, 300].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSize(sz)}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                      size === sz
                        ? 'bg-[#155E95] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Physics & Eye Toggles */}
            <div className="space-y-2 mb-4 bg-white dark:bg-[#12181F] p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Física e Interacción Biométrica:
              </span>
              
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer py-1">
                <span className="flex items-center gap-1.5">
                  <MousePointer className="w-3.5 h-3.5 text-[#155E95] dark:text-[#8ECEFF]" />
                  <span>Seguimiento de Mirada 2.5D</span>
                </span>
                <input
                  type="checkbox"
                  checked={interactiveGaze}
                  onChange={(e) => setInteractiveGaze(e.target.checked)}
                  className="w-4 h-4 rounded text-[#155E95] focus:ring-[#155E95]"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer py-1">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#7654A7] dark:text-[#C084FC]" />
                  <span>Parpadeo Orgánico (150ms)</span>
                </span>
                <input
                  type="checkbox"
                  checked={enableBlinking}
                  onChange={(e) => setEnableBlinking(e.target.checked)}
                  className="w-4 h-4 rounded text-[#155E95] focus:ring-[#155E95]"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer py-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Squish Táctil & Destellos</span>
                </span>
                <input
                  type="checkbox"
                  checked={enableTapSquish}
                  onChange={(e) => setEnableTapSquish(e.target.checked)}
                  className="w-4 h-4 rounded text-[#155E95] focus:ring-[#155E95]"
                />
              </label>
            </div>

            {/* Reduced Motion Toggle */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#12181F] border border-slate-200/60 dark:border-slate-700/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#155E95] focus:ring-[#155E95]"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Movimiento Reducido (WCAG 2.1)
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Desactiva fluctuaciones dinámicas y partículas, preservando el volumen y la iluminación Pixar en reposo.
                </span>
              </div>
            </label>
          </div>

          {/* Android Export Info Footnote */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Configuración sincronizada con Lottie-Compose 6.4+.</span>
            </div>
            <button
              onClick={() => {
                setActiveModalTab('guide');
                setShowLottieModal(true);
              }}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              Guía Android Compose →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

