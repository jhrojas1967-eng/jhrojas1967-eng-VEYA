import React, { useState, useEffect, useRef } from 'react';
import {
  PieChart,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  RotateCcw,
  Zap,
  Activity,
  ChevronRight,
  TrendingUp,
  Maximize2,
  Atom,
} from 'lucide-react';
import { PedagogicalLevel } from '../../types';

interface ToolGeoGebraWolframProps {
  level: PedagogicalLevel;
}

type MathSubView =
  | 'geogebra_grapher'  // GeoGebra Dynamic Function Plotter & Tangent / Integral
  | 'wolfram_fractions' // WolframAlpha Step-by-Step Fraction Solver & MCM
  | 'wolfram_quadratic' // WolframAlpha Quadratic Equation & Discriminant Step-by-Step
  | 'wolfram_gas_laws'  // WolframAlpha Thermodynamics & Ideal Gas Law (PV = nRT)
  | 'wolfram_circuits'; // WolframAlpha Electric Circuits & Ohm's Law (V = I * R)

export const ToolGeoGebraWolfram: React.FC<ToolGeoGebraWolframProps> = ({ level }) => {
  const [subView, setSubView] = useState<MathSubView>('geogebra_grapher');

  // =========================================================================
  // GEOGEBRA GRAPHER STATE
  // =========================================================================
  const [funcType, setFuncType] = useState<'quadratic' | 'sine' | 'cubic' | 'exponential'>('quadratic');
  const [paramA, setParamA] = useState<number>(1);
  const [paramB, setParamB] = useState<number>(0);
  const [paramC, setParamC] = useState<number>(-2);
  const [tangentX, setTangentX] = useState<number>(1);
  const [integralA, setIntegralA] = useState<number>(-1);
  const [integralB, setIntegralB] = useState<number>(2);
  const [showTangent, setShowTangent] = useState<boolean>(true);
  const [showIntegral, setShowIntegral] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Evaluate function and its derivative
  const evalFunc = (x: number): number => {
    switch (funcType) {
      case 'quadratic':
        return paramA * x * x + paramB * x + paramC;
      case 'sine':
        return paramA * Math.sin(paramB * x + paramC);
      case 'cubic':
        return paramA * Math.pow(x, 3) + paramB * x + paramC;
      case 'exponential':
        return paramA * Math.exp(paramB * x * 0.5) + paramC;
      default:
        return 0;
    }
  };

  const evalDerivative = (x: number): number => {
    const h = 0.0001;
    return (evalFunc(x + h) - evalFunc(x - h)) / (2 * h);
  };

  // Canvas drawing loop for GeoGebra Grapher
  useEffect(() => {
    if (subView !== 'geogebra_grapher') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Coordinate mapping: center is (width/2, height/2)
    // Scale: 30 pixels per unit
    const scale = 28;
    const originX = width / 2;
    const originY = height / 2;

    const toScreenX = (x: number) => originX + x * scale;
    const toScreenY = (y: number) => originY - y * scale;
    const toMathX = (px: number) => (px - originX) / scale;

    // Draw Grid
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let x = -10; x <= 10; x++) {
      ctx.beginPath();
      ctx.moveTo(toScreenX(x), 0);
      ctx.lineTo(toScreenX(x), height);
      ctx.stroke();
    }
    for (let y = -8; y <= 8; y++) {
      ctx.beginPath();
      ctx.moveTo(0, toScreenY(y));
      ctx.lineTo(width, toScreenY(y));
      ctx.stroke();
    }

    // Draw Axes X and Y
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis numbers
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px monospace';
    for (let x = -8; x <= 8; x += 2) {
      if (x !== 0) ctx.fillText(x.toString(), toScreenX(x) - 4, originY + 12);
    }
    for (let y = -6; y <= 6; y += 2) {
      if (y !== 0) ctx.fillText(y.toString(), originX + 5, toScreenY(y) + 4);
    }

    // Draw Integral Area (Riemann area) if enabled
    if (showIntegral && integralA < integralB) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.moveTo(toScreenX(integralA), originY);
      for (let px = toScreenX(integralA); px <= toScreenX(integralB); px += 2) {
        const mx = toMathX(px);
        const my = evalFunc(mx);
        ctx.lineTo(px, toScreenY(my));
      }
      ctx.lineTo(toScreenX(integralB), originY);
      ctx.closePath();
      ctx.fill();
    }

    // Draw Function Curve
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= width; px += 2) {
      const mx = toMathX(px);
      const my = evalFunc(mx);
      const py = toScreenY(my);
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw Tangent Line at tangentX
    if (showTangent) {
      const tY = evalFunc(tangentX);
      const slope = evalDerivative(tangentX);

      // Tangent line: y - tY = slope * (x - tangentX) => y = slope * (x - tangentX) + tY
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const x1 = tangentX - 4;
      const y1 = slope * (x1 - tangentX) + tY;
      const x2 = tangentX + 4;
      const y2 = slope * (x2 - tangentX) + tY;
      ctx.moveTo(toScreenX(x1), toScreenY(y1));
      ctx.lineTo(toScreenX(x2), toScreenY(y2));
      ctx.stroke();

      // Tangent Point Marker
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(toScreenX(tangentX), toScreenY(tY), 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [subView, funcType, paramA, paramB, paramC, tangentX, integralA, integralB, showTangent, showIntegral]);

  // =========================================================================
  // WOLFRAM FRACTIONS SOLVER STATE
  // =========================================================================
  const [num1, setNum1] = useState(1);
  const [den1, setDen1] = useState(2);
  const [num2, setNum2] = useState(1);
  const [den2, setDen2] = useState(3);
  const [fracOp, setFracOp] = useState<'+' | '-' | '×' | '÷'>('+');

  const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const lcm = (a: number, b: number): number => Math.abs((a * b) / (gcd(a, b) || 1));

  let resNum = 0;
  let resDen = 1;
  let stepDetails: string[] = [];

  if (fracOp === '+' || fracOp === '-') {
    const commonDen = lcm(den1, den2);
    const eqNum1 = num1 * (commonDen / den1);
    const eqNum2 = num2 * (commonDen / den2);
    resNum = fracOp === '+' ? eqNum1 + eqNum2 : eqNum1 - eqNum2;
    resDen = commonDen;
    stepDetails = [
      `1. Hallar el Mínimo Común Múltiplo de los denominadores (${den1} y ${den2}): MCM = ${commonDen}`,
      `2. Amplificar primera fracción: (${num1} × ${commonDen / den1}) / (${den1} × ${commonDen / den1}) = ${eqNum1}/${commonDen}`,
      `3. Amplificar segunda fracción: (${num2} × ${commonDen / den2}) / (${den2} × ${commonDen / den2}) = ${eqNum2}/${commonDen}`,
      `4. Operar numeradores con igual denominador: ${eqNum1} ${fracOp} ${eqNum2} = ${resNum}`,
    ];
  } else if (fracOp === '×') {
    resNum = num1 * num2;
    resDen = den1 * den2;
    stepDetails = [
      `1. Multiplicar numeradores entre sí: ${num1} × ${num2} = ${resNum}`,
      `2. Multiplicar denominadores entre sí: ${den1} × ${den2} = ${resDen}`,
    ];
  } else {
    // Division
    resNum = num1 * den2;
    resDen = den1 * num2;
    stepDetails = [
      `1. Multiplicación cruzada: (${num1} × ${den2}) / (${den1} × ${num2})`,
      `2. Numerador resultante: ${resNum}, Denominador resultante: ${resDen}`,
    ];
  }

  const commonGcd = gcd(resNum, resDen);
  const simpNum = resNum / (commonGcd || 1);
  const simpDen = resDen / (commonGcd || 1);
  const decimalVal = (resNum / (resDen || 1)).toFixed(3);

  // =========================================================================
  // WOLFRAM QUADRATIC SOLVER STATE
  // =========================================================================
  const [qA, setQA] = useState(1);
  const [qB, setQB] = useState(-5);
  const [qC, setQC] = useState(6);

  const discriminant = qB * qB - 4 * qA * qC;
  let root1Str = '';
  let root2Str = '';
  if (discriminant > 0) {
    const r1 = (-qB + Math.sqrt(discriminant)) / (2 * qA);
    const r2 = (-qB - Math.sqrt(discriminant)) / (2 * qA);
    root1Str = `x₁ = ${r1.toFixed(2)}`;
    root2Str = `x₂ = ${r2.toFixed(2)}`;
  } else if (discriminant === 0) {
    const r = -qB / (2 * qA);
    root1Str = `x₁ = x₂ = ${r.toFixed(2)} (Raíz doble)`;
  } else {
    const realPart = (-qB / (2 * qA)).toFixed(2);
    const imagPart = (Math.sqrt(-discriminant) / (2 * qA)).toFixed(2);
    root1Str = `x₁ = ${realPart} + ${imagPart}i`;
    root2Str = `x₂ = ${realPart} - ${imagPart}i (Raíces complejas)`;
  }

  return (
    <div className="bg-[#0A0F1D] border border-slate-800 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-3 text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 flex items-center justify-center">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Laboratorio Matemático y Computacional VEYA
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                GEOGEBRA & WOLFRAM ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Graficador dinámico, tangentes, integrales y resolución computacional paso a paso
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'geogebra_grapher', label: '📈 GeoGebra: Graficador y Cálculo' },
          { id: 'wolfram_fractions', label: '🍕 Wolfram: Quebrados y MCM' },
          { id: 'wolfram_quadratic', label: '🧮 Wolfram: Ecuación Cuadrática' },
          { id: 'wolfram_gas_laws', label: '⚛️ Wolfram: Ley de Gases (PV=nRT)' },
          { id: 'wolfram_circuits', label: '⚡ Wolfram: Ley de Ohm (V=I·R)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubView(tab.id as MathSubView)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              subView === tab.id
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950/50 scale-[1.02]'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* =====================================================================
          SUB-VIEW 1: GEOGEBRA GRAPHER & CALCULUS STUDIO
          ===================================================================== */}
      {subView === 'geogebra_grapher' && (
        <div className="flex flex-col gap-3">
          {/* Function Selector & Parameter Controls */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Tipo de Función:</span>
                {[
                  { id: 'quadratic', label: 'Parábola (ax² + bx + c)' },
                  { id: 'sine', label: 'Onda Seno (A·sin(ωx + φ))' },
                  { id: 'cubic', label: 'Cúbica (ax³ + bx + c)' },
                  { id: 'exponential', label: 'Exponencial (a·e^kx)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFuncType(f.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      funcType === f.id
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Tools toggles */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setShowTangent(!showTangent)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    showTangent ? 'bg-rose-900/60 border border-rose-700 text-rose-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {showTangent ? 'Tangente f\'(x) ON' : 'Activar Tangente'}
                </button>
                <button
                  onClick={() => setShowIntegral(!showIntegral)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    showIntegral ? 'bg-sky-900/60 border border-sky-700 text-sky-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {showIntegral ? 'Área Integral ON' : 'Activar Integral'}
                </button>
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 font-bold">Parámetro A: {paramA}</span>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.2"
                  value={paramA}
                  onChange={(e) => setParamA(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 font-bold">Parámetro B: {paramB}</span>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.5"
                  value={paramB}
                  onChange={(e) => setParamB(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 font-bold">Parámetro C: {paramC}</span>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={paramC}
                  onChange={(e) => setParamC(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800"
                />
              </div>
            </div>

            {/* Tangent location slider */}
            {showTangent && (
              <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-rose-400 font-bold whitespace-nowrap">Punto de Tangencia x₀:</span>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.1"
                  value={tangentX}
                  onChange={(e) => setTangentX(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 h-1 bg-slate-800"
                />
                <span className="font-mono text-rose-300 font-bold">{tangentX.toFixed(1)}</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  f'({tangentX.toFixed(1)}) = {evalDerivative(tangentX).toFixed(2)} (Pendiente m)
                </span>
              </div>
            )}
          </div>

          {/* HTML5 High-Resolution GeoGebra Canvas */}
          <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={640}
              height={320}
              className="w-full h-full object-contain"
            />
          </div>

          {/* GeoGebra Educational Insight */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {level === 'cotidiano' && (
              <p>
                <strong>¿Qué es una función y qué representa la línea roja?</strong> La curva azul describe una trayectoria (como una pelota lanzada al aire). La línea roja es la tangente: muestra exactamente hacia dónde se dirige la pelota en ese instante exacto. Si la pendiente es positiva, está subiendo; si es plana (m = 0), está en el punto más alto.
              </p>
            )}
            {level === 'practico' && (
              <p>
                <strong>Aplicación en ingeniería y economía:</strong> La derivada $f'(x)$ representa el coste marginal en economía o la velocidad instantánea en automoción ($v(t) = s'(t)$). La integral bajo la curva representa la distancia total recorrida o el consumo acumulado de combustible.
              </p>
            )}
            {level === 'universitario' && (
              <p>
                <strong>Cálculo infinitesimal riguroso:</strong> La derivada se define formalmente como f'(x) = lim(h→0) [f(x+h) - f(x)] / h. El área bajo la curva corresponde a la integral de Riemann ∫[a,b] f(x)dx = lim(n→∞) Σ f(x_i*)·Δx, vinculada analíticamente a través del Teorema Fundamental del Cálculo.
              </p>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 2: WOLFRAM FRACTIONS & STEP-BY-STEP LCM SOLVER
          ===================================================================== */}
      {subView === 'wolfram_fractions' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🍕</span>
                <h4 className="text-xs font-bold text-white">
                  WolframAlpha: Calculador Paso a Paso de Quebrados y Fracciones
                </h4>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                DESCOMPOSICIÓN ALGEBRAICA
              </span>
            </div>

            {/* Input Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              {/* Fraction 1 */}
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={num1}
                  onChange={(e) => setNum1(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center bg-slate-900 border border-slate-700 rounded p-1 text-white font-mono font-bold"
                />
                <div className="w-14 h-0.5 bg-slate-600 my-1" />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={den1}
                  onChange={(e) => setDen1(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center bg-slate-900 border border-slate-700 rounded p-1 text-white font-mono font-bold"
                />
              </div>

              {/* Operator */}
              <div className="flex items-center gap-1">
                {(['+', '-', '×', '÷'] as const).map((op) => (
                  <button
                    key={op}
                    onClick={() => setFracOp(op)}
                    className={`w-8 h-8 rounded-lg font-mono font-bold text-sm transition-all ${
                      fracOp === op ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>

              {/* Fraction 2 */}
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={num2}
                  onChange={(e) => setNum2(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center bg-slate-900 border border-slate-700 rounded p-1 text-white font-mono font-bold"
                />
                <div className="w-14 h-0.5 bg-slate-600 my-1" />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={den2}
                  onChange={(e) => setDen2(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center bg-slate-900 border border-slate-700 rounded p-1 text-white font-mono font-bold"
                />
              </div>

              <span className="text-xl font-bold text-slate-400">=</span>

              {/* Result Preview */}
              <div className="flex flex-col items-center p-2 rounded-xl bg-cyan-950/60 border border-cyan-800">
                <span className="text-base font-bold font-mono text-cyan-300">
                  {simpNum} / {simpDen}
                </span>
                <span className="text-[10px] font-mono text-slate-400">≈ {decimalVal}</span>
              </div>
            </div>

            {/* Wolfram Step-by-Step Breakdown */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Desglose Paso a Paso (Wolfram Style):
              </span>
              <div className="space-y-1.5 text-xs text-slate-300">
                {stepDetails.map((step, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 font-mono">
                    {step}
                  </div>
                ))}
                {commonGcd > 1 && (
                  <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-800 font-mono text-emerald-300">
                    5. Simplificación final: dividir numerador y denominador entre MCD ({commonGcd}) = {simpNum}/{simpDen}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 3: WOLFRAM QUADRATIC EQUATION STEP-BY-STEP
          ===================================================================== */}
      {subView === 'wolfram_quadratic' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🧮</span>
                <h4 className="text-xs font-bold text-white">
                  WolframAlpha: Ecuación Cuadrática y Discriminante
                </h4>
              </div>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800">
                FÓRMULA DE BHASKARA
              </span>
            </div>

            {/* Coefficients inputs */}
            <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-300">a:</span>
                <input
                  type="number"
                  value={qA}
                  onChange={(e) => setQA(parseInt(e.target.value) || 1)}
                  className="w-14 text-center bg-slate-900 border border-slate-700 rounded p-1 text-white font-mono font-bold"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-300">b:</span>
                <input
                  type="number"
                  value={qB}
                  onChange={(e) => setQB(parseInt(e.target.value) || 0)}
                  className="w-14 text-center bg-slate-900 border border-slate-700 rounded p-1 text-white font-mono font-bold"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-300">c:</span>
                <input
                  type="number"
                  value={qC}
                  onChange={(e) => setQC(parseInt(e.target.value) || 0)}
                  className="w-14 text-center bg-slate-900 border border-slate-700 rounded p-1 text-white font-mono font-bold"
                />
              </div>
              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-800 font-mono text-purple-200 font-bold">
                {qA}x² {qB >= 0 ? `+ ${qB}` : `- ${Math.abs(qB)}`}x {qC >= 0 ? `+ ${qC}` : `- ${Math.abs(qC)}`} = 0
              </div>
            </div>

            {/* Discriminant and Steps */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
              <span className="text-xs font-bold text-purple-400">
                Paso a Paso de la Resolución:
              </span>
              <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  1. Calcular el discriminante: Δ = b² - 4ac = ({qB})² - 4·({qA})·({qC}) = {qB * qB} - {4 * qA * qC} = <strong>{discriminant}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  2. Naturaleza de las raíces: {discriminant > 0 ? 'Δ > 0 → Dos raíces reales distintas.' : discriminant === 0 ? 'Δ = 0 → Raíz real doble.' : 'Δ < 0 → Dos raíces complejas conjugadas.'}
                </div>
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-800 text-purple-200 font-bold">
                  3. Soluciones finales: {root1Str} | {root2Str}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 4: WOLFRAM GAS LAWS & THERMODYNAMICS
          ===================================================================== */}
      {subView === 'wolfram_gas_laws' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white">
                  Termodinámica: Ecuación de Estado de los Gases Ideales (P·V = n·R·T)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800">
                R = 0.08206 atm·L/(mol·K)
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
              <p>
                <strong>Teoría Cinética Molecular:</strong> La presión que ejerce un gas sobre las paredes del recipiente se debe a los miles de millones de choques elásticos por segundo de sus moléculas. Si aumentas la temperatura (energía cinética media), las partículas se mueven más rápido y chocan con mayor violencia.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 5: WOLFRAM CIRCUITS & OHM'S LAW
          ===================================================================== */}
      {subView === 'wolfram_circuits' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white">
                  Electricidad: Ley de Ohm y Potencia Eléctrica
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800">
                V = I · R | P = V · I
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
              <p>
                <strong>Analogía hidráulica para recordar siempre:</strong> El Voltaje (V) es la presión del agua en la tubería; la Resistencia (R) es el estrechamiento de la manguera; la Intensidad (I) es el caudal de litros de agua por segundo; y la Potencia (P) es la fuerza con la que golpea el chorro para mover una turbina.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
