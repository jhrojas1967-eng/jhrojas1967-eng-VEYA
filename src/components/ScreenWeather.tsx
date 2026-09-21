import React, { useState } from 'react';
import {
  CloudSun,
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Droplets,
  Wind,
  Sun,
  Umbrella,
  FileCode,
  CheckCircle,
  RefreshCw,
  Search,
  CloudRain,
  CloudLightning,
  Cloud,
  Thermometer,
  BellRing,
  RotateCcw,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  Compass,
} from 'lucide-react';

interface ScreenWeatherProps {
  onBack: () => void;
}

interface ForecastDay {
  dayName: string;
  dateStr: string;
  condition: 'sunny' | 'partly_cloudy' | 'rainy' | 'storm' | 'cloudy';
  conditionLabel: string;
  tempMin: number;
  tempMax: number;
  rainProbability: number;
}

const FIVE_DAY_FORECAST: ForecastDay[] = [
  {
    dayName: 'Hoy',
    dateStr: '21 Sep',
    condition: 'sunny',
    conditionLabel: 'Despejado',
    tempMin: 14,
    tempMax: 24,
    rainProbability: 5,
  },
  {
    dayName: 'Mañana',
    dateStr: '22 Sep',
    condition: 'partly_cloudy',
    conditionLabel: 'Intervalos nubosos',
    tempMin: 15,
    tempMax: 23,
    rainProbability: 20,
  },
  {
    dayName: 'Miércoles',
    dateStr: '23 Sep',
    condition: 'rainy',
    conditionLabel: 'Chubascos suaves',
    tempMin: 13,
    tempMax: 18,
    rainProbability: 75,
  },
  {
    dayName: 'Jueves',
    dateStr: '24 Sep',
    condition: 'storm',
    conditionLabel: 'Tormenta aislada',
    tempMin: 12,
    tempMax: 17,
    rainProbability: 85,
  },
  {
    dayName: 'Viernes',
    dateStr: '25 Sep',
    condition: 'cloudy',
    conditionLabel: 'Nublado y fresco',
    tempMin: 11,
    tempMax: 19,
    rainProbability: 30,
  },
];

const PRESET_CITIES = [
  'Madrid (Centro), España',
  'Barcelona, España',
  'Valencia, España',
  'Sevilla, España',
  'Bilbao, España',
  'Santiago de Compostela, España',
];

