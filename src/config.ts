import { inject, injectable } from 'inversify'
import requireAll from 'require-all'
import get from 'lodash.get'
import set from 'lodash.set'
import path from 'path'

import { Types } from './types'

export interface IConfigOption {
    path: string
} 

@injectable()
export class Config {
    private config = {}

    public constructor(@inject(Types.configOptions) configOptions: IConfigOption) {
        const options = this.normalizeOptions(configOptions) 
        this.loadCongig(options)
    }

    public all() {
        return this.config
    }

    public get<T = unknown>(key: string, defaultValue?: unknown): T {
        return get(this.config, key, defaultValue)
    }

    public set(key: string, value: unknown) {
        set(this.config, key, value)
    }


    private loadCongig(options: IConfigOption) {
        try {
            this.config = requireAll({ 
                dirname: options.path,
                recursive: true,
                resolve: (output: any) => output && output.__esModule && output.default ? output.default : output,
                filter: (file: string) => {
                    const ext = path.extname(file)
                    if (ext !== '.ts') {
                        return false
                    }

                    return file.replace('.ts', '')
                },
            })
        } catch(error) {
            console.error(error) 
        }
    }

    private normalizeOptions(options: IConfigOption) {
        return options
    }
} 