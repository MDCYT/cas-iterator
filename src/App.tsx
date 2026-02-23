

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransFlag } from "./components/TransFlag";
import { CreditsMenu } from "./components/CreditsMenu";
import { SymbolicCalculator } from "./logic/SymbolicCalculator";
import { LanguageProvider, useLanguage } from "./logic/LanguageContext";
import { translations, CONCEPTS } from "./translations";
import "./index.css";
import tenna from "./assets/images/logo.gif";
import bgMusic from "./assets/music/greenroom_detune.ogg";
import allowMus from "./assets/images/allow_mus.png";
import disallowMus from "./assets/images/disallow_mus.png";




function withConceptTooltips(html: string, language: string): string {
  const langConcepts = CONCEPTS[language] ?? CONCEPTS.en;
  const keys = Object.keys(langConcepts).sort((a, b) => b.length - a.length);
  let result = html;
  for (const key of keys) {
    const escaped = key.replace(/([.*+?^${}()|[\]\\])/g, "\\$1");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    result = result.replace(
      regex,
      (match) =>
        `<span style='color:#7ecbff;position:relative;cursor:help;' class='concept-tooltip' data-tooltip="${langConcepts[key]}">${match}</span>`
    );
  }
  return result;
}


function useBackgroundMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const tryPlay = () => {
      audioRef.current?.paused && audioRef.current.play().catch(() => {});
    };
    window.addEventListener("click", tryPlay);
    window.addEventListener("touchstart", tryPlay);
    return () => {
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  };

  const element = (
    <audio ref={audioRef} src={src} autoPlay loop style={{ display: "none" }} muted={muted} />
  );
  return { element, muted, toggle , isPlaying: !muted && audioRef.current ? !audioRef.current.paused : false };
}

function useConceptTooltip() {
  useEffect(() => {
    const getOrCreateTip = (): HTMLDivElement => {
      let tip = document.getElementById("about-tooltip") as HTMLDivElement | null;
      if (!tip) {
        tip = document.createElement("div");
        tip.id = "about-tooltip";
        Object.assign(tip.style, {
          position: "fixed",
          background: "#222",
          color: "#7ecbff",
          border: "2px solid #7ecbff",
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "14px",
          zIndex: "10001",
        });
        document.body.appendChild(tip);
      }
      return tip;
    };

    const hideTip = () => {
      const tip = document.getElementById("about-tooltip");
      if (tip) tip.style.display = "none";
    };

    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList && target.classList.contains("concept-tooltip")) {
        const tip = getOrCreateTip();
        tip.textContent = target.getAttribute("data-tooltip") ?? "";
        tip.style.display = "block";
        tip.style.left = `${e.clientX + 12}px`;
        tip.style.top = `${e.clientY + 8}px`;
      } else {
        hideTip();
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", hideTip);
    document.addEventListener("mousedown", hideTip);
    document.addEventListener("scroll", hideTip);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", hideTip);
      document.removeEventListener("mousedown", hideTip);
      document.removeEventListener("scroll", hideTip);
      document.getElementById("about-tooltip")?.remove();
    };
  }, []);
}


const ICON_BTN_STYLE: React.CSSProperties = {
  background: "#000",
  color: "#fff",
  border: "3px solid #fff",
  borderRadius: 0,
  width: 48,
  height: 48,
  fontSize: 28,
  fontWeight: 1,
  fontFamily: "DeterminationMono, Share Tech Mono, monospace",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px #000a",
};

function CreditsButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <Button
      size="icon"
      style={{
        background: "#000",
        color: "#fff",
        border: hover ? "3px solid #ffdd00" : "3px solid #fff",
        borderRadius: "50%",
        fontWeight: 700,
        fontSize: 22,
        width: 48,
        height: 48,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border 0.07s",
      }}
      onClick={onClick}
      aria-label="Show credits"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      C
    </Button>
  );
}

function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { language } = useLanguage();
  const t = translations[language];
  useConceptTooltip();

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#000",
          color: "#fff",
          maxWidth: 480,
          padding: 24,
          border: "3px solid #fff",
          fontFamily: "DeterminationMono, Share Tech Mono, monospace",
          boxShadow: "0 4px 32px #000a",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
          {t.aboutTitle}
        </h2>
        <div
          style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16, maxHeight: 400, overflowY: "auto" }}
          dangerouslySetInnerHTML={{ __html: withConceptTooltips(t.aboutContent, language) }}
        />
        <button
          onClick={onClose}
          style={{
            background: "#000",
            color: "#fff",
            border: "3px solid #fff",
            borderRadius: 0,
            padding: "8px 18px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}


export function App() {
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { element: audioElement, muted, isPlaying, toggle: toggleMusic } = useBackgroundMusic(bgMusic);

  return (
    <LanguageProvider>
      {audioElement}

      {/* Controles superiores izquierda */}
      <div className="fixed top-6 left-6 z-50 flex flex-col gap-2">
        <Button style={ICON_BTN_STYLE} onClick={toggleMusic} aria-label={muted ? "Unmute music" : "Mute music"}>
          <img
            src={muted  ? disallowMus : allowMus}
            alt={muted ? "Music Off" : "Music On"}
            style={{ minWidth: 16, objectFit: "contain", display: "inline-block", verticalAlign: "middle" }}
          />
        </Button>
        <Button style={ICON_BTN_STYLE} onClick={() => setAboutOpen(true)} aria-label="About">
          ?
        </Button>
      </div>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <SymbolicCalculator />

      {/* <div className="container mx-auto p-8 text-center relative z-10 max-h-screen"> */}
        {/* <div className="flex justify-center items-center gap-8 mb-8">
          <img
            src={tenna}
            className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
            alt="logo"
          />
          <h1 className="text-4xl font-bold" style={{ color: "#646cff" }}>
            Function Iterator
          </h1>
        </div> */}

      {/* </div> */}

      {/* Botón de créditos inferior derecha */}
      <div className="fixed bottom-6 right-6 z-50">
        <CreditsButton onClick={() => setCreditsOpen(true)} />
      </div>

      <CreditsMenu open={creditsOpen} onClose={() => setCreditsOpen(false)} />
    </LanguageProvider>
  );
}

export default App;