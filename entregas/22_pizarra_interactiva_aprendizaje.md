# ENTREGA 22: ESPECIFICACIÓN Y PROTOTIPO DE LA PIZARRA UNIVERSAL DE APRENDIZAJE DE VEYA

**De:** Gemini / Google AI Studio  
**Para:** José / Claude Code (Lead Integrador Android VEYA)  
**Documento de Entrega:** `entregas/22_pizarra_interactiva_aprendizaje.md`  
**Prototipo interactivo en React:** `src/components/ScreenBlackboard.tsx`  
**Integración en Chat:** `src/components/ScreenChat.tsx` y `src/context/VeyaGlobalContext.tsx`  
**Paquete Android objetivo:** `personal.veya.ui.blackboard` / `personal.veya.ui.learning.universal`

---

## 1. RESUMEN EJECUTIVO: LA PIZARRA UNIVERSAL MULTINIVEL

La **Pizarra Universal de VEYA** trasciende la mera lección académica: es un motor de **modelado conceptual interactivo** concebido para adaptarse a cualquier usuario:
* **Adolescentes y personas sin estudios previos**: explicaciones con analogías cotidianas, modelos visuales manipulables y cero frustración.
* **Adultos en su vida cotidiana y oficios**: fontanería del hogar, circuitos eléctricos básicos, mecánica de coches, derechos laborales y del consumidor, o autoexamen de salud.
* **Estudiantes universitarios o especialistas**: rigor matemático, ecuaciones diferenciales, artículos del código civil y penal, física cuántica o arquitectura de redes neuronales.

El **Avatar de VEYA se mantiene 100% intacto**, sin tocar moods, animaciones ni lienzos, actuando como el tutor que abre la pizarra en el chat ante cualquier pregunta.

---

## 2. SELECTOR DE PROFUNDIDAD PEDAGÓGICA (3 NIVELES)

Cada plantilla de la pizarra cuenta con un selector superior con tres modos de aprendizaje:

1. **🌱 Nivel Cotidiano (Sin formación previa / Adolescentes)**:
   - Foco en *qué pasa* y *para qué sirve*.
   - Metáforas del día a día (ej. la manguera de agua para la electricidad, el corte de pizza para los quebrados).
   - Lenguaje cálido, empático y libre de tecnicismos intimidantes.

2. **🔧 Nivel Práctico (Vida real / Oficios / Autonomía)**:
   - Foco en *cómo se arregla*, *cómo se detecta* y *qué hacer en una situación real*.
   - Ejemplos: desatascar un sifón, comprobar un magnetotérmico, reclamar la fianza de alquiler en plazo o revisar un lunar sospechoso.

3. **🎓 Nivel Avanzado / Universitario (Rigor y Especialidad)**:
   - Foco en *por qué ocurre a nivel fundamental*.
   - Formulación matemática, leyes de la termodinámica, artículos legislativos (LAU, Estatuto de los Trabajadores), bioquímica dermatológica y tensores relativistas.

---

## 3. CATÁLOGO DE PLANTILLAS UNIVERSALES Y DOMINIOS CUBIERTOS

| Plantilla Arquetípica | Casos de Ejemplo Demostrados | Campos que Cubre en VEYA |
| :--- | :--- | :--- |
| **1. Fraccionador y Proporciones** | • Suma visual de fracciones ($1/2 + 1/3 = 5/6$ con MCM)<br>• Regla financiera 50/30/20 y cálculo de IVA/descuentos | **Matemáticas y Finanzas:** Quebrados, fracciones impropias, porcentajes de compras, interés simple/compuesto, dosificación de mezclas. |
| **2. Circuitos y Flujos de Sistemas** | • *Electricidad:* Circuito con interruptor, resistencia y Ley de Ohm ($I = V/R$)<br>• *Fontanería:* Lavabo con sifón y sello hidráulico anti-olores | **Oficios y Vivienda:** Cuadro eléctrico, magnetotérmicos, presión hidráulica, llaves de paso, pérdidas de carga y circuitos cerrados. |
| **3. Ciclos Mecánicos y Temporales** | • Motor de 4 tiempos (Admisión, Compresión, Explosión, Escape con pistón móvil y válvulas) | **Automoción e Ingeniería:** Mecánica de vehículos, transmisión, frenos hidráulicos, turbinas y motores eléctricos. |
| **4. Árbol de Decisión y Garantías** | • Fianza de alquiler (plazo de 30 días, Art. 36 LAU)<br>• Garantía de 3 años en compras<br>• Despido laboral (20 días de plazo) | **Derecho y Ciudadanía:** Derechos del inquilino, reclamaciones de consumo, contratos de trabajo, herencias y recursos administrativos. |
| **5. Corte por Capas y Anatomía** | • Piel humana (Epidermis, dermis, hipodermis)<br>• Regla ABCD del melanoma (Asimetría, Bordes, Color, Diámetro) | **Salud y Medicina:** Dermatología y prevención del cáncer de piel, anatomía celular, capas geológicas de la Tierra y atmósfera. |
| **6. Sistemas Orbitales y Mareas** | • Mareas vivas (sizigia) vs muertas (cuadratura)<br>• Telemetría orbital de la ISS a 27.600 km/h<br>• 3ª Ley de Kepler | **Astrofísica y Cosmología:** Rotación terrestre, estaciones, gravitación universal, dilatación temporal de la Relatividad de Einstein. |
| **7. Simulador Cinético de Partículas** | • Partículas de gas elásticas en contenedor con émbolo ($P \cdot V = n \cdot R \cdot T$) | **Física y Química:** Teoría cinética de los gases, presión de vapor, difusión, reacciones químicas y colisiones moleculares. |
| **8. Distribución y Probabilidad** | • Tablero de Galton (caída estocástica 50/50 formando la Campana de Gauss) | **Estadística y Genética:** Teorema Central del Límite, sesgos muestrales, cuadros de Punnett de herencia genética mendeliana. |
| **9. Modelo Conductual y Asertividad** | • Técnica DESC (Describir hechos, Expresar emoción, Sugerir cambio, Concretar beneficio) | **Habilidades Sociales:** Comunicación no violenta, resolución de conflictos de pareja o trabajo, decir «no» sin culpa, negociación. |
| **10. Frontera de Decisión y Vectores** | • Perceptrón simple: cómo una neurona artificial ajusta sus pesos ($w_1, w_2, b$) para separar datos | **Tecnología e Inteligencia Artificial:** Machine Learning, redes neuronales, cómo clasifica un algoritmo sin magia humana. |

