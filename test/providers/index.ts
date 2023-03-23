import { Application } from "@src/application";
import { IAppProvider } from "../../src/provider";

export default class TestProvider implements IAppProvider {
    constructor(readonly app: Application) {}
    
    public register() {
        console.log('test provider register', this.app)
    }
}