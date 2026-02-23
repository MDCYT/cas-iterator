import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export function MathTex({ tex }: { tex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, {
        throwOnError: false,
        displayMode: true,
      });
    }
  }, [tex]);
  return <span ref={ref} />;
}
