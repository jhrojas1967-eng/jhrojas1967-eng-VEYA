import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  MemoriaFact,
  PurgeScheduleOption,
  StructuredVaultStorage,
  PronounTreatment,
  CompanionRole,
  UserPartnerProfile,
  VoicePersonalityProfile,
  ChatMessage,
  AvatarMood,
  CustomCategoryDef,
} from '../types';
import { INITIAL_FACTS } from '../data/initialFacts';

const VAULT_STORAGE_KEY = 'veya_local_vault_facts_v2';
const PARTNER_STORAGE_KEY = 'veya_user_partner_profile_v1';
const VOICE_STORAGE_KEY = 'veya_voice_profile_v1';
const CHAT_STORAGE_KEY = 'veya_chat_messages_v1';
const CUSTOM_CATEGORIES_STORAGE_KEY = 'veya_vault_custom_categories_v1';

export interface VeyaGlobalContextType {
  // Partner Profile
  partnerProfile: UserPartnerProfile;
  setUserName: (name: string) => void;
  setAssistantName: (name: string) => void;
  setPronounTreatment: (treatment: PronounTreatment) => void;
  setCompanionRole: (role: CompanionRole) => void;
  setDetectFatigue: (enabled: boolean) => void;
  setNonInvasiveMode: (enabled: boolean) => void;
  updatePartnerProfile: (partial: Partial<UserPartnerProfile>) => void;

  // Voice & Personality
  voiceProfile: VoicePersonalityProfile;
  setSelectedVoiceId: (id: string) => void;
  setSpeechSpeed: (speed: number) => void;
  setPitch: (pitch: number) => void;
  setNaturalPauses: (enabled: boolean) => void;
  setWarmth: (val: number) => void;
  setConciseness: (val: number) => void;
  setProactivity: (val: number) => void;
  resetVoiceDefaults: () => void;
  applyTemperamentPreset: (preset: 'zen' | 'mentor' | 'friend') => void;

  // Vault & Local-First Memory
  facts: MemoriaFact[];
  activeInContextFacts: MemoriaFact[];
  isEncrypted: boolean;
  purgeSchedule: PurgeScheduleOption;
  preserveExplicitFacts: boolean;
  toggleFactContext: (id: string, explicitValue?: boolean) => void;
  confirmFact: (id: string) => void;
  updateFact: (fact: MemoriaFact) => void;
  deleteFact: (id: string) => void;
  addFact: (fact: Omit<MemoriaFact, 'id' | 'sha256Hash'>) => MemoriaFact;
  purgeAllFacts: () => void;
  restoreInitialFacts: () => void;
  toggleEncryption: () => void;
  setHardwareEncryption: (enabled: boolean) => void;
  setPurgeSchedule: (schedule: PurgeScheduleOption) => void;
  setPreserveExplicitFacts: (preserve: boolean) => void;
  importFacts: (importedFacts: MemoriaFact[]) => void;
  customCategories: CustomCategoryDef[];
  addCustomCategory: (cat: CustomCategoryDef) => void;
  deleteCustomCategory: (id: string) => void;

  // Chat & Stateless Broker
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  clearMessages: () => void;

  // Audio quick status (persists across screens)
  playingTrackTitle: string | null;
  isPlayingAudio: boolean;
  setAudioPlayback: (title: string | null, isPlaying: boolean) => void;

  // Dynamic Content Generators
  getTodayGreeting: () => string;
  getRoutineGreetingDetail: () => string;
  getCompanionSubtitle: () => string;
}

const DEFAULT_PARTNER_PROFILE: UserPartnerProfile = {
  userName: 'José',
  assistantName: 'VEYA',
  pronounTreatment: 'tu',
  companionRole: 'friend',
  detectFatigue: true,
  nonInvasiveMode: true,
};

