# ENTREGA 23: SUITE DE HERRAMIENTAS INTERACTIVAS PROFESIONALES DE VEYA
*(Inspiradas en NASA's Eyes, Stellarium, SkyView Lite, Smithsonian 3D, Anatronica, GeoGebra y WolframAlpha)*

**De:** Gemini / Google AI Studio  
**Para:** José / Claude Code (Lead Integrador Android VEYA)  
**Documento de Entrega:** `entregas/23_suite_herramientas_profesionales_aprendizaje.md`  
**Prototipo interactivo en React:** `src/components/ScreenBlackboard.tsx`  
**Módulos especializados:**  
- `src/components/blackboard/ToolAstronomyPhysics.tsx` (Astronomía y Física 3D)  
- `src/components/blackboard/ToolBiologyAnatomy.tsx` (Biología y Anatomía 3D)  
- `src/components/blackboard/ToolGeoGebraWolfram.tsx` (GeoGebra y WolframAlpha Solver)  
**Integración en Chat:** `src/components/ScreenChat.tsx` y `src/context/VeyaGlobalContext.tsx`  
**Paquete Android objetivo:** `personal.veya.ui.tools` / `personal.veya.ui.blackboard.pro`

---

## 1. RESUMEN EJECUTIVO: ELEVACIÓN AL ESTÁNDAR DE REFERENTES CIENTÍFICOS

La **Pizarra Universal VEYA** evoluciona de un visualizador conceptual a una **Suite Completa de Herramientas Científicas e Interactivas de Nivel Profesional**, emulando el rigor técnico, la interactividad en tiempo real y la riqueza visual de los mayores referentes mundiales en educación y simulación:

1. **Astronomía y Astrofísica** (Inspirado en *NASA's Eyes*, *Stellarium* y *SkyView Lite*).
2. **Biología, Anatomía y Ciencias Naturales** (Inspirado en *Smithsonian 3D* y *Anatronica*).
3. **Matemáticas y Álgebra Computacional** (Inspirado en *GeoGebra* y *WolframAlpha*).
4. **Oficios Prácticos, Automoción, Derecho y Sociedad** (Mecánica 4 tiempos, circuitos, derecho cotidiano, asertividad).

Todo ello manteniendo el **Avatar de VEYA 100% intacto** (sin alterar mallas, shaders, lienzos ni transiciones de ánimo), actuando como la mentora e interlocutora que despliega estas pantallas tanto a demanda en el chat como desde el catálogo directo.

---

## 2. ARQUITECTURA DE LAS TRES ESTACIONES EMBLEMÁTICAS

### 2.1. Estación 1: Astronomía y Astrofísica (`ToolAstronomyPhysics.tsx`)
*Referentes: NASA's Eyes + Stellarium + SkyView Lite*

* **Sub-Módulo 1: NASA's Eyes (Orrery Orbital 3D & Efemérides Keplerianas)**
  - Modelado orbital del Sistema Solar: Sol con corona radiante, planetas (Mercurio a Saturno con anillos realistas), cinturón de asteroides (Ceres) y satélites.
  - Velocidades orbitales calculadas según la 3ª Ley de Kepler ($T^2 \propto a^3$).
  - Controles de tiempo: Play/Pausa, Time-Warp (0.5x, 1x, 3x, 10x), slider temporal y zoom óptico ($0.7\times$ a $1.8\times$).
  - Telemetría al tocar cualquier planeta: distancia en Unidades Astronómicas (UA) y millones de km, período orbital, gravedad superficial en $m/s^2$ y en unidades $g$, temperatura media y conteo de satélites naturales.
* **Sub-Módulo 2: ISS & Satélites en Tiempo Real (SkyView Lite Tracker)**
  - Globo terráqueo con proyección ortográfica y trazado sinusoidal de la traza sobre el suelo (Ground Track).
  - Telemetría en directo de la Estación Espacial Internacional (ISS): altitud de 408.2 km, velocidad orbital de 27.600 km/h (7.66 km/s, Mach 22.4), período de 92.68 min e inclinación de 51.6°.
  - Indicador de avistamiento a simple vista y paso sobre el crepúsculo.
* **Sub-Módulo 3: Stellarium (Planetario Virtual y Bóveda Celeste)**
  - Bóveda de constelaciones interactivas: Orión (con Betelgeuse roja y Rigel azul), Osa Mayor (apuntando a la Estrella Polar) y horizonte cardinal (Este, Sur, Oeste).
  - Modo **Visión Nocturna (Filtro Rojo Astronómico)** para preservar la adaptación a la oscuridad y los bastones retinianos durante observaciones de campo.
* **Sub-Módulo 4: Física de Mareas de Newton**
  - Gravedad diferencial Sol-Tierra-Luna con elipse de abultamiento mareal (*tidal bulge*).
  - Selector de fases lunares: Luna Nueva/Llena (Mareas Vivas / Sizigia) vs Cuartos (Mareas Muertas / Cuadratura).
* **Sub-Módulo 5: Relatividad Especial de Einstein**
  - Deslizador de velocidad relativista ($0.0c$ a $0.995c$).
  - Factor de Lorentz $\gamma = 1 / \sqrt{1 - v^2/c^2}$ en tiempo real.
  - Comparativa de relojes sincrónicos: observador terrestre vs tiempo propio del astronauta en la nave ($t_0 = t / \gamma$).

---

### 2.2. Estación 2: Biología, Anatomía y Ciencias Naturales (`ToolBiologyAnatomy.tsx`)
*Referentes: Smithsonian 3D + Anatronica*

* **Sub-Módulo 1: Anatronica 3D (Cuerpo Humano y Órganos Vitales)**
  - Explorador interactivo con selección de sistemas:
    * **Cardiovascular**: Miocardio 4D latiendo con sístole y diástole sincronizadas, vasos sanguíneos (Aorta y Vena Cava), trazado electrocardiográfico (ECG Derivación II) continuo y tacómetro de ritmo cardíaco (45 a 150 BPM).
    * **Nervioso**: Córtex cerebral con división de lóbulos (Frontal, Temporal, Parietal, Occipital) y función cognitiva.
    * **Respiratorio**: Árbol bronquial y alvéolos para intercambio gaseoso ($O_2 \leftrightarrow CO_2$).
    * **Locomotor / Óseo**: Esqueleto humano (206 huesos), fémur y médula ósea.
    * **Excretor / Renal**: Nefronas y filtrado glomerular plasmático.
  - Ficha clínica completa para cada órgano: función vital, patología más frecuente (infarto, ictus, EPOC), protocolo preventivo y primeros auxilios.
* **Sub-Módulo 2: Smithsonian 3D Lab (Fósiles y Evolución)**
  - Modelos tridimensionales con rotación $360^\circ$:
    * Cráneo de *Tyrannosaurus rex* (Cretácico, 66 Ma) con cálculo de fuerza mandibular (35.000 N).
    * Fósil de *Trilobite* (*Elrathia kingii*, Cámbrico, 500 Ma) y lentes de calcita cristalina.
    * Cráneo del homínido *Australopithecus afarensis* ("Lucy", 3.2 Ma) y evidencia biomecánica del bipedismo.
* **Sub-Módulo 3: Microscopía Celular (Célula Eucariota)**
  - Aumento simulado de $20.000\times$: membrana plasmática bicapa lipídica, citoplasma con mitocondrias productoras de ATP, ribosomas y núcleo con ADN genómico.
* **Sub-Módulo 4: Dermatología Clínica Preventiva (Regla ABCD)**
  - Simulador de autoexploración cutánea comparando nevus benigno vs melanoma sospechoso bajo la regla clínica ABCD (Asimetría, Bordes, Color, Diámetro $>6\text{ mm}$).

---

### 2.3. Estación 3: Matemáticas y Álgebra Computacional (`ToolGeoGebraWolfram.tsx`)
*Referentes: GeoGebra + WolframAlpha*

* **Sub-Módulo 1: GeoGebra Studio (Graficador y Cálculo Infinitesimal)**
  - Renderizador en Canvas de alta resolución con ejes cartesianos graduados, origen $(0,0)$ y rejilla milimetrada.
  - Funciones analíticas: Parábolas ($ax^2 + bx + c$), Ondas sinusoidales ($A \cdot \sin(\omega x + \phi)$), Polinomios cúbicos y Exponenciales.
  - Deslizadores en tiempo real para todos los parámetros de la curva.
  - **Derivada y Recta Tangente móvil**: cálculo instantáneo de la pendiente $m = f'(x_0)$ y trazado de la recta tangente roja en cualquier coordenada $x_0$.
  - **Integral Definida**: sombreado del área bajo la curva entre $[a, b]$ según la integral de Riemann.
* **Sub-Módulo 2: WolframAlpha Step-by-Step Solver**
  - **Quebrados y Fracciones**:
    * Operaciones aritméticas ($+$, $-$, $\times$, $\div$).
    * Desglose paso a paso: cálculo del Mínimo Común Múltiplo (MCM), amplificación de numeradores, cálculo del Máximo Común Divisor (MCD), simplificación canónica y equivalencia decimal.
  - **Ecuaciones Cuadráticas**:
    * Cálculo paso a paso del discriminante $\Delta = b^2 - 4ac$.
    * Clasificación de raíces (dos reales distintas, doble, o complejas conjugadas con unidad imaginaria $i$).
    * Aplicación de la fórmula general de Bhaskara.
  - **Termodinámica de Gases Ideales**:
    * Ecuación de estado $P \cdot V = n \cdot R \cdot T$ con teoría cinética molecular.
  - **Circuitos Eléctricos**:
    * Ley de Ohm ($V = I \cdot R$) y potencia eléctrica ($P = V \cdot I$).

---

## 3. ADAPTACIÓN PEDAGÓGICA UNIVERSAL (3 NIVELES)

Cada módulo y herramienta cuenta con el selector superior de 3 niveles:

| Nivel | Destinatario Objetivo | Estilo de Explicación y Métricas |
| :--- | :--- | :--- |
| **🌱 Cotidiano** | Adolescentes o adultos sin estudios previos | Metáforas visuales directas (la manguera para la corriente, la pizza para fracciones, la pelota en el aire para funciones), lenguaje cálido y motivación sin tecnicismos intimidantes. |
| **🔧 Práctico** | Vida diaria, oficios y técnicos | Procedimientos concretos, primeros auxilios ante dolor en el pecho, cómo leer el manómetro de un gas, qué hacer ante una bombilla que parpadea o cómo avistar la ISS en el crepúsculo. |
| **🎓 Universitario** | Universitarios o profesionales | Fórmulas rigurosas, deducción kepleriana $v = \sqrt{G M / r}$, factor de Lorentz $\gamma$, formalismo de límites $\lim_{h \to 0}$, potencial de acción neuronal y artículos legislativos. |

---

## 4. ESPECIFICACIÓN DE IMPLEMENTACIÓN EN ANDROID (JETPACK COMPOSE & M3)

### 4.1. Estructura de Paquetes
```
personal.veya.ui.tools/
├── astronomy/
│   ├── NasaEyesOrreryCanvas.kt        // Renderizador orbital Kepleriano con Canvas Compose
│   ├── IssTrackerSatelliteView.kt     // Seguimiento LEO e interpolación de coordenadas
│   ├── StellariumSkyPlanetarium.kt    // Proyección estereográfica de constelaciones
│   └── RelativityDilationCard.kt      // Factor Lorentz reactivo con StateFlow
├── biology/
│   ├── AnatronicaCardioBeat.kt        // Animación miocárdica sístole/diástole con ECG Path
│   ├── SmithsonianSpecimen3D.kt       // Vista de rotación 360 con RenderEffect
│   └── DermatologyAbcdTester.kt       // Canvas diagnóstico de lesiones cutáneas
├── math/
│   ├── GeoGebraFunctionCanvas.kt      // Graficador cartesiano con drawPath y tangents
│   └── WolframStepSolver.kt           // Motor recursivo de descomposición algebraica
└── universal/
    ├── VeyaToolSuiteScaffold.kt       // Scaffold M3 con selector de categoría y nivel
    └── PedagogicalLevelSelector.kt    // SegmentedButton M3 (Cotidiano / Práctico / Avanzado)
```

### 4.2. Directrices de Rendimiento (Compose)
1. **Hardware Acceleration en `Canvas`**: Usar `drawIntoCanvas` o `drawPath` con vectores precalculados (`rememberSaveable`) para el graficador y las órbitas, evitando recomposiciones innecesarias.
2. **Ciclo de Animación a 60 FPS**: Usar `withFrameMillis` o `infiniteTransition` para el latido del corazón y las órbitas keplerianas, manteniendo el hilo principal libre de bloqueos.
3. **Persistencia de Estado**: Al cambiar de nivel pedagógico (`cotidiano` / `practico` / `universitario`), los parámetros modificados por el usuario (ej. $a, b, c$ en GeoGebra, o BPM en Anatronica) no deben reiniciarse.

---

## 5. RESUMEN DE VERIFICACIÓN
* **Compilación**: Aplicación compilada limpiamente sin errores (`compile_applet` OK).
* **Linter**: Verificación estricta de tipos TypeScript completada (`lint_applet` 0 errores).
* **Avatar y Lienzo**: Cero alteraciones en Avatar, lienzos 3D, Lottie ni perfiles de voz.
* **Integración**: VEYA abre las herramientas de forma inmediata tanto ante solicitudes en el chat como a través de los chips de sugerencia rápida.
