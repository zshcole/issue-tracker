import type { Logger } from 'pino'
import { Registry, collectDefaultMetrics } from 'prom-client'

declare global {
    // var usage is required for a global declaration
    var logger: Logger | undefined;
    var metrics: {
        registry: Registry;
    } | undefined
}
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        console.log('registering instrumentation')
        const pino = (await import('pino')).default
        const pinoLoki = (await import('pino-loki')).default
        const transport = pinoLoki({
            host: 'http://localhost:3100',
            batching: true,
            interval: 5,
            labels: { app: 'issues'}
        })
        const logger = pino(transport)
        globalThis.logger = logger

        const prometheusRegistry = new Registry()
        collectDefaultMetrics({
            register: prometheusRegistry
        })
        globalThis.metrics = { 
            registry: prometheusRegistry
        }
    }
}