export const ScreenWeather: React.FC<ScreenWeatherProps> = ({ onBack }) => {
  // 1. Manual Location State (No GPS Tracking)
  const [city, setCity] = useState<string>('Madrid (Centro), España');
  const [showLocationDialog, setShowLocationDialog] = useState<boolean>(false);
  const [citySearchInput, setCitySearchInput] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // 2. Proactive Weather Alerts & Rules
  const [proactiveAlertsEnabled, setProactiveAlertsEnabled] = useState<boolean>(true);
  const [morningRoutineBriefing, setMorningRoutineBriefing] = useState<boolean>(true);
  const [umbrellaRainAlert, setUmbrellaRainAlert] = useState<boolean>(true);
  const [thermalShiftAlert, setThermalShiftAlert] = useState<boolean>(true);

  // UI Interactive States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showClaudeInstructions, setShowClaudeInstructions] = useState<boolean>(false);
  const [showComposeCodeModal, setShowComposeCodeModal] = useState<boolean>(false);
  const [copiedInstructions, setCopiedInstructions] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const handleRefreshWeather = () => {
    setIsRefreshing(true);
    showToast('Actualizando datos meteorológicos (Open-Meteo)...');
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Pronóstico actualizado con éxito');
    }, 900);
  };

  const handleSelectCity = (newCity: string) => {
    setCity(newCity);
    setShowLocationDialog(false);
    showToast(`Ubicación fijada: ${newCity}`);
  };

  const handleResetDefaults = () => {
    setCity('Madrid (Centro), España');
    setProactiveAlertsEnabled(true);
    setMorningRoutineBriefing(true);
    setUmbrellaRainAlert(true);
    setThermalShiftAlert(true);
    showToast('Ajustes meteorológicos restaurados por defecto');
  };

  const copyClaudePrompt = () => {
    const prompt = `Hola Claude, integra la pantalla "Meteorología" en el proyecto Android de VEYA con Jetpack Compose y Material 3:

1. Arquitectura & Módulos:
   - UI: personal.veya.ui.screen.settings.WeatherSettingsScreen.kt
   - ViewModel: personal.veya.ui.screen.settings.WeatherViewModel.kt
   - Repositorio: personal.veya.data.repository.WeatherRepository.kt (Cliente HTTP Ktor/Retrofit hacia Open-Meteo API libre)
   - DataStore: personal.veya.data.preferences.WeatherPreferences.kt

2. Restricción Absoluta de Privacidad (Zero GPS):
   - PROHIBIDO solicitar ACCESS_FINE_LOCATION o ACCESS_COARSE_LOCATION en AndroidManifest.xml.
   - La ubicación se gestiona mediante selección manual de ciudad o geocodificación estática por nombre (Open-Meteo Geocoding API).

3. Componentes Material 3:
   a) Selector de Ubicación Manual:
      - OutlinedCard con nombre de ciudad, botón de edición modal y selector rápido de capitales/municipios.
   b) Tarjeta Hero de Temperatura Actual:
      - Temperatura en displayLarge con sensor de sensación térmica, humedad, viento e índice UV.
   c) Pronóstico de 5 Días:
      - LazyRow / Column con tarjetas M3 que muestran iconos vectoriales (Sun, CloudRain, CloudLightning, etc.), rangos térmicos y % de precipitación.
   d) Avisos Meteorológicos Proactivos:
      - Conmutadores Switch M3 para modular las sugerencias contextuales de VEYA (paraguas si lluvia > 50%, cambios de temperatura > 5°C).

Consulta 'entregas/12_specs_screen_weather_m3_para_claude.md' para el código y guía completa.`;

    navigator.clipboard.writeText(prompt);
    setCopiedInstructions(true);
    showToast('Instrucciones para Claude copiadas al portapapeles');
    setTimeout(() => setCopiedInstructions(false), 2500);
  };

  const renderWeatherIcon = (condition: ForecastDay['condition'], className = 'w-5 h-5') => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${className} text-amber-500`} />;
      case 'partly_cloudy':
        return <CloudSun className={`${className} text-amber-400`} />;
      case 'rainy':
        return <CloudRain className={`${className} text-sky-500`} />;
      case 'storm':
        return <CloudLightning className={`${className} text-indigo-500`} />;
      case 'cloudy':
      default:
        return <Cloud className={`${className} text-slate-400`} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7FAFC] dark:bg-[#101418] overflow-hidden font-['Nunito_Sans']">
      {/* Toast Notification (M3 Snackbar) */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#16202A]/95 dark:bg-[#E0E3E8]/95 text-white dark:text-[#16202A] text-xs font-bold shadow-xl flex items-center gap-2.5 animate-fade-in backdrop-blur-md border border-white/10 dark:border-black/10">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Material 3 TopAppBar */}
      <div className="px-4 py-3 bg-[#FFFFFF] dark:bg-[#12181F] border-b border-[#CBD2D9]/70 dark:border-[#42474E]/60 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] transition-colors active:scale-95"
              title="Volver a Ajustes"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-[#16202A] dark:text-[#E0E3E8] leading-tight">
                  Meteorología
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E0F2FE] dark:bg-[#0369A1]/30 text-[#0284C7] dark:text-[#7DD3FC]">
                  Material 3
                </span>
              </div>
              <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                Previsión meteorológica privada sin rastreo GPS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowClaudeInstructions(!showClaudeInstructions)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                showClaudeInstructions
                  ? 'bg-[#155E95] text-white dark:bg-[#8ECEFF] dark:text-[#003355]'
                  : 'text-[#155E95] dark:text-[#8ECEFF] hover:bg-[#D7EEFF]/60 dark:hover:bg-[#004A7B]/40'
              }`}
              title="Guía de implementación para Claude Code"
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Guía Claude</span>
            </button>
            <button
              onClick={() => setShowComposeCodeModal(true)}
              className="p-2 rounded-xl text-[#0284C7] dark:text-[#7DD3FC] hover:bg-[#E0F2FE]/60 dark:hover:bg-[#0369A1]/30 transition-colors"
              title="Ver código Compose Kotlin"
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefreshWeather}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-[#42474E] dark:text-[#CBD2D9] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] transition-colors"
              title="Actualizar datos ahora"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0284C7]' : ''}`} />
            </button>
            <button
              onClick={handleResetDefaults}
              className="p-2 rounded-xl text-[#42474E] dark:text-[#CBD2D9] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] transition-colors"
              title="Restaurar valores de fábrica"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Scrollable View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">

        {/* INSTRUCCIONES PARA CLAUDE CODE (COLLAPSIBLE BANNER) */}
        {showClaudeInstructions && (
          <div className="p-4 rounded-3xl bg-[#001D33] text-white border border-[#155E95] shadow-lg animate-fade-in space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#155E95] text-white flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#D7EEFF]">
                    Instrucciones para Claude Code (Módulo Meteorología M3)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Pautas de integración con Open-Meteo, cero permisos GPS y avisos en Compose
                  </p>
                </div>
              </div>
              <button
                onClick={copyClaudePrompt}
                className="px-3 py-1.5 rounded-xl bg-[#155E95] hover:bg-[#1E74B3] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {copiedInstructions ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInstructions ? 'Copiado' : 'Copiar Prompt'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] text-slate-200">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#8ECEFF] block">1. Cero GPS en Manifest</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">Sin ACCESS_FINE_LOCATION</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Ubicación manual guardada en DataStore con cifrado.</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#7DD3FC] block">2. API Libre Open-Meteo</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">api.open-meteo.com/v1/forecast</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Sin API keys ni identificadores de hardware.</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block">3. Avisos Proactivos M3</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">WeatherAlertWorker (WorkManager)</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Aviso inteligente de paraguas si probabilidad &gt; 50%.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
              <span>Especificación canónica completa: <code>entregas/12_specs_screen_weather_m3_para_claude.md</code></span>
              <button
                onClick={() => setShowClaudeInstructions(false)}
                className="text-slate-300 hover:text-white font-bold"
              >
                Ocultar
              </button>
            </div>
          </div>
        )}

        {/* ZERO-GPS PRIVACY BADGE */}
        <div className="p-3.5 rounded-3xl bg-[#E0F2FE]/60 dark:bg-[#0369A1]/20 border border-[#0284C7]/30 flex items-start gap-3 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-[#0284C7] dark:text-[#7DD3FC] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-[#0369A1] dark:text-[#7DD3FC]">
              Privacidad de Ubicación Absoluta (Cero GPS)
            </h4>
            <p className="text-[11px] text-[#0C4A6E] dark:text-[#BAE6FD] leading-relaxed">
              VEYA no solicita el permiso de localización continua de Android (GPS). Las consultas al servicio meteorológico se realizan por código de ciudad con la API libre de <strong>Open-Meteo</strong>, sin cookies ni identificador de dispositivo.
            </p>
          </div>
        </div>

        {/* 1. SELECTOR DE UBICACIÓN MANUAL & 2. TEMPERATURA ACTUAL (HERO CARD) */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0284C7] dark:text-[#7DD3FC]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                1. Ubicación Manual y Clima Actual
              </h2>
            </div>
            <button
              onClick={() => {
                setCitySearchInput('');
                setShowLocationDialog(true);
              }}
              className="px-3 py-1 rounded-xl text-xs font-bold text-[#0284C7] dark:text-[#7DD3FC] hover:bg-[#E0F2FE]/60 dark:hover:bg-[#0369A1]/30 transition-colors border border-[#0284C7]/30"
            >
              Cambiar ciudad
            </button>
          </div>

          {/* Current City Display Header */}
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-sm font-black text-[#16202A] dark:text-[#E0E3E8] block">
                {city}
              </span>
              <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9] font-mono">
                Coordenadas fijas en memoria local • Actualizado hace 8 min
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Sin Rastreo
            </span>
          </div>

          {/* 2. VISUALIZACIÓN DE TEMPERATURA ACTUAL (HERO DISPLAY) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#E0F2FE]/70 via-[#FFFFFF] to-[#E0F2FE]/30 dark:from-[#082F49]/40 dark:via-[#12181F] dark:to-[#0369A1]/20 border border-[#0284C7]/20 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-[#16202A] dark:text-[#E0E3E8] font-mono tracking-tight">
                  21°C
                </span>
                <span className="text-xs font-bold text-[#42474E] dark:text-[#CBD2D9] ml-1">
                  Sensación 20°C
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0284C7] dark:text-[#7DD3FC]">
                  Despejado y soleado
                </span>
                <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                  • Mín: 14°C / Máx: 24°C
                </span>
              </div>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-amber-100/60 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shadow-xs shrink-0">
              <Sun className="w-10 h-10 animate-spin-slow" />
            </div>
          </div>

          {/* Atmosphere Metrics Row (Humidity, Wind, UV Index) */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-[#F7FAFC] dark:bg-[#16202A] border border-[#CBD2D9]/60 dark:border-[#42474E]/60">
              <Droplets className="w-4 h-4 text-sky-500 mx-auto mb-1" />
              <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9] block">Humedad</span>
              <span className="text-xs font-black text-[#16202A] dark:text-[#E0E3E8]">48%</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#F7FAFC] dark:bg-[#16202A] border border-[#CBD2D9]/60 dark:border-[#42474E]/60">
              <Wind className="w-4 h-4 text-teal-500 mx-auto mb-1" />
              <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9] block">Viento</span>
              <span className="text-xs font-black text-[#16202A] dark:text-[#E0E3E8]">14 km/h</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#F7FAFC] dark:bg-[#16202A] border border-[#CBD2D9]/60 dark:border-[#42474E]/60">
              <Umbrella className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
              <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9] block">Índice UV</span>
              <span className="text-xs font-black text-[#16202A] dark:text-[#E0E3E8]">3 (Moderado)</span>
            </div>
          </div>
        </div>

        {/* 3. PRONÓSTICO DE 5 DÍAS CON ICONOS M3 */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-[#0284C7] dark:text-[#7DD3FC]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                2. Pronóstico de 5 Días (Iconos Material 3)
              </h2>
            </div>
            <span className="text-[10px] font-bold text-[#42474E] dark:text-[#CBD2D9] font-mono">Open-Meteo Synced</span>
          </div>

          <div className="space-y-2">
            {FIVE_DAY_FORECAST.map((day, idx) => (
              <div
                key={day.dayName}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  idx === 0
                    ? 'bg-[#E0F2FE]/40 dark:bg-[#0369A1]/20 border-[#0284C7]/40 ring-1 ring-[#0284C7]/20'
                    : 'bg-[#F7FAFC] dark:bg-[#16202A] border-[#CBD2D9]/60 dark:border-[#42474E]/60'
                }`}
              >
                {/* Day Name & Date */}
                <div className="w-24 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#16202A] dark:text-[#E0E3E8]">
                      {day.dayName}
                    </span>
                    {idx === 0 && (
                      <span className="px-1.5 py-0.2 rounded-md bg-[#0284C7] text-white text-[9px] font-bold">
                        Hoy
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                    {day.dateStr}
                  </span>
                </div>

                {/* Weather Condition Icon & Label */}
                <div className="flex items-center gap-2 flex-1 justify-center sm:justify-start">
                  <div className="w-7 h-7 rounded-xl bg-white dark:bg-[#12181F] flex items-center justify-center shrink-0 border border-[#CBD2D9]/40 dark:border-[#42474E]/40 shadow-2xs">
                    {renderWeatherIcon(day.condition)}
                  </div>
                  <span className="text-[11px] font-bold text-[#16202A] dark:text-[#E0E3E8] hidden sm:inline">
                    {day.conditionLabel}
                  </span>
                </div>

                {/* Precipitation Chance */}
                <div className="flex items-center gap-1 text-[11px] font-mono shrink-0 w-14 justify-end">
                  <Droplets className={`w-3 h-3 ${day.rainProbability > 50 ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className={day.rainProbability > 50 ? 'font-bold text-sky-700 dark:text-sky-300' : 'text-[#42474E] dark:text-[#CBD2D9]'}>
                    {day.rainProbability}%
                  </span>
                </div>

                {/* Thermal Range (Min - Max) */}
                <div className="flex items-center gap-1 text-xs font-mono shrink-0 w-20 justify-end">
                  <span className="text-[#42474E] dark:text-[#CBD2D9]">{day.tempMin}°</span>
                  <div className="w-8 h-1.5 rounded-full bg-[#DEE3EA] dark:bg-[#42474E] overflow-hidden flex">
                    <div
                      style={{ width: `${Math.min(100, Math.max(20, (day.tempMax - day.tempMin) * 10))}%` }}
                      className="bg-gradient-to-r from-sky-400 to-amber-500 rounded-full h-full"
                    />
                  </div>
                  <span className="font-bold text-[#16202A] dark:text-[#E0E3E8]">{day.tempMax}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. TOGGLES DE AVISOS METEOROLÓGICOS PROACTIVOS */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-[#0284C7] dark:text-[#7DD3FC]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                3. Avisos Meteorológicos Proactivos de VEYA
              </h2>
            </div>
            <span className="text-[10px] font-bold text-[#0284C7] dark:text-[#7DD3FC] font-mono">Contextual</span>
          </div>

          {/* Master Toggle: Proactive Weather Alerts */}
          <div className="p-3.5 rounded-2xl bg-[#E0F2FE]/40 dark:bg-[#0369A1]/20 border border-[#0284C7]/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#0284C7] dark:text-[#7DD3FC]" />
                <span className="text-xs font-extrabold text-[#16202A] dark:text-[#E0E3E8]">
                  Activar Sugerencias Meteorológicas Proactivas
                </span>
              </div>
              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                Permite a VEYA anticiparse con avisos discretos en tus rutinas sin ser invasiva.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={proactiveAlertsEnabled}
                onChange={(e) => {
                  setProactiveAlertsEnabled(e.target.checked);
                  showToast(
                    e.target.checked
                      ? 'Avisos proactivos meteorológicos activados'
                      : 'Avisos proactivos desactivados'
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#DEE3EA] peer-focus:outline-none rounded-full peer dark:bg-[#16202A] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD2D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7]"></div>
            </label>
          </div>

          {/* Sub-toggle 1: Resumen en el Saludo Matinal */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-bold text-[#16202A] dark:text-[#E0E3E8] text-xs">
                Previsión en el saludo matinal
              </span>
              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                VEYA te informa de la temperatura esperada al descartar la alarma.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                disabled={!proactiveAlertsEnabled}
                checked={morningRoutineBriefing}
                onChange={(e) => {
                  setMorningRoutineBriefing(e.target.checked);
                  showToast(e.target.checked ? 'Saludo matinal meteorológico activado' : 'Saludo matinal desactivado');
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#DEE3EA] peer-focus:outline-none rounded-full peer dark:bg-[#16202A] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD2D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7] peer-disabled:opacity-40"></div>
            </label>
          </div>

          {/* Sub-toggle 2: Alerta de Paraguas (Lluvia > 50%) */}
          <div className="flex items-center justify-between pt-3 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
            <div>
              <span className="font-bold text-[#16202A] dark:text-[#E0E3E8] text-xs">
                Aviso de paraguas por lluvia inminente
              </span>
              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                Notificación contextual antes de salir si la probabilidad supera el 50%.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                disabled={!proactiveAlertsEnabled}
                checked={umbrellaRainAlert}
                onChange={(e) => {
                  setUmbrellaRainAlert(e.target.checked);
                  showToast(e.target.checked ? 'Aviso de paraguas activado' : 'Aviso de paraguas desactivado');
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#DEE3EA] peer-focus:outline-none rounded-full peer dark:bg-[#16202A] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD2D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7] peer-disabled:opacity-40"></div>
            </label>
          </div>

          {/* Sub-toggle 3: Aviso de Cambios Bruscos Térmicos */}
          <div className="flex items-center justify-between pt-3 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
            <div>
              <span className="font-bold text-[#16202A] dark:text-[#E0E3E8] text-xs">
                Aviso de cambios térmicos bruscos (&gt; 5°C)
              </span>
              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                Alerta de abrigo si la oscilación entre máxima y mínima es abrupta.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                disabled={!proactiveAlertsEnabled}
                checked={thermalShiftAlert}
                onChange={(e) => {
                  setThermalShiftAlert(e.target.checked);
                  showToast(e.target.checked ? 'Aviso de oscilación térmica activado' : 'Aviso desactivado');
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#DEE3EA] peer-focus:outline-none rounded-full peer dark:bg-[#16202A] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD2D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7] peer-disabled:opacity-40"></div>
            </label>
          </div>
        </div>
      </div>

      {/* MODAL: MANUAL LOCATION SELECTION DIALOG (MATERIAL 3) */}
      {showLocationDialog && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FFFFFF] dark:bg-[#12181F] rounded-3xl p-5 w-full max-w-md border border-[#CBD2D9] dark:border-[#42474E] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0284C7] dark:text-[#7DD3FC]" />
                <h3 className="text-sm font-extrabold text-[#16202A] dark:text-[#E0E3E8]">
                  Fijar Ubicación Manual (Sin GPS)
                </h3>
              </div>
              <button
                onClick={() => setShowLocationDialog(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#42474E] hover:text-[#16202A] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A]"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9] leading-relaxed">
              Introduce tu ciudad o selecciona una de las opciones frecuentes. No se requerirán coordenadas precisas ni acceso a tus sensores de posicionamiento.
            </p>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#42474E] dark:text-[#CBD2D9] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar ciudad o municipio..."
                value={citySearchInput}
                onChange={(e) => setCitySearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && citySearchInput.trim()) {
                    handleSelectCity(citySearchInput.trim());
                  }
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#F7FAFC] dark:bg-[#16202A] border border-[#CBD2D9] dark:border-[#42474E] text-xs text-[#16202A] dark:text-[#E0E3E8] focus:outline-hidden focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            {/* Preset City Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#42474E] dark:text-[#CBD2D9] uppercase tracking-wider block">
                Ciudades frecuentes:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                {PRESET_CITIES.filter((c) =>
                  c.toLowerCase().includes(citySearchInput.toLowerCase())
                ).map((presetCity) => (
                  <button
                    key={presetCity}
                    type="button"
                    onClick={() => handleSelectCity(presetCity)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F7FAFC] dark:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] border border-[#CBD2D9]/70 dark:border-[#42474E]/70 hover:bg-[#E0F2FE] dark:hover:bg-[#0369A1]/30 transition-colors text-left"
                  >
                    {presetCity}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
              <button
                type="button"
                onClick={() => setShowLocationDialog(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#DEE3EA]/70 dark:bg-[#16202A] text-xs font-bold text-[#16202A] dark:text-[#E0E3E8] hover:bg-[#DEE3EA]"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!citySearchInput.trim()}
                onClick={() => handleSelectCity(citySearchInput.trim())}
                className="flex-1 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs disabled:opacity-40"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: JETPACK COMPOSE M3 SPECIFICATION FOR CLAUDE */}
      {showComposeCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] dark:bg-[#12181F] rounded-3xl p-5 w-full max-w-2xl border border-[#CBD2D9] dark:border-[#42474E] shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] dark:bg-[#0369A1] dark:text-[#7DD3FC] flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#16202A] dark:text-[#E0E3E8]">
                    Meteorología: Especificación Jetpack Compose M3
                  </h3>
                  <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                    Open-Meteo Client sin GPS + Pronóstico de 5 Días y Toggles
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#42474E] hover:text-[#16202A] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#101418] text-[#E0E3E8] font-mono text-[11px] leading-relaxed space-y-2 border border-[#42474E]">
              <div className="flex justify-between items-center pb-2 border-b border-[#42474E]">
                <span className="text-[#7DD3FC] font-bold">WeatherSettingsScreen.kt</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `// WeatherSettingsScreen.kt - Jetpack Compose Material 3 implementation
@Composable
fun WeatherSettingsScreen(
    onNavigateBack: () -> Unit,
    viewModel: WeatherViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Meteorología") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding).padding(16.dp)) {
            // 1. Selector de Ubicación Manual (Zero GPS)
            item { LocationManualCard(city = state.city, onEditCity = viewModel::openLocationDialog) }
            // 2. Temperatura Actual
            item { CurrentWeatherHeroCard(weather = state.currentWeather) }
            // 3. Pronóstico de 5 días
            items(state.forecastDays) { day ->
                ForecastRow(day = day)
            }
            // 4. Toggle Avisos Proactivos
            item {
                Switch(checked = state.proactiveAlerts, onCheckedChange = viewModel::setProactiveAlerts)
            }
        }
    }
}`
                    );
                    showToast('Código Compose copiado al portapapeles');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#16202A] hover:bg-[#232F3D] text-xs text-[#7DD3FC] flex items-center gap-1 border border-[#42474E]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar Composable</span>
                </button>
              </div>
              <p className="text-slate-500">// Arquitectura Jetpack Compose con Open-Meteo y cero permisos de localización</p>
              <p className="text-purple-400">@Composable</p>
              <p className="text-yellow-300">fun WeatherSettingsScreen(</p>
              <p className="text-slate-300 pl-4">onNavigateBack: () -&gt; Unit,</p>
              <p className="text-slate-300 pl-4">viewModel: WeatherViewModel = hiltViewModel()</p>
              <p className="text-yellow-300">) &#123;</p>
              <p className="text-slate-400 pl-4">// 1. Selector de Ciudad Manual</p>
              <p className="text-slate-300 pl-4">ManualLocationCard(city = state.cityName, onSearch = &#123; ... &#125;)</p>
              <br />
              <p className="text-slate-400 pl-4">// 2. Hero Card Temperatura Actual</p>
              <p className="text-slate-300 pl-4">CurrentWeatherCard(temp = "21°C", condition = "Despejado")</p>
              <br />
              <p className="text-slate-400 pl-4">// 3. Pronóstico de 5 Días</p>
              <p className="text-slate-300 pl-4">ForecastList(days = state.fiveDayForecast)</p>
              <br />
              <p className="text-slate-400 pl-4">// 4. Toggles Avisos Proactivos M3</p>
              <p className="text-slate-300 pl-4">Switch(checked = state.proactiveAlerts, onCheckedChange = &#123; ... &#125;)</p>
              <p className="text-slate-300 pl-4">Switch(checked = state.umbrellaAlert, onCheckedChange = &#123; ... &#125;)</p>
              <p className="text-yellow-300">&#125;</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                Ver documento: <code className="font-mono text-[#0284C7] dark:text-[#7DD3FC]">entregas/12_specs_screen_weather_m3_para_claude.md</code>
              </span>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="py-2 px-4 rounded-xl bg-[#DEE3EA]/70 dark:bg-[#16202A] text-xs font-bold text-[#16202A] dark:text-[#E0E3E8] hover:bg-[#DEE3EA]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
