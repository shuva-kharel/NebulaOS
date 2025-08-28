import { useEffect, useState, useCallback } from "react";

const RETRO_KEY = "nebula-retro";

export function useRetroMode() {
  const [retro, setRetro] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(RETRO_KEY) === "1";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (retro) root.classList.add("retro");
    else root.classList.remove("retro");
    localStorage.setItem(RETRO_KEY, retro ? "1" : "0");
  }, [retro]);

  const toggleRetro = useCallback(() => setRetro((v) => !v), []);

  return { retro, setRetro, toggleRetro } as const;
}
