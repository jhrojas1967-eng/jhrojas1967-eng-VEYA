import fs from 'fs';
import path from 'path';
import { generateLottieAvatarJson } from '../src/lottieExporter';
import { AvatarState, AvatarMood } from '../src/types';

interface ExportTarget {
  filename: string;
  state: AvatarState;
  mood: AvatarMood;
  amplitude: number;
}

const TARGETS: ExportTarget[] = [
  { filename: 'veya_avatar_idle_sereno.json', state: 'idle', mood: 'sereno', amplitude: 0.0 },
  { filename: 'veya_avatar_listening_sereno.json', state: 'listening', mood: 'sereno', amplitude: 0.0 },
  { filename: 'veya_avatar_thinking_sereno.json', state: 'thinking', mood: 'sereno', amplitude: 0.0 },
  { filename: 'veya_avatar_speaking_animado.json', state: 'speaking', mood: 'animado', amplitude: 0.5 },
  { filename: 'veya_avatar_muted_espera.json', state: 'muted', mood: 'espera', amplitude: 0.0 },
];

const OUTPUT_DIRS = [
  path.resolve(process.cwd(), 'res_raw_export'),
  path.resolve(process.cwd(), 'public/res_raw_export'),
  path.resolve(process.cwd(), 'entregas/res_raw_export'),
];

for (const dir of OUTPUT_DIRS) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

console.log('Generando los 5 archivos Lottie Bodymovin v5.5.2 para Android res/raw...');

for (const target of TARGETS) {
  const jsonContent = generateLottieAvatarJson(target.state, target.mood, target.amplitude, false);
  const formatted = JSON.stringify(jsonContent, null, 2);

  for (const dir of OUTPUT_DIRS) {
    const filePath = path.join(dir, target.filename);
    fs.writeFileSync(filePath, formatted, 'utf-8');
    console.log(`✓ Escrito: ${path.relative(process.cwd(), filePath)} (${(Buffer.byteLength(formatted) / 1024).toFixed(1)} KB)`);
  }
}

console.log('\nGeneración de Lottie JSON completada exitosamente.');
