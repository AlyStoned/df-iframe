import { Remote, releaseProxy, wrap } from 'comlink';
import { EventEmitter } from '@billjs/event-emitter';
import { ExcludeConditionally, FilterConditionally } from '../types';
import { DigifabsterScriptSrc, DigifabsterIframeSrc } from '../constants';

export interface ExposedAPI {
    transferModels: (files: File[]) => void;
}

export type ExposedAPIFields = ExcludeConditionally<ExposedAPI, Function>;
export type ExposedAPIMethods = FilterConditionally<ExposedAPI, Function>;

export class ClientExposedAPI extends EventEmitter {
    public readonly src: string = DigifabsterIframeSrc;
    public url: URL;
    public api?: Remote<ExposedAPI>;
    private port?: MessagePort;

    constructor() {
        super();
        this.url = new URL(this.src);

        this.handleDocumentReady = this.handleDocumentReady.bind(this);
        this.handleInitMessage = this.handleInitMessage.bind(this);

        document.addEventListener('DOMContentLoaded', this.handleDocumentReady);
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

    private handleDocumentReady() {
        const that = this;

        const script = document.querySelector(`script[src="${DigifabsterScriptSrc}"]`);
        script?.addEventListener(
            'load',
            function () {
                const iframe = document.querySelector(`iframe[src^="${window.__digifabsterCompanyWidgetUrl}"]`);
                iframe?.addEventListener(
                    'load',
                    () => {
                        that.init();
                    },
                    { once: true },
                );
            },
            { once: true },
        );
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
        const that = this;
        const method = this.api![name];

        if (!this.ready) {
            this.once('ready', async () => {
                await Reflect.apply(method, that.api, args);
                // await method(...args);
            });
            return;
        }

        await Reflect.apply(method, this.api, args);
        // await method(...args);
    }

    public async get<T extends keyof ExposedAPIFields>(name: T) {
        if (!this.ready) return Promise.resolve();

        return await Reflect.get(this.api!, name);
    }

    public get ready() {
        return Boolean(this.port && this.api);
    }
}

export const exposedApi = new ClientExposedAPI();