const DEFAULT_VOICE_PROFILE: VoicePersonalityProfile = {
  selectedVoiceId: 'voice_aura',
  speechSpeed: 1.0,
  pitch: 0,
  naturalPauses: true,
  warmth: 75,
  conciseness: 65,
  proactivity: 50,
};

const INITIAL_MESSAGES_TU: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'veya',
    text: 'Hola José. Estoy aquí, en local. ¿En qué puedo acompañarte hoy?',
    timestamp: '08:14',
    mood: 'sereno',
  },
  {
    id: 'msg_2',
    sender: 'user',
    text: 'Recuérdame revisar la arquitectura Local-First y los contratos de estado a las 10:00.',
    timestamp: '08:15',
  },
  {
    id: 'msg_3',
    sender: 'veya',
    text: 'Anotado en tu memoria local cifrada: "Revisar arquitectura Local-First a las 10:00". Todo permanece estrictamente en tu dispositivo.',
    timestamp: '08:15',
    mood: 'concentrado',
  },
];

const VeyaGlobalContext = createContext<VeyaGlobalContextType | undefined>(undefined);

export const VeyaGlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Load Partner Profile
  const [partnerProfile, setPartnerProfile] = useState<UserPartnerProfile>(() => {
    try {
      const saved = localStorage.getItem(PARTNER_STORAGE_KEY);
      if (saved) return { ...DEFAULT_PARTNER_PROFILE, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Error loading partner profile:', e);
    }
    return DEFAULT_PARTNER_PROFILE;
  });

  // 2. Load Voice Profile
  const [voiceProfile, setVoiceProfile] = useState<VoicePersonalityProfile>(() => {
    try {
      const saved = localStorage.getItem(VOICE_STORAGE_KEY);
      if (saved) return { ...DEFAULT_VOICE_PROFILE, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Error loading voice profile:', e);
    }
    return DEFAULT_VOICE_PROFILE;
  });

  // 3. Load Vault State
  const [vaultState, setVaultState] = useState<{
    facts: MemoriaFact[];
    isEncrypted: boolean;
    purgeSchedule: PurgeScheduleOption;
    preserveExplicitFacts: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEY);
      if (saved) {
        const parsed: StructuredVaultStorage = JSON.parse(saved);
        if (Array.isArray(parsed.facts)) {
          // Garantizar que las nuevas categorías canónicas (cine y deportes) estén disponibles si no existen aún
          const hasCine = parsed.facts.some((f) => f.category === 'cinema');
          const hasSport = parsed.facts.some((f) => f.category === 'sports');
          const merged = [...parsed.facts];
          if (!hasCine) {
            const cineSeed = INITIAL_FACTS.find((f) => f.id === 'f_cine1');
            if (cineSeed) merged.push(cineSeed);
          }
          if (!hasSport) {
            const sportSeed = INITIAL_FACTS.find((f) => f.id === 'f_sport1');
            if (sportSeed) merged.push(sportSeed);
          }
          return {
            facts: merged,
            isEncrypted: parsed.isHardwareEncrypted ?? true,
            purgeSchedule: parsed.purgeSchedule ?? '30d',
            preserveExplicitFacts: parsed.preserveExplicitFacts ?? true,
          };
        }
      }
    } catch (e) {
      console.warn('Error loading vault storage:', e);
    }
    return {
      facts: INITIAL_FACTS,
      isEncrypted: true,
      purgeSchedule: '30d',
      preserveExplicitFacts: true,
    };
  });

  // 3.1 Load Custom Categories
  const [customCategories, setCustomCategories] = useState<CustomCategoryDef[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error loading custom categories:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(customCategories));
    } catch (e) {
      console.warn('Error saving custom categories:', e);
    }
  }, [customCategories]);

  const addCustomCategory = (cat: CustomCategoryDef) => {
    setCustomCategories((prev) => {
      if (prev.some((c) => c.id === cat.id)) return prev;
      return [...prev, cat];
    });
  };

  const deleteCustomCategory = (id: string) => {
    setCustomCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // 4. Audio quick state
  const [playingTrackTitle, setPlayingTrackTitle] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // 5. Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error loading chat messages:', e);
    }
    return INITIAL_MESSAGES_TU;
  });

  // Save Partner Profile on Change
  useEffect(() => {
    try {
      localStorage.setItem(PARTNER_STORAGE_KEY, JSON.stringify(partnerProfile));
    } catch (e) {
      console.warn('Error saving partner profile:', e);
    }
  }, [partnerProfile]);

  // Save Voice Profile on Change
  useEffect(() => {
    try {
      localStorage.setItem(VOICE_STORAGE_KEY, JSON.stringify(voiceProfile));
    } catch (e) {
      console.warn('Error saving voice profile:', e);
    }
  }, [voiceProfile]);

  // Save Vault State on Change
  useEffect(() => {
    try {
      const payload: StructuredVaultStorage = {
        version: '2.5.0',
        lastUpdated: new Date().toISOString(),
        isHardwareEncrypted: vaultState.isEncrypted,
        purgeSchedule: vaultState.purgeSchedule,
        preserveExplicitFacts: vaultState.preserveExplicitFacts,
        facts: vaultState.facts,
      };
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Error saving vault storage:', e);
    }
  }, [vaultState]);

  // Save Chat Messages on Change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Error saving chat messages:', e);
    }
  }, [messages]);

  // Active in Context Facts (Stateless Broker payload)
  const activeInContextFacts = useMemo(() => {
    return vaultState.facts.filter((f) => f.activeInContext);
  }, [vaultState.facts]);

  // Partner Profile Updaters
  const setUserName = (name: string) => {
    setPartnerProfile((prev) => ({ ...prev, userName: name }));
  };

  const setAssistantName = (name: string) => {
    setPartnerProfile((prev) => ({ ...prev, assistantName: name }));
  };

  const setPronounTreatment = (treatment: PronounTreatment) => {
    setPartnerProfile((prev) => ({ ...prev, pronounTreatment: treatment }));
  };

  const setCompanionRole = (role: CompanionRole) => {
    setPartnerProfile((prev) => ({ ...prev, companionRole: role }));
  };

  const setDetectFatigue = (enabled: boolean) => {
    setPartnerProfile((prev) => ({ ...prev, detectFatigue: enabled }));
  };

  const setNonInvasiveMode = (enabled: boolean) => {
    setPartnerProfile((prev) => ({ ...prev, nonInvasiveMode: enabled }));
  };

  const updatePartnerProfile = (partial: Partial<UserPartnerProfile>) => {
    setPartnerProfile((prev) => ({ ...prev, ...partial }));
  };

  // Voice Profile Updaters
  const setSelectedVoiceId = (id: string) => {
    setVoiceProfile((prev) => ({ ...prev, selectedVoiceId: id }));
  };

  const setSpeechSpeed = (speed: number) => {
    setVoiceProfile((prev) => ({ ...prev, speechSpeed: speed }));
  };

  const setPitch = (pitch: number) => {
    setVoiceProfile((prev) => ({ ...prev, pitch: pitch }));
  };

  const setNaturalPauses = (enabled: boolean) => {
    setVoiceProfile((prev) => ({ ...prev, naturalPauses: enabled }));
  };

  const setWarmth = (val: number) => {
    setVoiceProfile((prev) => ({ ...prev, warmth: val }));
  };

  const setConciseness = (val: number) => {
    setVoiceProfile((prev) => ({ ...prev, conciseness: val }));
  };

  const setProactivity = (val: number) => {
    setVoiceProfile((prev) => ({ ...prev, proactivity: val }));
  };

  const resetVoiceDefaults = () => {
    setVoiceProfile(DEFAULT_VOICE_PROFILE);
  };

  const applyTemperamentPreset = (preset: 'zen' | 'mentor' | 'friend') => {
    if (preset === 'zen') {
      setVoiceProfile((prev) => ({
        ...prev,
        warmth: 40,
        conciseness: 90,
        proactivity: 25,
      }));
    } else if (preset === 'mentor') {
      setVoiceProfile((prev) => ({
        ...prev,
        warmth: 85,
        conciseness: 45,
        proactivity: 70,
      }));
    } else {
      setVoiceProfile((prev) => ({
        ...prev,
        warmth: 75,
        conciseness: 65,
        proactivity: 50,
      }));
    }
  };

  // Vault Updaters
  const toggleFactContext = (id: string, explicitValue?: boolean) => {
    setVaultState((prev) => ({
      ...prev,
      facts: prev.facts.map((f) =>
        f.id === id
          ? { ...f, activeInContext: explicitValue !== undefined ? explicitValue : !f.activeInContext }
          : f
      ),
    }));
  };

  const confirmFact = (id: string) => {
    setVaultState((prev) => ({
      ...prev,
      facts: prev.facts.map((f) => {
        if (f.id === id) {
          const timestamp =
            f.timestamp !== null
              ? f.timestamp
              : 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...f,
            origin: 'explicit',
            timestamp,
          };
        }
        return f;
      }),
    }));
  };

  const updateFact = (fact: MemoriaFact) => {
    setVaultState((prev) => ({
      ...prev,
      facts: prev.facts.map((f) => (f.id === fact.id ? fact : f)),
    }));
  };

  const deleteFact = (id: string) => {
    setVaultState((prev) => ({
      ...prev,
      facts: prev.facts.filter((f) => f.id !== id),
    }));
  };

  const addFact = (factData: Omit<MemoriaFact, 'id' | 'sha256Hash'>): MemoriaFact => {
    // Generate pseudo SHA-256 for local integrity
    const hash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newFact: MemoriaFact = {
      ...factData,
      id: 'f_' + Date.now(),
      sha256Hash: hash,
      embeddingVectorDims: 384,
    };

    setVaultState((prev) => ({
      ...prev,
      facts: [newFact, ...prev.facts],
    }));

    return newFact;
  };

  const purgeAllFacts = () => {
    setVaultState((prev) => ({
      ...prev,
      facts: [],
    }));
  };

  const restoreInitialFacts = () => {
    setVaultState((prev) => ({
      ...prev,
      facts: INITIAL_FACTS,
    }));
  };

  const toggleEncryption = () => {
    setVaultState((prev) => ({
      ...prev,
      isEncrypted: !prev.isEncrypted,
    }));
  };

  const setHardwareEncryption = (enabled: boolean) => {
    setVaultState((prev) => ({
      ...prev,
      isEncrypted: enabled,
    }));
  };

  const setPurgeSchedule = (schedule: PurgeScheduleOption) => {
    setVaultState((prev) => ({
      ...prev,
      purgeSchedule: schedule,
    }));
  };

  const setPreserveExplicitFacts = (preserve: boolean) => {
    setVaultState((prev) => ({
      ...prev,
      preserveExplicitFacts: preserve,
    }));
  };

  const importFacts = (importedFacts: MemoriaFact[]) => {
    setVaultState((prev) => ({
      ...prev,
      facts: importedFacts,
    }));
  };

  // Audio helper
  const setAudioPlayback = (title: string | null, isPlaying: boolean) => {
    setPlayingTrackTitle(title);
    setIsPlayingAudio(isPlaying);
  };

  // Local-First Dynamic AI Response Generator
  const generateVeyaResponse = (userText: string): { text: string; mood: AvatarMood } => {
    const isUsted = partnerProfile.pronounTreatment === 'usted';
    const name = partnerProfile.userName || 'José';
    const role = partnerProfile.companionRole;
    const isConcise = voiceProfile.conciseness > 70;
    const isWarm = voiceProfile.warmth > 70;
    const lower = userText.toLowerCase();

    // Check if user is asking about memories or what VEYA knows
    if (
      lower.includes('qué sabes') ||
      lower.includes('que sabes') ||
      lower.includes('recuerdas') ||
      lower.includes('memoria') ||
      lower.includes('bóveda') ||
      lower.includes('boveda')
    ) {
      if (activeInContextFacts.length === 0) {
        return {
          text: isUsted
            ? `Estimado ${name}, actualmente no hay ningún recuerdo activo inyectado en mi prompt efímero. Su bóveda local está aislada de la IA.`
            : `Hola ${name}, ahora mismo no tengo recuerdos activos inyectados en mi contexto. Tu bóveda está completamente aislada.`,
          mood: 'sereno',
        };
      }

      const activeTitles = activeInContextFacts.slice(0, 4).map((f) => `• ${f.title}`).join('\n');
      return {
        text: isUsted
          ? `Estimado ${name}, recupero en este turno ${activeInContextFacts.length} recuerdos de su bóveda local cifrada:\n\n${activeTitles}\n\nTodo procesado estrictamente en su hardware.`
          : `${name}, tengo presentes ${activeInContextFacts.length} aspectos activos de tu memoria local:\n\n${activeTitles}\n\nNada de esto ha salido de tu teléfono.`,
        mood: 'concentrado',
      };
    }

    // Check if user mentions music or sound
    if (lower.includes('música') || lower.includes('musica') || lower.includes('canción') || lower.includes('audio')) {
      const musicFact = activeInContextFacts.find((f) => f.category === 'music');
      const detail = musicFact
        ? isUsted
          ? ` Considerando su preferencia por "${musicFact.title}", sugiero reproducción en 24-bit bit-perfect.`
          : ` Teniendo en cuenta tu gusto por "${musicFact.title}", activo el motor jetAudio DSP.`
        : '';

      return {
        text: isUsted
          ? `Entendido, ${name}.${detail} ¿Desea iniciar la lista acústica de concentración?`
          : `¡Listo, ${name}!${detail} ¿Ponemos la biblioteca FLAC en marcha?`,
        mood: 'animado',
      };
    }

    // Check if user mentions fatigue, rest, or pause
    if (lower.includes('cansad') || lower.includes('pausa') || lower.includes('descanso') || lower.includes('estrés')) {
      return {
        text: isUsted
          ? `Comprendo el agotamiento, ${name}. ${partnerProfile.detectFatigue ? 'He registrado su tiempo de sesión continua.' : ''} Le recomiendo una pausa de 4 minutos con respiración diafragmática.`
          : `Te entiendo perfectamente, ${name}. Tómate 3 minutos, bebe algo de agua y estira la espalda. La pantalla puede esperar.`,
        mood: 'empatico',
      };
    }

    // Check if user mentions routine or morning
    if (lower.includes('rutina') || lower.includes('mañana') || lower.includes('alarma') || lower.includes('despertar')) {
      const routineFact = activeInContextFacts.find((f) => f.category === 'routine');
      return {
        text: isUsted
          ? `Su rutina matinal está configurada a las 07:30 con despertar armónico.${routineFact ? ` Recordando: "${routineFact.title}".` : ''} Todo coordinado en local.`
          : `Tu rutina matinal está lista a las 07:30.${routineFact ? ` Tengo en cuenta: "${routineFact.title}".` : ''} ¿Quieres que ajustemos algún paso?`,
        mood: 'sereno',
      };
    }

    // Check role-based flavor
    if (role === 'functional' || isConcise) {
      return {
        text: isUsted
          ? `Registrado. Procesado en sandbox local. ¿Siguiente instrucción, ${name}?`
          : `Hecho, ${name}. Guardado en memoria local sin fugas. ¿Qué más necesitas?`,
        mood: 'concentrado',
      };
    }

    if (role === 'mentor') {
      return {
        text: isUsted
          ? `Anotado en su memoria cifrada, ${name}. Recuerde mantener el equilibrio en su jornada laboral y pausar cuando su concentración disminuya.`
          : `Queda anotado, ${name}. Vamos con buen ritmo hoy, pero no olvides cuidar tu postura y hacer pausas conscientes.`,
        mood: 'empatico',
      };
    }

    // Default friendly answer
    return {
      text: isUsted
        ? `He recibido su mensaje, ${name}. Procesado localmente con el motor ${partnerProfile.assistantName}. Su privacidad se mantiene íntegra.`
        : `He procesado tu petición, ${name}. Todo guardado en tu teléfono de forma soberana. Cuenta conmigo.`,
      mood: isWarm ? 'cercano' : 'sereno',
    };
  };

  // Chat message sender
  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulate local inference delay (fast on-device response)
    setTimeout(() => {
      const response = generateVeyaResponse(text.trim());
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'veya',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: response.mood,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Dynamic Text Generators for other screens
  const getTodayGreeting = (): string => {
    const isUsted = partnerProfile.pronounTreatment === 'usted';
    const name = partnerProfile.userName || 'José';
    const hour = new Date().getHours();
    let timeGreeting = 'Buenos días';
    if (hour >= 13 && hour < 20) timeGreeting = 'Buenas tardes';
    if (hour >= 20 || hour < 6) timeGreeting = 'Buenas noches';

    return isUsted ? `${timeGreeting}, estimado ${name}` : `${timeGreeting}, ${name}`;
  };

  const getRoutineGreetingDetail = (): string => {
    const isUsted = partnerProfile.pronounTreatment === 'usted';
    const name = partnerProfile.userName || 'José';
    return isUsted
      ? `Buenos días, estimado ${name}. Su rutina matinal está lista.`
      : `Buenos días, ${name}. Hoy es un día para avanzar con serenidad.`;
  };

  const getCompanionSubtitle = (): string => {
    const isUsted = partnerProfile.pronounTreatment === 'usted';
    const roleMap: Record<CompanionRole, string> = {
      friend: isUsted ? 'Compañero formal y cercano' : 'Compañero cotidiano y empático',
      mentor: 'Mentor de bienestar y pausas conscientes',
      functional: 'Asistente funcional y directo',
    };
    return roleMap[partnerProfile.companionRole] || 'Asistente personal en dispositivo';
  };

  const contextValue: VeyaGlobalContextType = {
    partnerProfile,
    setUserName,
    setAssistantName,
    setPronounTreatment,
    setCompanionRole,
    setDetectFatigue,
    setNonInvasiveMode,
    updatePartnerProfile,

    voiceProfile,
    setSelectedVoiceId,
    setSpeechSpeed,
    setPitch,
    setNaturalPauses,
    setWarmth,
    setConciseness,
    setProactivity,
    resetVoiceDefaults,
    applyTemperamentPreset,

    facts: vaultState.facts,
    activeInContextFacts,
    isEncrypted: vaultState.isEncrypted,
    purgeSchedule: vaultState.purgeSchedule,
    preserveExplicitFacts: vaultState.preserveExplicitFacts,
    toggleFactContext,
    confirmFact,
    updateFact,
    deleteFact,
    addFact,
    purgeAllFacts,
    restoreInitialFacts,
    toggleEncryption,
    setHardwareEncryption,
    setPurgeSchedule,
    setPreserveExplicitFacts,
    importFacts,
    customCategories,
    addCustomCategory,
    deleteCustomCategory,

    messages,
    sendMessage,
    clearMessages,

    playingTrackTitle,
    isPlayingAudio,
    setAudioPlayback,

    getTodayGreeting,
    getRoutineGreetingDetail,
    getCompanionSubtitle,
  };

  return (
    <VeyaGlobalContext.Provider value={contextValue}>
      {children}
    </VeyaGlobalContext.Provider>
  );
};

export const useVeya = (): VeyaGlobalContextType => {
  const context = useContext(VeyaGlobalContext);
  if (!context) {
    throw new Error('useVeya must be used within a VeyaGlobalProvider');
  }
  return context;
};
