import type { Logger } from 'pino'

declare global {
    // var usage is required for a global declaration
    var logger: Logger | undefined
}
export async function register() {
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
}