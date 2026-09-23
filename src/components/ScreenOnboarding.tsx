import React, { useState } from 'react';
import { AvatarVisual } from './AvatarVisual';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Sparkles,
  Volume2,
  ShieldCheck,
  Heart,
  User,
  Sliders,
  Sun,
  Moon,
  Eye,
  Bell,
  Clock,
  Music,
  Folder,
  Newspaper,
  Rss,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Zap,
  Play,
  Pause,
  Sunrise,
  Waves,
  Radio,
} from 'lucide-react';
import { OnboardingStep, AvatarState, AvatarMood, PronounTreatment } from '../types';
import { useVeya } from '../context/VeyaGlobalContext';
import { localAudio } from '../utils/localAudioSynth';

interface ScreenOnboardingProps {
  onFinish: () => void;
  onNavigateToSettings?: (sectionId: string) => void;
}

export const ScreenOnboarding: React.FC<ScreenOnboardingProps> = ({
  onFinish,
  onNavigateToSettings,
}) => {
  const {
    partnerProfile,
    setUserName,
    setAssistantName,
    setPronounTreatment,
    voiceProfile,
    setSelectedVoiceId,
    setWarmth,
  } = useVeya();

  // Estado del flujo reanudable en 8 pasos
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [themePreference, setThemePreference] = useState<'system' | 'light' | 'dark'>('system');

  // Valores de los pasos
  const [localUserName, setLocalUserName] = useState<string>(partnerProfile.userName || 'José');
  const [localAssistantName, setLocalAssistantName] = useState<string>(partnerProfile.assistantName || 'VEYA');
  const [localPronoun, setLocalPronoun] = useState<PronounTreatment>(partnerProfile.pronounTreatment || 'tu');

  // Paso 3: Voz
  const [selectedVoice, setSelectedVoice] = useState<string>(voiceProfile.selectedVoiceId || 'voice_aura');
  const [isPlayingVoiceSample, setIsPlayingVoiceSample] = useState<boolean>(false);

  // Reproducir muestra de voz localmente
  const handleToggleVoiceSample = (voiceId: string) => {
    if (isPlayingVoiceSample) {
      localAudio.stop();
      setIsPlayingVoiceSample(false);
    } else {
      setIsPlayingVoiceSample(true);
      const voiceNames: Record<string, string> = {
        voice_aura: 'Aura',
        voice_brisa: 'Brisa',
        voice_eco: 'Eco',
      };
      const textToSpeak = `Hola ${localUserName}, soy ${localAssistantName}. Esta es mi voz ${voiceNames[voiceId] || 'Aura'}, procesada en tu teléfono con calidez y calma.`;
      localAudio.speak(textToSpeak, {
        voiceId,
        rate: 1.0,
        pitch: voiceId === 'voice_eco' ? 0.85 : voiceId === 'voice_brisa' ? 1.15 : 1.0,
        onEnd: () => setIsPlayingVoiceSample(false),
        onError: () => setIsPlayingVoiceSample(false),
      });
    }
  };

  // Paso 5: Alarma Serena y Progresiva (Hora + Días + Perfil Sonoro + Resumen Hablado)
  const [alarmTime, setAlarmTime] = useState<string>('07:30');
  const [alarmDays, setAlarmDays] = useState<string[]>(['L', 'M', 'X', 'J', 'V']);
  const [alarmProfile, setAlarmProfile] = useState<'progressive' | 'zen' | 'bioacoustic'>('progressive');
  const [spokenSamplePlaying, setSpokenSamplePlaying] = useState<boolean>(false);
  const [alarmSoundPlaying, setAlarmSoundPlaying] = useState<boolean>(false);

  // Reproducir muestra acústica de la melodía de despertar
  const handleToggleAlarmSound = (profileType: 'progressive' | 'zen' | 'bioacoustic') => {
    if (alarmSoundPlaying) {
      localAudio.stop();
      setAlarmSoundPlaying(false);
    } else {
      if (spokenSamplePlaying) {
        localAudio.stop();
        setSpokenSamplePlaying(false);
      }
      setAlarmSoundPlaying(true);
      localAudio.playWakeupSample(profileType, () => setAlarmSoundPlaying(false));
    }
  };

  // Reproducir resumen hablado de alarma
  const handleToggleAlarmSummary = () => {
    if (spokenSamplePlaying) {
      localAudio.stop();
      setSpokenSamplePlaying(false);
    } else {
      if (alarmSoundPlaying) {
        localAudio.stop();
        setAlarmSoundPlaying(false);
      }
      setSpokenSamplePlaying(true);
      localAudio.speak(spokenAlarmSummary, {
        voiceId: selectedVoice,
        rate: 0.95,
        pitch: 1.0,
        onEnd: () => setSpokenSamplePlaying(false),
        onError: () => setSpokenSamplePlaying(false),
      });
    }
  };

  // Paso 6: Música
  const [selectedMusicFolder, setSelectedMusicFolder] = useState<string>('/Music/Veya (FLAC/WAV)');

  // Paso 7: Noticias RSS
  const [rssFeeds, setRssFeeds] = useState<{ id: string; name: string; checked: boolean }[]>([
    { id: 'tech', name: 'Tecnología y Privacidad (Ars / EFF)', checked: true },
    { id: 'culture', name: 'Cultura, Libros y Filosofía', checked: true },
    { id: 'science', name: 'Ciencia y Medioambiente (Nature / CSIC)', checked: false },
    { id: 'local', name: 'Actualidad Local Sin Clickbait', checked: true },
  ]);

  const daysList = [
    { id: 'L', label: 'L', fullName: 'lunes' },
    { id: 'M', label: 'M', fullName: 'martes' },
    { id: 'X', label: 'X', fullName: 'miércoles' },
    { id: 'J', label: 'J', fullName: 'jueves' },
    { id: 'V', label: 'V', fullName: 'viernes' },
    { id: 'S', label: 'S', fullName: 'sábados' },
    { id: 'D', label: 'D', fullName: 'domingos' },
  ];

  const toggleDay = (d: string) => {
    if (alarmDays.includes(d)) {
      if (alarmDays.length > 1) {
        setAlarmDays(alarmDays.filter((item) => item !== d));
      }
    } else {
      setAlarmDays([...alarmDays, d]);
    }
  };

  const dayOrder = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const getDaysSummary = () => {
    if (alarmDays.length === 7) return 'todos los días';
    if (
      alarmDays.length === 5 &&
      ['L', 'M', 'X', 'J', 'V'].every((d) => alarmDays.includes(d)) &&
      !alarmDays.includes('S') &&
      !alarmDays.includes('D')
    ) {
      return 'de lunes a viernes';
    }
    if (
      alarmDays.length === 2 &&
      alarmDays.includes('S') &&
      alarmDays.includes('D')
    ) {
      return 'los fines de semana';
    }

    // Ordenar los días cronológicamente según la semana
    const sortedDays = [...alarmDays].sort(
      (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
    );

    // Mapear al nombre completo en español (lunes, martes, etc.)
    const fullNames = sortedDays.map((d) => {
      const match = daysList.find((item) => item.id === d);
      return match ? match.fullName : d;
    });

    if (fullNames.length === 1) {
      return `los ${fullNames[0]}`;
    }

    if (fullNames.length === 2) {
      return `los ${fullNames[0]} y ${fullNames[1]}`;
    }

    const last = fullNames[fullNames.length - 1];
    const initial = fullNames.slice(0, -1).join(', ');
    return `los ${initial} y ${last}`;
  };

  const getProfileDescription = () => {
    switch (alarmProfile) {
      case 'zen':
        return 'despertar armónico a 432 Hz y cuencos tibetanos';
      case 'bioacoustic':
        return 'despertar bioacústico con lluvia suave en bosque de hayas';
      case 'progressive':
      default:
        return 'despertar progresivo en piano acústico y luz gradual';
    }
  };

  const spokenAlarmSummary = `Alarma programada a las ${alarmTime} ${getDaysSummary()} con ${getProfileDescription()}.`;

  // Info canónica de los 8 pasos
  const stepsInfo: OnboardingStep[] = [
    { step: 1, title: 'Bienvenida y Privacidad', subtitle: 'Tu asistente privado y local, sin servidores ni rastreo', isOptional: false },
    { step: 2, title: 'Tu Compañero', subtitle: 'Nombres y trato personal', isOptional: false },
    { step: 3, title: 'Voz y Estilo', subtitle: 'Selecciona cómo se comunica VEYA contigo', isOptional: false },
    { step: 4, title: 'Apariencia y Accesibilidad', subtitle: 'Tema visual y opciones de movimiento', isOptional: false },
    { step: 5, title: 'Alarma y Rutina Matinal', subtitle: 'Hora, días y resumen hablado del despertar', isOptional: false },
    { step: 6, title: 'Música Local', subtitle: 'Selección de carpetas de audio en tu móvil', isOptional: true },
    { step: 7, title: 'Medios de Noticias', subtitle: 'Fuentes RSS limpias de tu interés', isOptional: true },
    { step: 8, title: 'Resumen y Checklist', subtitle: 'Todo listo para comenzar tu experiencia', isOptional: false },
  ];

  const curr = stepsInfo[currentStep - 1];

  // Mapeo dinámico y coherente del Avatar según el paso (animación, estado y mood)
  const getAvatarConfig = (): {
    state: AvatarState;
    mood: AvatarMood;
    message: string;
    motionNote?: string;
    accessibilityDescription: string;
  } => {
    switch (currentStep) {
      case 1:
        // Bienvenida cálida y presentación local-first
        return {
          state: 'speaking',
          mood: 'cercano',
          message: 'Hola. Soy VEYA. Todo lo que hablemos se queda en tu dispositivo, sin cuentas ni nube.',
          motionNote: 'Presentación cercana y acogedora',
          accessibilityDescription:
            'Avatar VEYA en estado de habla con expresión cercana y afectuosa. Su mirada es frontal y directa, transmitiendo confianza y bienvenida segura sin servidores externos.',
        };
      case 2:
        // Escucha atenta y empática al personalizar nombre y trato
        return {
          state: 'listening',
          mood: 'empatico',
          message: `Es un placer acompañarte, ${localUserName || 'amigo'}. ¿Cómo prefieres que nos tratemos?`,
          motionNote: 'Atención empática y receptiva',
          accessibilityDescription:
            'Avatar VEYA en estado de escucha activa y ánimo empático. Su mirada atiende con calidez la escritura de tu nombre y el estilo de trato elegido.',
        };
      case 3:
        // Demostración vocal activa o reposo sonoro
        return {
          state: isPlayingVoiceSample ? 'speaking' : 'idle',
          mood: 'animado',
          message: isPlayingVoiceSample
            ? `Reproduciendo muestra con la voz ${selectedVoice === 'voice_aura' ? 'Aura' : selectedVoice === 'voice_brisa' ? 'Brisa' : 'Eco'}...`
            : 'Mi voz se sintetiza aquí mismo en tu teléfono. Elige la calidez que más te inspire paz.',
          motionNote: 'Entusiasmo sonoro local',
          accessibilityDescription: isPlayingVoiceSample
            ? 'Avatar VEYA modulando su voz con expresión alegre y viva mientras reproduce la muestra sonora local.'
            : 'Avatar VEYA en reposo atento y alegre, listo para que elijas su textura vocal y calidez.',
        };
      case 4:
        // Apariencia y Accesibilidad: Sereno, neutro y reposado para evaluar contraste
        return {
          state: 'idle',
          mood: 'sereno',
          message: reducedMotion
            ? 'Modo movimiento reducido activo: animaciones elásticas pausadas en reposo estático.'
            : 'Puedes adaptar el contraste y pausar mis movimientos si prefieres máxima tranquilidad visual.',
          motionNote: 'Sosiego visual y confort ocular',
          accessibilityDescription: reducedMotion
            ? 'Avatar VEYA en reposo absoluto sin oscilaciones ni parpadeo elástico, adaptado para máxima comodidad ocular y sin fatiga visual.'
            : 'Avatar VEYA en reposo sereno y respiración pausada, diseñado para evaluar con comodidad el contraste y el tema visual.',
        };
      case 5:
        // Alarma y rutina matinal: Concentrado en la precisión horaria o locución del resumen
        return {
          state: spokenSamplePlaying ? 'speaking' : alarmSoundPlaying ? 'listening' : 'thinking',
          mood: 'concentrado',
          message: spokenSamplePlaying
            ? `«${spokenAlarmSummary}»`
            : alarmSoundPlaying
            ? 'Reproduciendo melodía de despertar sereno en volumen ascendente...'
            : 'Despertar bien es fundamental. Elige la hora y tu curva de calma matinal.',
          motionNote: 'Enfoque reflexivo y orden matinal',
          accessibilityDescription: spokenSamplePlaying
            ? 'Avatar VEYA hablando pausadamente para verbalizar el resumen completo de tu alarma y días activos.'
            : alarmSoundPlaying
            ? 'Avatar VEYA escuchando en calma armónica la melodía progresiva de despertar sin sobresaltos.'
            : 'Avatar VEYA en estado reflexivo y concentración tranquila, sincronizando la hora y la curva sonora del despertar.',
        };
      case 6:
        // Música local: Animado con el ritmo y la alta fidelidad local
        return {
          state: 'speaking',
          mood: 'animado',
          message: 'Tu biblioteca local suena con máxima fidelidad sin consumir tu tarifa de datos.',
          motionNote: 'Afinidad armónica y musical',
          accessibilityDescription:
            'Avatar VEYA con ánimo animado y pulso rítmico sutil, celebrando la reproducción bit-perfect de tu música local.',
        };
      case 7:
        // Noticias RSS: Sereno, equilibrado y libre de ruidos algorítmicos
        return {
          state: 'idle',
          mood: 'sereno',
          message: 'Noticias sin algoritmos que busquen robarte la atención. Información limpia a tu ritmo.',
          motionNote: 'Claridad informativa y serenidad',
          accessibilityDescription:
            'Avatar VEYA en calma serena y mirada descansada, libre de distracciones y listo para filtrar noticias limpias.',
        };
      case 8:
      default:
        // Resumen final y celebración de bienvenida
        return {
          state: 'speaking',
          mood: 'cercano',
          message: '¡Tu espacio está preparado! Aquí tienes tu lista de inicio para acceder a Ajustes cuando gustes.',
          motionNote: 'Celebración y bienvenida completada',
          accessibilityDescription:
            'Avatar VEYA radiante y sonriente con expresión cercana, festejando la finalización del espacio privado y seguro.',
        };
    }
  };

  const avatarConfig = getAvatarConfig();

  const handleNext = () => {
    localAudio.stop();
    setIsPlayingVoiceSample(false);
    setSpokenSamplePlaying(false);
    setAlarmSoundPlaying(false);

    // Sincronizar datos con el contexto global
    if (currentStep === 2) {
      setUserName(localUserName);
      setAssistantName(localAssistantName);
      setPronounTreatment(localPronoun);
    }
    if (currentStep === 3) {
      setSelectedVoiceId(selectedVoice);
    }

    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    localAudio.stop();
    setIsPlayingVoiceSample(false);
    setSpokenSamplePlaying(false);
    setAlarmSoundPlaying(false);

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7FAFC] dark:bg-[#101418] text-slate-800 dark:text-slate-100 overflow-hidden font-['Nunito_Sans']">
      {/* CAPA DE ACCESIBILIDAD PARA TALKBACK / SCREEN READERS (ARIA LIVE REGIONS) */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
        id="veya-a11y-announcer"
      >
        {`Paso ${currentStep} de 8: ${curr.title}. ${curr.subtitle}. ${avatarConfig.accessibilityDescription}. Guía: ${avatarConfig.message}`}
      </div>

      {/* 1. BARRA SUPERIOR M3 CON PROGRESO Y REANUDABILIDAD */}
      <nav
        aria-label="Progreso de configuración de VEYA"
        className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#12181F]/95 backdrop-blur-md flex items-center justify-between shrink-0 shadow-xs z-20"
      >
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="p-2 -ml-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-20 disabled:hover:text-slate-500 rounded-full transition-colors focus:ring-2 focus:ring-[#155E95] focus:outline-none"
          title="Paso anterior"
          aria-label={`Volver al paso anterior. Actualmente en paso ${currentStep} de 8.`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5" aria-current="step">
            <span className="text-xs font-black text-[#155E95] dark:text-[#8ECEFF]">
              Paso {currentStep} de 8
            </span>
            <span className="text-[10px] text-slate-400">· {curr.title}</span>
          </div>

          {/* Segmented Progress Bar Accesible */}
          <div
            className="flex gap-1 mt-1.5"
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={8}
            aria-label={`Progreso del onboarding: Paso ${currentStep} de 8 completado`}
          >
            {stepsInfo.map((s) => (
              <div
                key={s.step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.step === currentStep
                    ? 'w-6 bg-[#155E95] dark:bg-[#8ECEFF]'
                    : s.step < currentStep
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={onFinish}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg focus:ring-2 focus:ring-[#155E95] focus:outline-none"
          aria-label="Salir de la configuración inicial y entrar directamente a la aplicación"
        >
          Salir
        </button>
      </nav>

      {/* 2. CUERPO DEL PASO CON EL AVATAR COMO GUÍA NARRADORA */}
      <main className="flex-1 overflow-y-auto px-4 py-3 flex flex-col items-center justify-between space-y-4">
        <div className="w-full max-w-sm flex flex-col items-center text-center space-y-3 my-auto">
          {/* AVATAR VOLUMÉTRICO CON SU ESTADO/MOOD ESPECÍFICO */}
          <section
            aria-label="Estado emocional del avatar asistente"
            className="relative group my-1 flex flex-col items-center"
          >
            {/* Contenedor del Avatar con soporte de variante estática y de movimiento reducido */}
            <div
              tabIndex={0}
              role="img"
              aria-label={avatarConfig.accessibilityDescription}
              className={`relative rounded-full transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                reducedMotion
                  ? 'transform-none ring-2 ring-slate-200/60 dark:ring-slate-800'
                  : 'hover:scale-105'
              }`}
            >
              <AvatarVisual
                state={avatarConfig.state}
                mood={avatarConfig.mood}
                size={110}
                reducedMotion={reducedMotion}
                amplitude={reducedMotion ? 0.0 : 0.6}
                interactiveGaze={!reducedMotion}
                enableBlinking={!reducedMotion}
                enableTapSquish={!reducedMotion}
                showStatusLabel={false}
              />

              {/* Indicador sutil de accesibilidad / movimiento reducido activo */}
              {reducedMotion && (
                <div
                  className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-800/90 text-slate-200 shadow-xs border border-slate-700/80"
                  title="Movimiento reducido activo: estado estático sin oscilaciones ni deformaciones elásticas"
                  aria-hidden="true"
                >
                  <Eye className="w-3 h-3 text-sky-400" />
                </div>
              )}
            </div>

            {/* Globo de microcopy cálido */}
            <div
              aria-live="polite"
              className={`mt-2 px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-[#151D27]/95 border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-xs transition-opacity duration-300 ${reducedMotion ? 'transition-none' : ''}`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#155E95] dark:bg-[#8ECEFF]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {avatarConfig.motionNote}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200 italic leading-snug">
                "{avatarConfig.message}"
              </p>
            </div>
          </section>

          {/* TÍTULO Y SUBTÍTULO DEL PASO */}
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
              {curr.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {curr.subtitle}
            </p>
          </div>

          {/* ================================================================= */}
          {/* PASO 1: BIENVENIDA Y PRIVACIDAD                                   */}
          {/* ================================================================= */}
          {currentStep === 1 && (
            <div className="w-full bg-white dark:bg-[#141A24] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-left shadow-xs animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Arquitectura Local-First
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tus conversaciones, alarmas y archivos se quedan en el chip de tu móvil con Android Keystore AES-256.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#7654A7] dark:text-[#DCB8FF] shrink-0 mt-0.5">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Cero Rastreo ni Nube Obligatoria
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Sin cuentas forzadas, sin anuncios y sin vender tu telemetría a terceros.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 2: TU COMPAÑERO (NOMBRES Y TRATO)                            */}
          {/* ================================================================= */}
          {currentStep === 2 && (
            <div className="w-full bg-white dark:bg-[#141A24] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-left shadow-xs animate-in fade-in">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  ¿Cómo quieres que te llame?
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={localUserName}
                    onChange={(e) => setLocalUserName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Nombre del asistente
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 absolute left-3 top-3 text-[#155E95] dark:text-[#8ECEFF]" />
                  <input
                    type="text"
                    value={localAssistantName}
                    onChange={(e) => setLocalAssistantName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                    placeholder="VEYA"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Trato personal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLocalPronoun('tu')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      localPronoun === 'tu'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-[#155E95] text-[#155E95] dark:text-[#8ECEFF]'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Tú (Cercano)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalPronoun('usted')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      localPronoun === 'usted'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-[#155E95] text-[#155E95] dark:text-[#8ECEFF]'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Usted (Formal)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 3: VOZ Y ESTILO                                              */}
          {/* ================================================================= */}
          {currentStep === 3 && (
            <div className="w-full bg-white dark:bg-[#141A24] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-left shadow-xs animate-in fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Selecciona la voz en dispositivo
              </span>

              {[
                { id: 'voice_aura', name: 'Aura', desc: 'Cálida, pausada y empática (Español Neutro)', color: 'text-purple-600' },
                { id: 'voice_brisa', name: 'Brisa', desc: 'Clara, fresca y dinámica', color: 'text-sky-600' },
                { id: 'voice_eco', name: 'Eco', desc: 'Profunda, reflexiva y sobria', color: 'text-indigo-600' },
              ].map((v) => {
                const isSelected = selectedVoice === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-500 text-purple-900 dark:text-purple-200 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Volume2 className={`w-3.5 h-3.5 ${v.color}`} />
                        <span className="text-xs font-black">{v.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{v.desc}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Escuchar demostración</span>
                <button
                  type="button"
                  onClick={() => handleToggleVoiceSample(selectedVoice)}
                  className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-200 transition-colors"
                >
                  {isPlayingVoiceSample ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingVoiceSample ? 'Pausar' : 'Probar voz'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 4: APARIENCIA Y ACCESIBILIDAD (MOVIMIENTO REDUCIDO)          */}
          {/* ================================================================= */}
          {currentStep === 4 && (
            <div className="w-full bg-white dark:bg-[#141A24] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-left shadow-xs animate-in fade-in">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Tema visual
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'system' as const, label: 'Sistema', icon: <Eye className="w-3.5 h-3.5" /> },
                    { id: 'light' as const, label: 'Claro', icon: <Sun className="w-3.5 h-3.5" /> },
                    { id: 'dark' as const, label: 'Oscuro', icon: <Moon className="w-3.5 h-3.5" /> },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setThemePreference(t.id)}
                      className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                        themePreference === t.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-[#155E95] text-[#155E95] dark:text-[#8ECEFF]'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interruptor para Movimiento Reducido */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>Movimiento Reducido</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Accesibilidad
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Pausa las animaciones elásticas del avatar y usa fundidos suaves
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    reducedMotion ? 'bg-[#155E95]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      reducedMotion ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 5: ALARMA SERENA Y RUTINA MATINAL                            */}
          {/* ================================================================= */}
          {currentStep === 5 && (
            <div className="w-full bg-white dark:bg-[#141A24] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3.5 text-left shadow-xs animate-in fade-in">
              {/* Encabezado de despertar sereno */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-sky-500/10 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-500 text-white shadow-xs">
                    <Sunrise className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 block">
                      Despertar Progresivo Sereno
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Sin estrés cardiaco · Subida suave en 5 min
                    </span>
                  </div>
                </div>
                <input
                  type="time"
                  value={alarmTime}
                  onChange={(e) => setAlarmTime(e.target.value)}
                  aria-label="Hora de la alarma matinal"
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-sm font-extrabold text-[#155E95] dark:text-[#8ECEFF] focus:ring-2 focus:ring-[#155E95] focus:outline-none"
                />
              </div>

              {/* Selector de días de la semana */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Días activos
                </span>
                <div
                  role="group"
                  aria-label="Seleccionar días de la semana activos para la alarma"
                  className="flex justify-between gap-1"
                >
                  {daysList.map((d) => {
                    const isSelected = alarmDays.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDay(d.id)}
                        aria-pressed={isSelected}
                        aria-label={`${d.fullName}, ${isSelected ? 'activo' : 'inactivo'}`}
                        className={`w-9 h-9 rounded-xl text-xs font-black transition-all focus:outline-none focus:ring-2 focus:ring-[#155E95] ${
                          isSelected
                            ? 'bg-[#155E95] text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Curva y Textura Acústica de Despertar */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Curva sonora y ambiente
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'progressive' as const,
                      name: 'Piano Luz',
                      sub: 'Do Mayor suave',
                      icon: <Sunrise className="w-3.5 h-3.5" />,
                    },
                    {
                      id: 'zen' as const,
                      name: 'Armónico 432',
                      sub: 'Cuenco y calma',
                      icon: <Radio className="w-3.5 h-3.5" />,
                    },
                    {
                      id: 'bioacoustic' as const,
                      name: 'Bosque Vivo',
                      sub: 'Lluvia y follaje',
                      icon: <Waves className="w-3.5 h-3.5" />,
                    },
                  ].map((p) => {
                    const isSelected = alarmProfile === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setAlarmProfile(p.id)}
                        aria-pressed={isSelected}
                        aria-label={`Curva de despertar: ${p.name}. ${p.sub}`}
                        className={`p-2 rounded-2xl border text-left flex flex-col justify-between transition-all focus:outline-none focus:ring-2 focus:ring-[#155E95] ${
                          isSelected
                            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}>
                            {p.icon}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                        </div>
                        <div className="mt-1.5">
                          <span className="text-xs font-bold block">{p.name}</span>
                          <span className="text-[9px] text-slate-400 leading-tight block truncate">{p.sub}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Botón para probar la melodía de despertar seleccionada */}
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Escuchar melodía suave</span>
                  <button
                    type="button"
                    onClick={() => handleToggleAlarmSound(alarmProfile)}
                    aria-label={alarmSoundPlaying ? 'Pausar melodía de despertar' : 'Probar melodía de despertar'}
                    className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-200 transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {alarmSoundPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{alarmSoundPlaying ? 'Detener melodía' : 'Probar melodía'}</span>
                  </button>
                </div>
              </div>

              {/* Resumen hablado del despertar con locución completa */}
              <div
                aria-live="polite"
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#155E95] dark:text-[#8ECEFF] text-xs font-bold">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Confirmación hablada</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleAlarmSummary}
                    aria-label={spokenSamplePlaying ? 'Pausar resumen hablado' : 'Escuchar resumen hablado de la alarma'}
                    className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#155E95] dark:text-[#8ECEFF] text-[10px] font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors focus:ring-2 focus:ring-[#155E95] focus:outline-none"
                  >
                    {spokenSamplePlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{spokenSamplePlaying ? 'Pausar locución' : 'Escuchar resumen'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic leading-snug">
                  "{spokenAlarmSummary}"
                </p>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 6: MÚSICA LOCAL                                              */}
          {/* ================================================================= */}
          {currentStep === 6 && (
            <div className="w-full bg-white dark:bg-[#141A24] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-left shadow-xs animate-in fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Directorio de audio en dispositivo
              </span>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <Folder className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF] shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {selectedMusicFolder}
                  </span>
                  <span className="text-[10px] text-slate-400">14 pistas FLAC detectadas (Local / Bit-Perfect)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                VEYA integra el motor DSP de audio local con ecualización de 10 bandas y ReplayGain sin enviar datos de escucha a la red.
              </p>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 7: MEDIOS DE NOTICIAS                                        */}
          {/* ================================================================= */}
          {currentStep === 7 && (
            <div className="w-full bg-white dark:bg-[#141A24] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-left shadow-xs animate-in fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Boletines matinales por RSS
              </span>

              {rssFeeds.map((feed) => (
                <div
                  key={feed.id}
                  onClick={() =>
                    setRssFeeds(
                      rssFeeds.map((f) => (f.id === feed.id ? { ...f, checked: !f.checked } : f))
                    )
                  }
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Rss className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {feed.name}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={feed.checked}
                    readOnly
                    className="w-4 h-4 rounded text-[#155E95] pointer-events-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 8: RESUMEN Y CHECKLIST FINAL (CON ENLACES A AJUSTES)         */}
          {/* ================================================================= */}
          {currentStep === 8 && (
            <div className="w-full bg-white dark:bg-[#141A24] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-left shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-xs font-black">Checklist de Bienvenida y Accesos Rápidos</h4>
              </div>

              <div className="space-y-2">
                {[
                  {
                    title: `Compañero: ${localUserName} (${localPronoun === 'tu' ? 'Tú' : 'Usted'})`,
                    sub: 'Nombre, rol y empatía',
                    sectionId: 'partner',
                  },
                  {
                    title: `Voz: ${selectedVoice === 'voice_aura' ? 'Aura' : selectedVoice === 'voice_brisa' ? 'Brisa' : 'Eco'} (Calidez 75%)`,
                    sub: 'Prosodia, velocidad y timbre',
                    sectionId: 'voice',
                  },
                  {
                    title: 'Inteligencia: Motor Soberano (BYO/Gemini)',
                    sub: 'Proactividad, detalle y memoria efímera',
                    sectionId: 'intelligence',
                  },
                  {
                    title: `Alarma: ${alarmTime} (${getDaysSummary()})`,
                    sub: `${alarmProfile === 'zen' ? 'Armónico 432 Hz' : alarmProfile === 'bioacoustic' ? 'Bosque bioacústico' : 'Piano luz'} · Despertar progresivo`,
                    sectionId: 'alarm',
                  },
                  {
                    title: 'Bóveda Cifrada: 100% en Terminal',
                    sub: 'Zero-Knowledge y sin telemetría',
                    sectionId: 'privacy',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 ml-5">{item.sub}</p>
                    </div>

                    {onNavigateToSettings && (
                      <button
                        onClick={() => onNavigateToSettings(item.sectionId)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#155E95] dark:text-[#8ECEFF] hover:bg-blue-50 dark:hover:bg-blue-950/60 flex items-center gap-1"
                        title="Abrir en Ajustes"
                      >
                        <span>Ajustes</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. BOTONES DE ACCIÓN INFERIOR */}
        <div className="w-full max-w-sm space-y-2 mt-2 shrink-0">
          <button
            onClick={handleNext}
            className="w-full py-3 px-4 rounded-2xl bg-[#155E95] dark:bg-[#8ECEFF] text-white dark:text-[#003355] text-xs font-bold shadow hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>{currentStep === 8 ? 'Comenzar mi experiencia con VEYA' : 'Continuar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {curr.isOptional && (
            <button
              onClick={handleNext}
              className="w-full py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Configurar más tarde
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
