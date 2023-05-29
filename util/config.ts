import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { mergeDeep, resolvePlaceholders } from "./utils";

class Config {

    public static instance: Config;

    private readonly root: string;
    private files: string[];
    private values: any = {};

    constructor(root: string = __dirname + '/../config') {
        this.root = root;
    }

    load(...files: string[]) {
        this.files = files;

        this.refresh();
    }

    refresh() {
        const configs = this.files.map(file => {
            const filepath = path.resolve(`${this.root}/${file}`);
            const config = yaml.load(fs.readFileSync(filepath, 'utf8'));

            console.debug(`Loaded config file ${filepath}`, config);
            return config;
        });

        mergeDeep(this.values, ...configs);
        resolvePlaceholders(this.values);

        console.debug("Resolved config", this.values);
    }

    get data(): any {
        return this.values;
    }

}

export default {

    getInstance(): Config {
        if (!Config.instance) {
            throw new Error('Config not initialized');
        }

        return Config.instance;
    },

    initialize(root: string): void {
        Config.instance = new Config(root);
    },

    load(...files: string[]): void {
        this.getInstance().load(...files);
    },

    get data(): any {
        return this.getInstance().data;
    }

}