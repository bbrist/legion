import {Construct, IConstruct} from "constructs";

export interface RootConstructProps {
    apps: {
        [key: string]: IConstruct
    }

    scopes: {
        [key: string]: IConstruct
    }
}

export class App extends Construct {
    static instance: App;

    private readonly apps: {
        [key: string]: IConstruct
    }

    private readonly scopes: {
        [key: string]: IConstruct
    }

    constructor(props: RootConstructProps) {
        super(undefined as any, '');
        this.apps = props.apps;
        this.scopes = props.scopes;
    }

    register(name: string, scope: IConstruct): void {
        this.scopes[name] = scope;
    }

    scope(name: string): IConstruct {
        return this.scopes[name];
    }

    synth() {
        Object.keys(this.apps).forEach(key => {
            const app = this.apps[key] as any;
            if (typeof app.synth === 'function') {
                app.synth();
            }
        });
    }

}

export default {

    getInstance(): App {
        if (!App.instance) {
            throw new Error('App not initialized');
        }

        return App.instance;
    },

    initialize(props: RootConstructProps): void {
        App.instance = new App(props);
    },

    register(name: string, scope: IConstruct): void {
        this.getInstance().register(name, scope);
    },

    scope(name: string): IConstruct {
        return this.getInstance().scope(name);
    },

    synth(): void {
        this.getInstance().synth();
    }

}