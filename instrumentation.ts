import type { Logger } from 'pino'
import { Registry, collectDefaultMetrics, Counter } from 'prom-client'
import { registerOTel } from '@vercel/otel'

declare global {
    // var usage is required for a global declaration
    var logger: Logger | undefined;
    var metrics: {
        registry: Registry;
        registeredUser: Counter
    } | undefined
}
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
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

        const registeredUserMetric = new Counter({
            name: 'user_signups_total',
            help: 'Total number of users registered',
            labelNames: ['plan_type', 'referral_source'],
            registers: [prometheusRegistry]
        })

        globalThis.metrics = { 
            registry: prometheusRegistry,
            registeredUser: registeredUserMetric
        }

        registerOTel()
    }
}