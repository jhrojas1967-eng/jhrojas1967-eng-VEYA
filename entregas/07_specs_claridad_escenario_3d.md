# VEYA — Especificación Técnica: Iluminación de Escenario 3D & Modo "Claridad"
## Sistema de Puesta en Escena Óptica, Sombra de Suelo y Partículas Atmosféricas

Este documento define la física de iluminación tridimensional, el sombreado de contacto en suelo y la atmósfera de partículas que dan a VEYA su presencia táctil y volumétrica ("Pixar / Disney 3D"), evitando el aspecto plano de los avatares vectoriales convencionales.

---

## 1. El Concepto de Escenario Tridimensional (The Stage)

El Avatar no flota en un vacío abstracto 2D; habita en un **estudio óptico iluminado** compuesto por 4 planos de profundidad:

```text
    [ LUZ CENITAL KEYLIGHT (45º Izq, 6500K) ]
                      │
                      ▼
 ┌─────────────────────────────────────────────┐
 │ PLANO 0: Partículas Profundas (Fondo)       │ <- 13 motas con blur 2px y baja opacidad (20%)
 │                                             │
 │ PLANO 1: Halo de Dispersión Atmosférica     │ <- Aura posterior de 390px
 │                                             │
 │ PLANO 2: Cuerpo Volumétrico VEYA (Centro)    │ <- Esfera de porcelana 260px con SSS
 │   - Capa Especular Vítrea (Rim Glass)       │
 │   - Ojos Obsidian con Doble Catchlight      │
 │   - Núcleo de Luz Pulsante (Latido)         │
 │                                             │
 │ PLANO 3: Sombra de Contacto en Suelo (Floor)│ <- Elipse difusa reactiva a la flotación en Y
 │                                             │
 │ PLANO 4: Partículas Frontales (Foreground)  │ <- 13 motas nítidas en órbita browniana
 └─────────────────────────────────────────────┘
```

---

## 2. Especificación de Iluminación y Sombreado

### A. Keylight Cenital (Luz Principal de Modelado)
* **Vector de incidencia:** $L = (-0.45, -0.65, 0.60)$ normalizado (proviniendo de la esquina superior izquierda a $45^\circ$).
* **Temperatura de color:** $6500\text{ K}$ (Luz día pura `#FFFFFF` con tinte celeste suave `#F0F9FF`).
* **Punto focal especular:** Coordenadas relativas en el orbe: $X = -70\text{ px}, Y = -80\text{ px}$.
* **Gradiente de modelado radial (Subsurface Scattering - SSS):**
  1. $0.00 \to \text{Highlight Puro: } \text{rgba}(255, 255, 255, 1.0)$
  2. $0.25 \to \text{Borde Translúcido: } \text{Mood.rim}$
  3. $0.65 \to \text{Dispersión Subsuperficial (SSS): } \text{Mood.sss}$
  4. $1.00 \to \text{Sombra de Masa Base: } \text{Mood.core}$

### B. Rim Light Perimetral (Contraluz Vítreo)
* **Función:** Despegar visualmente al Avatar del fondo oscuro o claro, simulando el borde de cristal satinado de un objeto de coleccionista.
* **Trazo:** Ancho de $3.5\text{ px}$ con caída de opacidad animada entre $45\%$ y $70\%$ sincrónica con la respiración.
* **Color:** Blanco puro `#FFFFFF` en modo normal, tintado al color de acento del Mood en estados activos.

---

## 3. Sombra de Contacto en el Suelo (`Contact Shadow Floor`)

Para anclar el orbe en el espacio tridimensional y reforzar la sensación de flotación gravitatoria:

### Ecuación de Deformación en Contrafase:
A medida que el avatar flota hacia arriba en el eje Y ($Y: 250 \to 244$), la sombra en el suelo debe:
1. **Reducir su tamaño** (por ley de perspectiva y divergencia lumínica).
2. **Difuminarse más y perder opacidad**.

Cuando el avatar desciende ($Y: 244 \to 250$), la sombra:
1. **Aumenta de tamaño**.
2. **Aumenta su densidad y nitidez**.

```kotlin
// Parámetros canónicos de la Sombra de Suelo
val shadowWidth = 180.dp * (1.0f - (floatOffset * 0.05f))
val shadowHeight = 24.dp * (1.0f - (floatOffset * 0.08f))
val shadowAlpha = 0.25f * (1.0f - (floatOffset * 0.12f))
val shadowBlurRadius = 18.dp + (floatOffset * 4.dp)
```

* **Gradiente de la Sombra:** Radial de negro neutro con $35\%$ de opacidad en el centro hacia transparente en el radio exterior.

---

## 4. Atmósfera de Micro-Partículas Bioluminiscentes (26 Motas)

El escenario incluye un sistema determinista de 26 partículas suspendidas que reaccionan a la proximidad del orbe:

* **Cantidad:** 26 partículas (13 en capa de fondo, 13 en primer plano).
* **Física:** Movimiento browniano guiado por osciladores armónicos en senos y cosenos:
  $$x(t) = x_0 + \cos(\omega_i t + \phi_i) \cdot R_i$$
  $$y(t) = y_0 + \sin(0.7 \omega_i t + \psi_i) \cdot R_i$$
* **Radio:** $1.2\text{ px} \to 2.8\text{ px}$.
* **Opacidad:** $0.15 \to 0.70$ con pulsación de centelleo.
* **Color:** Heredado del color SSS del Mood activo (`#38BDF8` en Sereno, `#FBBF24` en Animado).

---

## 5. Modo "Claridad" (Light Stage) vs Modo "Obsidian" (Dark Stage)

El avatar está calibrado para mantener contraste superior a $4.5:1$ tanto en fondos claros como oscuros:

| Parámetro Óptico | Modo Oscuro (Obsidian Stage) | Modo Claro (Claridad / Light Stage) |
| :--- | :--- | :--- |
| **Color de Fondo** | `#0B1522` a `#101826` | `#F4F8FB` a `#FFFFFF` |
| **Opacidad de Sombra Suelo**| $40\%$ (Penumbra suave) | $18\%$ (Sombra suave de porcelana) |
| **Núcleo Interno (Soul)** | Alta emisión lumínica ($65\%$) | Emisión balanceada ($45\%$) |
| **Partículas Bioluminiscentes** | Altamente visibles con brillo | Translúcidas, efecto motas de luz diurna |
| **Pupilas Ojos Obsidian** | `#0B1522` con halo zafiro | `#0B1522` con halo gris pizarra pulido |
| **Contraste de Reborde** | Rim light blanco puro brillante | Rim light con matiz perimetral de contraste |
