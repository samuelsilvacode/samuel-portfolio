// Sons de interface gerados na hora com Web Audio (sem arquivo de áudio). Começa desligado.
let ctx: AudioContext | null = null
let ligado = false

export const somLigado = () => ligado

export function alternarSom() {
  ligado = !ligado
  if (ligado && !ctx) ctx = new AudioContext()
  if (ligado) tocar('liga')
  return ligado
}

export function tocar(tipo: 'hover' | 'clique' | 'liga' | 'solta' = 'clique') {
  if (!ligado || !ctx) return
  const agora = ctx.currentTime
  const osc = ctx.createOscillator()
  const ganho = ctx.createGain()
  const cfg = {
    hover: { f1: 1400, f2: 1600, vol: 0.015, dur: 0.05, onda: 'sine' },
    clique: { f1: 520, f2: 260, vol: 0.05, dur: 0.09, onda: 'triangle' },
    liga: { f1: 440, f2: 880, vol: 0.05, dur: 0.18, onda: 'sine' },
    solta: { f1: 300, f2: 120, vol: 0.06, dur: 0.15, onda: 'sine' },
  }[tipo] as { f1: number; f2: number; vol: number; dur: number; onda: OscillatorType }
  osc.type = cfg.onda
  osc.frequency.setValueAtTime(cfg.f1, agora)
  osc.frequency.exponentialRampToValueAtTime(cfg.f2, agora + cfg.dur)
  ganho.gain.setValueAtTime(cfg.vol, agora)
  ganho.gain.exponentialRampToValueAtTime(0.0001, agora + cfg.dur)
  osc.connect(ganho).connect(ctx.destination)
  osc.start(agora)
  osc.stop(agora + cfg.dur + 0.02)
}
