export type WeatherEventMap = {
  'weather:state-changed': { state: import('../types/weather').AtmosphericState }
  'radar:refresh-started': Record<string, never>
  'radar:timeline-received': { generated: number; frameCount: number }
  'radar:refresh-complete': { generated: number; frameCount: number }
  'radar:frame-changed': {
    timestamp: number
    frameIndex: number
    frameCount: number
  }
  'radar:animation-cycle-complete': { frameCount: number }
  'precipitation:heavy-detected': { level: import('../types/weather').PrecipitationLevel }
  'storm:activity-detected': { activity: import('../types/weather').StormActivity }
}

type Handler<T> = (payload: T) => void

/**
 * Lightweight event bus for decoupled atmospheric subsystems.
 */
export class AtmosphericEventBus {
  private handlers = new Map<keyof WeatherEventMap, Set<Handler<unknown>>>()

  on<K extends keyof WeatherEventMap>(
    event: K,
    handler: Handler<WeatherEventMap[K]>,
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    const set = this.handlers.get(event)!
    set.add(handler as Handler<unknown>)
    return () => set.delete(handler as Handler<unknown>)
  }

  emit<K extends keyof WeatherEventMap>(event: K, payload: WeatherEventMap[K]): void {
    const set = this.handlers.get(event)
    if (!set) return
    for (const handler of set) {
      handler(payload)
    }
  }

  clear(): void {
    this.handlers.clear()
  }
}
