import bunLogo from '../assets/images/logo.svg';
import reactLogo from '../assets/images/react.svg';
import tobee from '../assets/images/Annoying_Dog.webp';
import { TransFlag } from './TransFlag';
import React from "react";
import { useLanguage } from "../logic/LanguageContext";
import { translations } from "../translations";
import {version} from "../../package.json";

const FONT = '"DeterminationMono", "Share Tech Mono", monospace';
const BORDER = "3px solid #ffffff";
const BG = "#000000";
const FG = "#ffffff";
const YELLOW = "#ffdd00";
const RED = "#ff4444";
const PINK = "#ff69b4";
const BLUE = "#00b0ff";

export function CreditsMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  if (!open) return null;

  return (
    <>
      {/* Keyframes inyectados inline para que funcionen siempre, creo?, no se */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0px); }
          20%       { transform: translateY(-6px); }
          40%       { transform: translateY(0px); }
        }
        @keyframes soul-bounce {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes blink-cursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>

      {/* Overlay oscuro !! */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 49,
          background: "rgba(0,0,0,0.6)",
        }}
      />

      {/* Panel de créditos */}
      <div style={{
        position: "fixed",
        bottom: 96,
        right: 24,
        zIndex: 50,
        background: BG,
        border: BORDER,
        fontFamily: FONT,
        color: FG,
        minWidth: 280,
        padding: 0,
        WebkitFontSmoothing: "none",
        imageRendering: "pixelated",
      }}>

        {/* Header tipo caja de diálogo Undertale (sjejejejsejsj) */}
        <div style={{
          borderBottom: BORDER,
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#000",
        }}>
          <span style={{
            color: RED,
            fontSize: "1rem",
            display: "inline-block",
            animation: "soul-bounce 0.8s ease-in-out infinite",
          }}>♥</span>
          <span style={{
            letterSpacing: "0.12em",
            fontSize: "0.85rem",
            color: YELLOW,
          }}>{t.credits} - v{version }</span>

          {/* Selector de idioma */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            <button
              style={{
                background: language === "en" ? FG : BG,
                color: language === "en" ? BG : FG,
                border: BORDER,
                fontFamily: FONT,
                fontSize: "0.8rem",
                padding: "2px 8px",
                cursor: "pointer",
                borderRadius: 0,
                marginRight: 2,
              }}
              onClick={() => setLanguage("en")}
            >EN</button>
            <button
              style={{
                background: language === "es" ? FG : BG,
                color: language === "es" ? BG : FG,
                border: BORDER,
                fontFamily: FONT,
                fontSize: "0.8rem",
                padding: "2px 8px",
                cursor: "pointer",
                borderRadius: 0,
              }}
              onClick={() => setLanguage("es")}
            >ES</button>
          </div>
        </div>

        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Bun */}
          <div style={styles.creditRow}>
            <span style={styles.bullet}>❯</span>
            <span style={styles.creditLabel}>{t.madeWith}</span>
            <img src={bunLogo} alt="Bun" style={{ height: 20, width: "auto", imageRendering: "pixelated" }} />
            <span style={{ color: YELLOW }}>Bun</span>
          </div>

          {/* React */}
        <div style={styles.creditRow}>
            <span style={styles.bullet}>❯</span>
            <span style={styles.creditLabel}>{t.poweredBy}</span>
            <img src={reactLogo} alt="React" style={{ height: 20, width: "auto" }} />
            <span style={{ color: BLUE }}>React</span>
            
            </div>
                  {/* Tobee */}
            <div style={styles.creditRow}>
                <span style={styles.bullet}>❯</span>
                <span role="img" aria-label="music">🎵</span> 
            <span style={styles.creditLabel}>{t.toby_credit}</span>
            <img src={tobee} alt="React" style={{ height: 20, width: "auto" }} />
            <span style={{ color: 'white' }}>Toby Fox</span>
        </div> 
        {/* <div className="mt-2 text-xs text-blue-400">
            <span role="img" aria-label="music">🎵</span> Background music loop by Toby Fox.
            <p>Assets from Undertale/Deltarune.</p>
        </div> */}
          {/* Separador */}
          <div style={{ borderTop: "2px solid #333", margin: "2px 0" }} />

          {/* Trans girl */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={styles.bullet}>❯</span>
            <span style={{ color: PINK, fontSize: "0.8rem" }}>
              <WaveText text={t.createdBy} />
            </span>
            <TransFlag style={{ width: 24, height: 15, flexShrink: 0 }} />
          </div>
 
          {/* Cursor parpadeante tipo diálogo */}
          <div style={{ textAlign: "right", paddingTop: 2 }}>
            <span style={{
              color: FG,
              fontSize: "0.75rem",
              animation: "blink-cursor 1s step-end infinite",
            }}>▼</span> 
        
          </div>

        </div>

        {/* Botón cerrar */}
        <div style={{ borderTop: BORDER, padding: "8px 14px" }}>
          <button
            style={styles.closeBtn}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = FG;
              (e.currentTarget as HTMLButtonElement).style.color = BG;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = BG;
              (e.currentTarget as HTMLButtonElement).style.color = FG;
            }}
            onClick={onClose}
          >
            {t.close}
          </button>
        </div>
      </div>
    </>
  );
}

function WaveText({ text }: { text: string }) {
  return (
    <a
      href="https://twitter.com/senioritaniz"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span style={{ display: "inline-block" }}>
        {text.split("").map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              animation: "wave 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.04}s`,
              whiteSpace: "pre",
            }}
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </span>
    </a>
  );
}

const styles: Record<string, React.CSSProperties> = {
  creditRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: "0.9rem",
  },
  bullet: {
    color: YELLOW,
    flexShrink: 0,
  },
  creditLabel: {
    color: "#888",
    fontSize: "0.8rem",
  },
  closeBtn: {
    background: BG,
    color: FG,
    border: BORDER,
    padding: "6px 16px",
    fontFamily: FONT,
    fontSize: "0.85rem",
    cursor: "pointer",
    letterSpacing: "0.1em",
    borderRadius: 0,
    width: "100%",
    transition: "background 0.07s, color 0.07s",
  },
};