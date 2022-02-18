import { Remote, releaseProxy, wrap } from 'comlink';
import { EventEmitter } from '@billjs/event-emitter';
import { ExcludeConditionally, FilterConditionally } from '../types';

export interface ExposedAPI {
    models: {
        transfer: (files: File[]) => void;
    };
    add: (a: number, b: number) => number;
    test: (a: boolean, c: string) => number;
    field: number;
}

export type ExposedAPIFields = ExcludeConditionally<ExposedAPI, Function>;
export type ExposedAPIMethods = FilterConditionally<ExposedAPI, Function>;

export class ClientExposedAPI extends EventEmitter {
    public url: URL;
    public iframe: HTMLIFrameElement;
    public api?: Remote<ExposedAPI>;
    private port?: MessagePort;

    constructor(src: string, iframe: HTMLIFrameElement) {
        super();
        this.url = new URL(src);
        this.iframe = iframe;

        this.handleInitMessage = this.handleInitMessage.bind(this);
        this.init();
    }

    private handleInitMessage(event: MessageEvent) {
        if (!this.eventIsValid(event)) return;

        this.port = event.ports[0];
        this.setupApi(this.port);
    }

    private eventIsValid(event: MessageEvent) {
        return Boolean(event.origin.startsWith(this.url.origin) && event.data.status === 'ready' && event.ports[0]);
    }

    private setupApi(port: MessagePort) {
        this.api = wrap<ExposedAPI>(port);
        this.fire('ready', this.api);
    }

    private init() {
        // Listen for the initial port transfer message
        window.addEventListener('message', this.handleInitMessage);
    }

    public destroy() {
        // console.log('destroy');
        window.removeEventListener('message', this.handleInitMessage);
        this.api && this.api[releaseProxy]();
        this.fire('destroy');
        this.off();
    }

    public async call<T extends keyof ExposedAPIMethods>(name: T, ...args: Parameters<ExposedAPIMethods[T]>) {
        if (!this.ready) return;

        const method = this.api![name];
        await Reflect.apply(method, this.api, args);
        // await method(...args);
    }

    public async get<T extends keyof ExposedAPIFields>(name: T) {
        if (!this.ready) return;

        await Reflect.get(this.api!, name);
    }

    public get ready() {
        return Boolean(this.port && this.api);
    }
}
