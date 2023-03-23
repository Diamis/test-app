import "reflect-metadata"
import path from 'path'

import { Container} from 'inversify'
import { Config, IConfigOption } from '../src/config'
import { Types } from "../src/types"

describe("class Config", ()=> { 
    const ico = new Container();
    ico.bind<IConfigOption>(Types.configOptions).toConstantValue({ path: path.join(__dirname, 'configs') });
    ico.bind<Config>(Types.config).to(Config)


    it("подключаем environment в зависимости от режима", () => {
        const config = ico.get<Config>(Types.config);
        expect(config.all()).toEqual({ app: { name: "config app" }, server: { name: "config server" } })
    })

    it("добавляем настройку в конфиг", () => {
        const config = ico.get<Config>(Types.config);
        config.set("mykey", "myvalue")
        expect(config.get("mykey")).toBe("myvalue")
    })
})
