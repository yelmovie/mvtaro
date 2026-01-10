export type TarotInterpretationSource = "static_json";

export function isDebugTarotEnabled(): boolean {
  // Vite only: do not throw if missing
  return import.meta.env?.VITE_DEBUG_TAROT === "1";
}

export function debugTarotLog(payload: Record<string, unknown>): void {
  if (!isDebugTarotEnabled()) return;
  // Never log secrets; this payload is strictly tarot debug info.
  // eslint-disable-next-line no-console
  console.log("[tarot-debug]", payload);
}

