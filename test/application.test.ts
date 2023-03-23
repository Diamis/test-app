import { Application } from '../src/application'
import TestProvider from './providers'

describe("class Application", () => {
    const appDev = new Application({ 
        appRoot: __dirname, 
        environment: 'development',
        providers: [null]
    })

    it("Загрузка переменных сред", async () => {
        await appDev.setup()
        expect(process.env.APP_ENV).toBe('development')
    })

    it("Регистрация провайдера", async () => {
        await appDev.registerProviders()
        expect(process.env.APP_ENV).toBe('development')
    })
})