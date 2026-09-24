# ENTREGA 24: ESPECIFICACIÓN DEL SIMULADOR EDUCATIVO 3D (PLACEHOLDERS DE RENDERIZADO)

**De:** Gemini / Google AI Studio  
**Para:** José / Claude Code (Lead Integrador Android VEYA)  
**Documento de Entrega:** `entregas/24_simulador_educativo_3d_placeholders.md`  
**Componente React implementado:** `src/components/blackboard/EducationalSimulator3D.tsx`  
**Integración en Pizarra:** `src/components/ScreenBlackboard.tsx`  
**Paquete Android objetivo:** `personal.veya.ui.tools.simulator3d` / `personal.veya.ui.blackboard.render3d`

---

## 1. PROPÓSITO DEL SIMULADOR EDUCATIVO 3D

El **Simulador Educativo 3D** proporciona un entorno de inspección espacial tridimensional para estudiantes y profesores en las áreas de **Anatomía Humana** y **Física Fundamental**. 

El componente está diseñado con **Placeholders Visuales de Alta Fidelidad** que delimitan con precisión milimétrica el área de renderizado, su telemetría (FPS, polígonos, vértices, shaders) y sus controles de cámara (Yaw, Pitch, Zoom, Despiece y Plano de Corte), indicando de forma explícita dónde y cómo deben conectarse los motores y librerías de renderizado 3D reales:
* **Entorno Web / React:** Three.js / React Three Fiber (`@react-three/fiber` + `@react-three/drei`).
* **Entorno Móvil Android (Jetpack Compose):** Google Filament / SceneView (`io.github.sceneview:sceneview:2.2.1`).

---

## 2. CATÁLOGO DE MODELOS 3D INTEGRADOS EN EL SIMULADOR

### 2.1. Dominio de Anatomía Humana
1. **Cráneo Humano y Huesos Faciales (`cranium_3d`):**
   - Malla 3D de 48.520 polígonos con articulaciones sinartrodiales y suturas craneales.
   - Puntos de inspección táctil (*Hotspots*): Hueso Frontal, Mandíbula móvil articulada en ATM, y Arco Cigomático.
   - Modo de despiece tridimensional (*Exploded View*) para separar la mandíbula del neurocráneo.
2. **Corazón 4D con Ciclo Valvular (`heart_4d`):**
   - Malla de 62.140 polígonos con 12 morph targets (*blendshapes*) de contracción muscular.
   - Inspección táctil: Arco Aórtico, Ventrículo Izquierdo (pared engrosada) y Vena Cava Superior.
3. **Neurona Multipolar y Conexión Sináptica (`neuron_synapse`):**
   - Malla de 39.800 polígonos con soma, axón mielinizado por células de Schwann y botón terminal de 20 nm.

### 2.2. Dominio de Física Fundamental
1. **Campo Magnético y Fuerza de Lorentz (`lorentz_field`):**
   - Dipolo magnético con líneas toroidales de inducción magnética $\vec{B}$ y regla de la mano derecha $\vec{F} = q(\vec{v} \times \vec{B})$.
2. **Pozo Gravitatorio y Órbitas Keplerianas (`keplerian_orbit`):**
   - Elipse kepleriana con masa central en foco, periapsis de velocidad máxima y apoapsis de velocidad mínima.
3. **Modelo Atómico Cuántico / Nube Electrónica (`bohr_quantum_atom`):**
   - Núcleo atómico (protones/neutrones con fuerza fuerte) y orbitales probabilísticos con salto cuántico fotónico.

---

## 3. ARQUITECTURA DEL VIEWPORT PLACEHOLDER (RENDER CONTAINER)

El marco del viewport incluye elementos de instrumentación y guía:
1. **Developer Watermark Banner:** Identifica el ID del elemento de destino (`<canvas id="veya-3d-canvas">`).
2. **Gizmo 3D de Ejes Cartesianos:** Triada de ejes ortogonales ($X$ rojo, $Y$ verde, $Z$ azul) con perspectiva.
3. **Rejilla de Suelo en Perspectiva:** Cuadrícula milimetrada deformable según el zoom y la inclinación de la cámara.
4. **Selector de Modos de Shader:**
   - **PBR Realista:** Renderizado basado en física con texturas Albedo, Roughness y Metallic.
   - **Wireframe Blueprint:** Malla poligonal de aristas para análisis de topología y densidad de polígonos.
   - **Rayos X / Transparencia:** Shader translúcido para visualizar estructuras internas simultáneamente.
   - **Normales:** Visualización del vector normal de cada cara para depuración de iluminación.
5. **HUD de Telemetría:** Conteo en tiempo real de FPS (60.0), polígonos, vértices, ángulos Yaw/Pitch y nivel de zoom.

---

## 4. CÓDIGO DE INTEGRACIÓN PARA DESARROLLADORES Y ESTUDIANTES

El componente incorpora una pestaña dedicada (**"Integración SDK"**) con los fragmentos de código exactos para reemplazar el placeholder:

### 4.1. Web / React (Three.js & React Three Fiber)
```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function ModelRenderer({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} />;
}

// Reemplazo del placeholder:
<Canvas camera={{ position: [0, 1, 3], fov: 45 }}>
  <ambientLight intensity={0.7} />
  <directionalLight position={[10, 10, 5]} intensity={1.2} />
  <ModelRenderer modelUrl={`/assets/models/${activeModel.id}.glb`} />
  <OrbitControls enableDamping autoRotate={isRotating} />
</Canvas>
```

### 4.2. Android Jetpack Compose (SceneView / Filament)
```kotlin
// build.gradle.kts:
// implementation("io.github.sceneview:sceneview:2.2.1")

@Composable
fun Veya3DModelViewer(
    modelPath: String,
    isWireframe: Boolean = false,
    modifier: Modifier = Modifier
) {
    Scene(
        modifier = modifier.fillMaxSize(),
        model = rememberModelLoader(modelPath),
        cameraNode = rememberCameraNode { 
            position = Position(x = 0f, y = 1f, z = 3f) 
        },
        isRotateEnabled = true,
        isScaleEnabled = true
    )
}
```

---

## 5. ESTADO DE VERIFICACIÓN
* **Compilación:** Verificada con `compile_applet` (Exit Code 0).
* **Linter de Tipos:** Verificado con `lint_applet` (0 errores).
* **Avatar y Lienzo:** Avatar de VEYA, estados, lienzo Pixar y perfiles de voz 100% inalterados.