---

## 4. INTEGRACIÓN TÉCNICA EN ANDROID (JETPACK COMPOSE & M3)

### 4.1. Modelo de Datos Unificado (`UniversalBlackboardModels.kt`)
```kotlin
package personal.veya.ui.blackboard

enum class PedagogicalLevel {
    COTIDIANO,      // Intuitivo para jóvenes o público general
    PRACTICO,       // Resolución de problemas del hogar/oficio
    UNIVERSITARIO   // Rigor académico, fórmulas y artículos
}

sealed interface UniversalBlackboardModel {
    data class FractionsMath(
        val numeratorA: Int = 1,
        val denominatorA: Int = 2,
        val numeratorB: Int = 1,
        val denominatorB: Int = 3,
        val operation: MathOp = MathOp.ADD
    ) : UniversalBlackboardModel

    data class HomeCircuits(
        val subMode: CircuitMode = CircuitMode.ELECTRIC,
        val voltage: Int = 12,
        val resistance: Int = 4,
        val isSwitchClosed: Boolean = true,
        val hasWaterSeal: Boolean = true
    ) : UniversalBlackboardModel

    data class AutomotiveEngine(
        val strokeIndex: Int = 0,
        val isPlaying: Boolean = true,
        val rpm: Int = 1200
    ) : UniversalBlackboardModel

    data class PracticalLaw(
        val legalDomain: LegalDomain = LegalDomain.RENTAL_DEPOSIT,
        val dayCount: Int = 31
    ) : UniversalBlackboardModel

    data class SkinHealth(
        val selectedAbcdRule: AbcdRule = AbcdRule.ASYMMETRY,
        val showDermisLayers: Boolean = false
    ) : UniversalBlackboardModel

    data class BehavioralSkills(
        val descStepIndex: Int = 0,
        val scenario: ConflictScenario = ConflictScenario.LATENESS
    ) : UniversalBlackboardModel

    data class AiNeuralConcept(
        val weight1: Float = 1.2f,
        val weight2: Float = -0.8f,
        val bias: Float = 0.0f
    ) : UniversalBlackboardModel
}

enum class MathOp { ADD, SUBTRACT }
enum class CircuitMode { ELECTRIC, PLUMBING }
enum class LegalDomain { RENTAL_DEPOSIT, CONSUMER_WARRANTY, DISMISSAL }
enum class AbcdRule { ASYMMETRY, BORDERS, COLOR, DIAMETER }
```

### 4.2. Renderizado de Componentes en Compose
Cada plantilla se implementa como un `@Composable` ligero con aceleración gráfica:
* `FractionsCanvas`: Dibuja barras segmentadas con animación suave de partición usando `Modifier.drawBehind`.
* `EngineCylinderCanvas`: Dibuja cilindro, pistón con movimiento sinusoidal ligado al ángulo de cigüeñal y válvulas móviles.
* `LawDecisionTree`: Tarjetas interactivas M3 con pasos secuenciales (`OutlinedCard` y `LinearProgressIndicator`).
* `SkinAbcdComparator`: Comparador visual de lunares benignos vs sospechosos con gradientes de color reales.

---

## 5. PROPUESTAS (MARCADAS SEGÚN REGLA FIRME)

* **«PROPUESTA 1 — Selector de Nivel en la Cabecera de Conversar»**:  
  Permitir que el usuario fije su nivel de preferencia general (`Cotidiano`, `Práctico` o `Avanzado`) en Ajustes, para que VEYA adapte automáticamente la profundidad de sus explicaciones tanto orales como visuales sin tener que cambiarlo a mano en cada pizarra.

* **«PROPUESTA 2 — Asistente de Diagnóstico Doméstico Guiado»**:  
  Un modo interactivo donde VEYA formula 3 preguntas («*¿El grifo gotea o la tubería hace ruido?*», «*¿El diferencial salta solo de noche o al encender el horno?*») y resalta en la pizarra la pieza exacta causante de la avería.

* **«PROPUESTA 3 — Modo Autoexamen Preventivo de Salud»**:  
  Una lista de verificación interactiva mensual donde VEYA recuerda amablemente revisar lunares en la espalda y brazos con la regla ABCD, con registro de fechas almacenado estrictamente en la Bóveda local cifrada.
