import React, { useState } from 'react';
import { AvatarVisual } from './AvatarVisual';
import { ArrowLeft, ArrowRight, Check, X, Sparkles, Volume2, ShieldCheck, Heart } from 'lucide-react';
import { OnboardingStep } from '../types';

interface ScreenOnboardingProps {
  onFinish: () => void;
}

export const ScreenOnboarding: React.FC<ScreenOnboardingProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assistantName, setAssistantName] = useState('VEYA');
  const [userName, setUserName] = useState('José');
  const [toneStyle, setToneStyle] = useState('Cercano y calmado');

  const stepsInfo: OnboardingStep[] = [
    { step: 1, title: 'Bienvenida y Privacidad', subtitle: 'Tu asistente privado y local, sin servidores ni rastreo', isOptional: false },
    { step: 2, title: 'Tu Compañero', subtitle: 'Nombres y trato personal', isOptional: false },
    { step: 3, title: 'Voz y Estilo', subtitle: 'Selecciona cómo se comunica VEYA contigo', isOptional: false },
    { step: 4, title: 'Apariencia y Accesibilidad', subtitle: 'Tema visual y opciones de movimiento', isOptional: false },
    { step: 5, title: 'Rutina Matinal', subtitle: 'Hora de alarma y pasos del despertar', isOptional: true },
    { step: 6, title: 'Música Local', subtitle: 'Selección de carpetas de audio en tu móvil', isOptional: true },
    { step: 7, title: 'Medios de Noticias', subtitle: 'Fuentes RSS de tu interés', isOptional: true },
    { step: 8, title: 'Memoria y Resumen', subtitle: 'Todo listo para comenzar tu experiencia', isOptional: false },
  ];

  const curr = stepsInfo[currentStep - 1];

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7FAFC] dark:bg-[#101418] text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* Top Progress Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12181F] flex items-center justify-between shrink-0">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="p-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-[#155E95] dark:text-[#8ECEFF]">
            Paso {currentStep} de 8
          </span>
          <div className="flex gap-1 mt-1">
            {stepsInfo.map((s) => (
              <div
                key={s.step}
                className={`h-1.5 rounded-full transition-all ${
                  s.step === currentStep
                    ? 'w-5 bg-[#155E95] dark:bg-[#8ECEFF]'
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
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          Salir
        </button>
      </div>

      {/* Step Body */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-between">
        <div className="w-full flex flex-col items-center text-center max-w-sm space-y-4 my-auto">
          {/* Reactive Avatar in Step 1 & 8 */}
          {(currentStep === 1 || currentStep === 8 || currentStep === 3) && (
            <div className="my-2">
              <AvatarVisual
                state={currentStep === 3 ? 'speaking' : 'idle'}
                mood={currentStep === 8 ? 'animado' : 'sereno'}
                size={120}
              />
            </div>
          )}

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-['Nunito_Sans']">
              {curr.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {curr.subtitle}
            </p>
          </div>

          {/* Step 1 Content */}
          {currentStep === 1 && (
            <div className="w-full bg-white dark:bg-[#12181F] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-left">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">100% Local y Privado</h4>
                  <p className="text-[11px] text-slate-400">Sin streaming a la nube, sin cuentas ni anuncios.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#7654A7] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Diseñado para ti</h4>
                  <p className="text-[11px] text-slate-400">Un asistente con calidez humana y presencia orgánica.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 Content: Names */}
          {currentStep === 2 && (
            <div className="w-full space-y-3 text-left">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">¿Cómo quieres que te llame?</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full mt-1 bg-white dark:bg-[#12181F] border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#155E95]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre del asistente</label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  className="w-full mt-1 bg-white dark:bg-[#12181F] border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#155E95]"
                />
              </div>
            </div>
          )}

          {/* Step 3 Content: Voice style */}
          {currentStep === 3 && (
            <div className="w-full space-y-2 text-left">
              {['Cercano y calmado', 'Conciso y enfocado', 'Amable y animado'].map((t) => (
                <button
                  key={t}
                  onClick={() => setToneStyle(t)}
                  className={`w-full p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                    toneStyle === t
                      ? 'bg-[#D7EEFF] dark:bg-[#004A7B] border-[#155E95] dark:border-[#8ECEFF] text-[#001D33] dark:text-[#D7EEFF]'
                      : 'bg-white dark:bg-[#12181F] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{t}</span>
                  {toneStyle === t && <Check className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />}
                </button>
              ))}
            </div>
          )}

          {/* Generic content for remaining steps */}
          {currentStep > 3 && currentStep < 8 && (
            <div className="w-full p-4 rounded-3xl bg-white dark:bg-[#12181F] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 space-y-2">
              <p>Valores predeterminados configurados para tu comodidad.</p>
              <p className="text-[11px] opacity-75">Podrás modificar este ajuste en cualquier momento desde Ajustes.</p>
            </div>
          )}

          {/* Step 8 Content: Finish */}
          {currentStep === 8 && (
            <div className="w-full p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-left space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">¡Todo configurado con éxito!</h4>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                VEYA ya conoce tu nombre ({userName}), tu tono preferido y tus permisos locales.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-2 mt-4">
          <button
            onClick={handleNext}
            className="w-full py-3 px-4 rounded-2xl bg-[#155E95] dark:bg-[#8ECEFF] text-white dark:text-[#003355] text-xs font-bold shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{currentStep === 8 ? 'Comenzar a usar VEYA' : 'Continuar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {curr.isOptional && (
            <button
              onClick={handleNext}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Configurar más tarde
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
