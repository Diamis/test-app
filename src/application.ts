import "reflect-metadata"
import path from 'path'
import * as dotenv from 'dotenv'
import { Container } from "inversify";

import { Config, IConfigOption } from './config'
import { IAppProvider } from './provider'
import { Types } from './types'

type ApplicationStates = "initiated" | "setup" | "registered" | "start"

type ApplicationEnvironment = "production" | "development"

type AbstractConstructor<T> = abstract new (...args: any[]) => T
 

export interface IApplicationOptions {
    appRoot?: string
    pathEnv?: string
    environment: ApplicationEnvironment
    providers?: AbstractConstructor<IAppProvider>[]
}

export class Application {
    public readonly appRoot: string

    public ioc = new Container()
    public state: ApplicationStates = 'initiated'
    public environment: ApplicationEnvironment

    constructor(applicationOptions: IApplicationOptions) {
        const { appRoot = process.cwd(), environment } = applicationOptions;

        this.appRoot = appRoot
        this.environment = environment
        this.ioc.bind<IApplicationOptions>(Types.appOptions).toConstantValue(applicationOptions)
    }

    private loadEnvironmentVariables() {
        const modeEnvFileName = this.environment === 'development' ? ".env.dev" : ".env.prod"
        dotenv.config({ path: path.join(this.appRoot, modeEnvFileName )})
        dotenv.config({ path: path.join(this.appRoot, '.env' )})
    }

    private loadConfig() {
        this.ioc.bind<IConfigOption>(Types.configOptions).toConstantValue({ path: path.join(this.appRoot, 'configs') })
        this.ioc.bind<Config>(Types.config).to(Config).inSingletonScope()
    }

    /**
     * Выполняем настройку приложения
     * - Загружаем environment
     * - Загружаем конфигурацию
     */
    public async setup() {
        if (this.state !== "initiated") {
            return;
        }

        this.state = "setup"
        this.loadEnvironmentVariables()
        this.loadConfig()
    }

    /**
     * Регестрируем в ioc список провадеров
     */
    public async registerProviders() {
        if (this.state !== "setup") {
            return;
        }

        this.state = 'registered'
        const { providers = [] } = this.ioc.get<IApplicationOptions>(Types.appOptions);
        providers.forEach(Provider  => {
            // @ts-ignore
            const provider = new Provider(this)
            // provider.register() 
        })
    }

    public async start() {}

    public async close() {}
}