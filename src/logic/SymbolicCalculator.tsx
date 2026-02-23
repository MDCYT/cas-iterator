import { useState, useRef, useRef as useReactRef } from "react";
import { useLanguage } from "./LanguageContext";
import { translations } from "../translations";
import { parseExpr } from "../symbolic/parser";
import { stringifyMath } from "../symbolic/stringify";
import { composeAST } from "../symbolic/composeAST";
import { simplifyAST } from "../symbolic/simplifyAST";
import { MathTex } from "./MathTex";
  import { FUNC_TOOLTIPS } from "../translations";

function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
}

const FUNC_PAD = [
  "sin", "cos", "tan", "log", "ln", "exp", "abs"
];

const PAD_TOOLTIPS = {
  en: {
    x: {
      title: "Variable x",
      desc: "The input variable for your function.",
      context: "Represents the value being transformed.",
      example: "f(x) = x + 1"
    },
    PI: {
      title: "Constant π (PI)",
      desc: "The ratio of a circle's circumference to its diameter.",
      context: "Useful for trigonometry and geometry.",
      example: "π ≈ 3.14159"
    },
    TAU: {
      title: "Constant τ (TAU)",
      desc: "Tau is 2π, a full circle in radians.",
      context: "Useful for periodic functions.",
      example: "τ = 2π ≈ 6.28318"
    },
    E: {
      title: "Constant e",
      desc: "Euler's number, base of natural logarithms.",
      context: "Useful for exponential growth/decay.",
      example: "e ≈ 2.71828"
    },
    ".": {
      title: "Decimal point",
      desc: "The amazing separation between decimals and integers!",
      context: "Use to enter decimal numbers.",
      example: "3.14"
    },
    "√": {
      title: "Square root",
      desc: "Returns the square root of x.",
      context: "Useful for roots and radicals.",
      example: "sqrt(9) -> 3"
    },
    "∛": {
      title: "Cube root",
      desc: "Returns the cube root of x.",
      context: "Useful for roots and radicals.",
      example: "root(3,8) -> 2"
    },
    "^": {
      title: "Exponentiation",
      desc: "Raises a number to a power.",
      context: "Use for powers and roots.",
      example: "x^2"
    }
  },
  es: {
    x: {
      title: "Variable x",
      desc: "La variable de entrada para tu función.",
      context: "Representa el valor que se transforma.",
      example: "f(x) = x + 1"
    },
    PI: {
      title: "Constante π (PI)",
      desc: "La razón entre la circunferencia y el diámetro de un círculo.",
      context: "Útil para trigonometría y geometría.",
      example: "π ≈ 3.14159"
    },
    TAU: {
      title: "Constante τ (TAU)",
      desc: "Tau es 2π, un círculo completo en radianes.",
      context: "Útil para funciones periódicas.",
      example: "τ = 2π ≈ 6.28318"
    },
    E: {
      title: "Constante e",
      desc: "Número de Euler, base de los logaritmos naturales.",
      context: "Útil para crecimiento/decadencia exponencial.",
      example: "e ≈ 2.71828"
    },
    ".": {
      title: "Punto decimal",
      desc: "¡La asombrosa separación entre lo decimal y lo entero!",
      context: "Úsalo para ingresar números decimales.",
      example: "3.14"
    },
    "√": {
      title: "Raíz cuadrada",
      desc: "Devuelve la raíz cuadrada de x.",
      context: "Útil para raíces y radicales.",
      example: "sqrt(9) -> 3"
    },
    "∛": {
      title: "Raíz cúbica",
      desc: "Devuelve la raíz cúbica de x.",
      context: "Útil para raíces y radicales.",
      example: "root(3,8) -> 2"
    },
    "^": {
      title: "Potenciación",
      desc: "Eleva un número a una potencia.",
      context: "Úsalo para potencias y raíces.",
      example: "x^2"
    }
  }
};

const pad = [
  "x", "PI", "TAU", "E", "(", ")", "+", "-", "*", "/", "^", "√", "∛",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
  ".", "←", "C"
];

const PAD_ACCENT: Record<string, string> = {
  "C":  "danger",
  "←": "warn",
  "√":  "fn",
  "∛":  "fn",
  "x":  "var",
};

