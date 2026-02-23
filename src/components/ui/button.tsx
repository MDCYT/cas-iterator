import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";


let globalAudio: HTMLAudioElement | null = null;
let audioUnlocked = false;
const confirmSrc = require("../../assets/sounds/ui-confirm.wav");
const hoverSrc = require("../../assets/sounds/ui-hover.wav");

function ensureGlobalAudio() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!globalAudio) {
    globalAudio = document.getElementById("ui-global-audio") as HTMLAudioElement;
    if (!globalAudio) {
      globalAudio = document.createElement("audio");
      globalAudio.id = "ui-global-audio";
      globalAudio.style.display = "none";
      globalAudio.preload = "auto";
      document.body.appendChild(globalAudio);
    }
  }
}

function unlockAudio() {
  ensureGlobalAudio();
  if (audioUnlocked || !globalAudio) return;
  try {
    globalAudio.src = confirmSrc;
    globalAudio.volume = 0;
    globalAudio.play().catch(() => {});
    setTimeout(() => {
      if (globalAudio) globalAudio.volume = 1;
    }, 100);
    audioUnlocked = true;
  } catch {}
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
  window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
  window.addEventListener("click", unlockAudio, { once: true, passive: true });
  ensureGlobalAudio();
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);


function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const [hover, setHover] = React.useState(false);


  const playSound = (type: "confirm" | "hover") => {
    ensureGlobalAudio();
    if (!audioUnlocked || !globalAudio) return;
    try {
      globalAudio.pause();
      globalAudio.currentTime = 0;
      globalAudio.src = type === "confirm" ? confirmSrc : hoverSrc;
      globalAudio.play().catch(() => {});
    } catch {}
  };

  const handleClick = (e: React.MouseEvent) => {
    playSound("confirm");
    if (props.onClick) props.onClick(e);
  };
  const handleMouseEnter = (e: React.MouseEvent) => {
    setHover(true);
    playSound("hover");
    if (props.onMouseEnter) props.onMouseEnter(e);
  };
  const handleMouseLeave = (e: React.MouseEvent) => {
    setHover(false);
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  const mergedStyle = {
    ...(props.style || {}),
    border: hover ? '3px solid #ffdd00' : (props.style?.border || '3px solid #fff'),
    transition: 'border 0.07s, background 0.07s, color 0.07s',
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      style={mergedStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export { Button, buttonVariants };
