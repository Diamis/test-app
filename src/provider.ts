import { Application } from "./application";

export interface IAppProvider {
    new(app: Application): IAppProvider

    register(): void
}