export function SymbolicCalculator() {
  const [formula, setFormula]     = useState("");
  const [iterations, setIterations] = useState(1);
  const [result, setResult]       = useState<any>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const funcTips = FUNC_TOOLTIPS[language];
  const padTips = PAD_TOOLTIPS[language];
  const [tooltip, setTooltip] = useState<{ x: number, y: number, tip: any } | null>(null);
  const padGridRef = useRef<HTMLDivElement>(null);
  const tooltipTimer = useReactRef<NodeJS.Timeout | null>(null);
  const tooltipBtnRef = useRef<HTMLButtonElement | null>(null);

  const mobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  const handlePad = (txt: string) => {
    if (txt === "←") setFormula(f => f.slice(0, -1));
    else if (txt === "C") setFormula("");
    else if (txt === "√") setFormula(f => f + "sqrt(");
    else if (txt === "∛") setFormula(f => f + "root(3,");
    else if (FUNC_PAD.includes(txt)) setFormula(f => f + txt + "(");
    else setFormula(f => f + txt);
  };

  const calculate = () => {
    try {
      const formulaFixed = formula.replace(/\bTAU\b/g, "(PI*2)");
      const base = parseExpr(formulaFixed);
      let current = parseExpr("x");
      const steps: { pretty: string }[] = [];
      for (let i = 0; i < iterations; i++) {
        current = simplifyAST(composeAST(base, current));
        steps.push({ pretty: stringifyMath(current) });
      }
      setResult({ base: { pretty: stringifyMath(base) }, steps });
    } catch (e) {
      setResult({ error: String(e) });
    }
  };

  const compact = mobile;
  const mergedRoot = compact ? { ...styles.root, maxWidth: 600 } : styles.root;
  const mergedPadGrid = compact ? { ...styles.padGrid, gap: 2, marginBottom: 6 } : styles.padGrid;
  const mergedPadBtn = compact ? { ...styles.padBtn, padding: "5px 1px", fontSize: "0.85rem" } : styles.padBtn;
  const mergedFuncPadGrid = compact ? { ...styles.funcPadGrid, gap: 2, marginBottom: 4 } : styles.funcPadGrid;
  const mergedTitleBox = compact ? { ...styles.titleBox, padding: "6px 6px", marginBottom: 8 } : styles.titleBox;
  const mergedInputWrapper = compact ? { ...styles.inputWrapper, marginBottom: 6 } : styles.inputWrapper;
  const mergedInputPrompt = compact ? { ...styles.inputPrompt, padding: "3px 6px", fontSize: "0.8rem" } : styles.inputPrompt;
  const mergedInput = compact ? { ...styles.input, padding: "3px 6px", fontSize: "0.9rem" } : styles.input;
  const mergedNumInput = compact ? { ...styles.numInput, width: 40, padding: "3px 4px", fontSize: "0.9rem" } : styles.numInput;
  const mergedCalcBtn = compact ? { ...styles.calcBtn, padding: "5px 8px", fontSize: "0.9rem" } : styles.calcBtn;

  return (
    <div style={mergedRoot}>
      {/* ── Título ── */}
      <div style={mergedTitleBox}>
        <span style={styles.soul}>♥</span>
        <h1 style={styles.title}>CAS FUNCTION ITERATION</h1>
      </div>

      {/* ── Input de fórmula (solo desktop) ── */}
      {!isMobile() && (
        <div style={mergedInputWrapper}>
          <span style={mergedInputPrompt}>{t.formulaPrompt}</span>
          <input
            style={mergedInput}
            value={formula}
            onChange={e => setFormula(e.target.value)}
            onKeyDown={e => e.key === "Enter" && calculate()}
            placeholder={t.placeholder}
            spellCheck={false}
          />
        </div>
      )}

      {/* ── Mostrar función base en móvil ── */}
      {isMobile() && formula && (
        <div style={styles.baseFormulaMobile}>
          <span style={styles.dimLabel}>{t.baseFormula}&nbsp;</span>
          <MathTex tex={formula} />
        </div>
      )}

      {/* ── Funciones especiales ── */}
      <div style={{ ...mergedFuncPadGrid, position: "relative" }} ref={padGridRef}>
        {FUNC_PAD.map(txt => (
          <button
            key={txt}
            style={{ ...mergedPadBtn, ...styles.padFn }}
            onClick={() => handlePad(txt)}
            onMouseEnter={e => {
              if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
              setTooltip(null);
              tooltipBtnRef.current = e.currentTarget;
              const rect = padGridRef.current?.getBoundingClientRect();
              tooltipTimer.current = setTimeout(() => {
                const btn = tooltipBtnRef.current;
                if (!btn) return;
                setTooltip({
                  x: btn.getBoundingClientRect().left - (rect?.left ?? 0) + btn.offsetWidth / 2,
                  y: btn.getBoundingClientRect().top - (rect?.top ?? 0) - 60,
                  tip: funcTips[txt]
                });
              }, 1000);
            }}
            onMouseLeave={() => {
              if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
              tooltipBtnRef.current = null;
              setTooltip(null);
            }}
          >
            {txt}
          </button>
        ))}
       
      </div>
      {/* ── Teclado ── */}
      <div style={{ ...mergedPadGrid, position: "relative" }}>
        {pad.map(txt => {
          const variant = PAD_ACCENT[txt];
          const tip = padTips[txt];
          return (
            <button
              key={txt}
              style={{
                ...mergedPadBtn,
                ...(variant === "danger" ? styles.padDanger : {}),
                ...(variant === "warn"   ? styles.padWarn   : {}),
                ...(variant === "fn"     ? styles.padFn     : {}),
                ...(variant === "var"    ? styles.padVar    : {}),
              }}
              onMouseEnter={e => {
                if (!tip) return;
                if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
                setTooltip(null);
                tooltipBtnRef.current = e.currentTarget;
                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                tooltipTimer.current = setTimeout(() => {
                  const btn = tooltipBtnRef.current;
                  if (!btn) return;
                  setTooltip({
                    x: btn.getBoundingClientRect().left - (rect?.left ?? 0) + btn.offsetWidth / 2,
                    y: btn.getBoundingClientRect().top - (rect?.top ?? 0) - 60,
                    tip
                  });
                }, 500);
              }}
              onMouseLeave={e => {
                if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
                tooltipBtnRef.current = null;
                setTooltip(null);
              }}
              onClick={() => handlePad(txt)}
            >
              {txt}
            </button>
          );
        })}
        {tooltip && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
              background: "#000",
              color: "#fff",
              border: "3px solid #fff",
              borderRadius: 0,
              padding: "12px 16px 10px 16px",
              minWidth: 220,
              maxWidth: 260,
              zIndex: 100,
              fontFamily: 'DeterminationMono, Share Tech Mono, monospace',
              fontSize: 15,
              pointerEvents: "none",
              boxShadow: "0 2px 12px #000a"
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{tooltip.tip.title}</div>
            <div style={{ marginBottom: 4 }}>{tooltip.tip.desc}</div>
            <div style={{ fontStyle: "italic", marginBottom: 4, color: "#aaa" }}>{tooltip.tip.context}</div>
            <div style={{ fontFamily: 'monospace', background: "#111", border: "1.5px solid #fff", borderRadius: 0, padding: "2px 6px", color: "#fff", fontSize: 14, marginTop: 4 }}>
              {tooltip.tip.example}
            </div>
          </div>
        )}
      </div>

      {/* ── Iteraciones + Calcular ── */}
      <div style={styles.controlRow}>
        <label style={styles.label}>{t.iterations}</label>
        <input
          type="number"
          min={0}
          max={32}
          value={iterations - 1}
          onChange={e => setIterations(Number(e.target.value) + 1)}
          style={mergedNumInput}
        />
        <button
          style={mergedCalcBtn}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
            (e.currentTarget as HTMLButtonElement).style.color = "#000000";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#000000";
            (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
          }}
          onClick={calculate}
        >
          {t.calculate}
        </button>
      </div>

      {/* ── Error ── */}
      {result?.error && (
        <div style={styles.errorBox}>
          <span style={styles.soul}>♥</span> {t.error}: {result.error}
        </div>
      )}

      {/* ── Resultados ── */}
      {result && !result.error && (
        <div style={styles.resultsScrollable}>
          <div style={styles.baseFormula}>
            <span style={styles.dimLabel}>{t.baseFormula}&nbsp;</span>
            <MathTex tex={result.base.pretty} />
          </div>

          <div style={styles.iterHeader}>{t.iterHeader}</div>

          {result.steps.map((step: { pretty: string }, i: number) => (
            <div key={i} style={styles.iterRow}>
              <div style={styles.iterLabel}>
                <span style={styles.soul}>♥</span> {t.iteration} {i + 1}:
              </div>
              <div style={styles.iterMath}>
                <MathTex
                  tex={`f(${i === 0 ? "x" : result.steps[i - 1].pretty}) = ${step.pretty}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const FONT = '"DeterminationMono", "Share Tech Mono", monospace';
const BORDER = "3px solid #ffffff";
const BG = "#000000";
const FG = "#ffffff";
const YELLOW = "#ffdd00";
const RED = "#ff4444";
const BLUE = "#00b0ff";

const styles: Record<string, React.CSSProperties> = {
      funcPadGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 2,
        marginBottom: 4,
      },
    baseFormulaMobile: {
      borderBottom: "2px solid #444",
      paddingBottom: 8,
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 4,
      fontSize: "1.05rem",
      background: "#111",
    },
  root: {
    fontFamily: FONT,
    background: BG,
    color: FG,
    maxWidth: 340,
    margin: "0 auto",
    padding: 12,
    border: BORDER,
    imageRendering: "pixelated",
    WebkitFontSmoothing: "none",
  },

  titleBox: {
    border: BORDER,
    padding: "5px 7px",
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#000",
  },
  title: {
    margin: 0,
    fontSize: "0.95rem",
    letterSpacing: "0.09em",
    color: FG,
    fontFamily: FONT,
  },
  soul: {
    color: RED,
    fontSize: "1.1rem",
    display: "inline-block",
    animation: "soul-bounce 0.8s ease-in-out infinite",
    flexShrink: 0,
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: BORDER,
    marginBottom: 6,
    background: BG,
  },
  inputPrompt: {
    padding: "3px 6px",
    borderRight: BORDER,
    color: YELLOW,
    whiteSpace: "nowrap",
    fontFamily: FONT,
    fontSize: "0.8rem",
  },
  input: {
    flex: 1,
    background: BG,
    color: FG,
    border: "none",
    outline: "none",
    padding: "3px 6px",
    fontFamily: FONT,
    fontSize: "0.9rem",
  },

  padGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 2,
    marginBottom: 6,
  },
  padBtn: {
    background: BG,
    color: FG,
    border: BORDER,
    padding: "4px 1px",
    fontFamily: FONT,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "background 0.07s, color 0.07s",
    borderRadius: 0,
  },
  padDanger: { background: "#330000", color: RED, borderColor: RED },
  padWarn:   { background: "#1a1400", color: YELLOW, borderColor: YELLOW },
  padFn:     { background: "#001a33", color: BLUE, borderColor: BLUE },
  padVar:    { background: "#001a00", color: "#44ff44", borderColor: "#44ff44" },

  controlRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  label: {
    fontFamily: FONT,
    fontSize: "0.9rem",
    letterSpacing: "0.08em",
    color: YELLOW,
  },
  numInput: {
    width: "100%",
    background: BG,
    color: FG,
    border: BORDER,
    padding: "3px 6px",
    fontFamily: FONT,
    fontSize: "0.9rem",
    borderRadius: 0,
    outline: "none",
    MozAppearance: "textfield",
  },
  calcBtn: {
    background: BG,
    color: FG,
    border: BORDER,
    padding: "5px 8px",
    fontFamily: FONT,
    fontSize: "0.9rem",
    cursor: "pointer",
    letterSpacing: "0.1em",
    borderRadius: 0,
    transition: "background 0.07s, color 0.07s",
    marginLeft: "auto",
  },

  errorBox: {
    border: `3px solid ${RED}`,
    color: RED,
    padding: "8px 12px",
    marginBottom: 12,
    fontFamily: FONT,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  resultsScrollable: {
    border: BORDER,
    padding: 6,
    maxHeight: 220,
    overflowY: "auto",
  },
  baseFormula: {
    borderBottom: "2px solid #444",
    paddingBottom: 5,
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    fontSize: "0.95rem",
  },
  dimLabel: {
    color: "#888",
    fontFamily: FONT,
  },
  iterHeader: {
    color: YELLOW,
    letterSpacing: "0.1em",
    marginBottom: 5,
    fontSize: "0.8rem",
    fontFamily: FONT,
  },
  iterRow: {
    borderLeft: `3px solid #444`,
    paddingLeft: 7,
    marginBottom: 7,
  },
  iterLabel: {
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    color: "#aaa",
    marginBottom: 2,
    fontFamily: FONT,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  iterMath: {
    fontSize: "0.95rem",
  },
};