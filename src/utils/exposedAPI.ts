import { Remote, releaseProxy, wrap } from 'comlink';
import { EventEmitter } from '@billjs/event-emitter';

export type ExposedAPI = (a: number, b: number) => number;

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

    public get ready() {
        return Boolean(this.port && this.api);
    }

    public async call(name: string, ...args: any[]) {
        if (!this.ready) return;

        await this.api!(5, 3);
    }

    public init() {
        // Listen for the initial port transfer message
        window.addEventListener('message', this.handleInitMessage);
    }

    public destroy() {
        console.log('destroy');
        window.removeEventListener('message', this.handleInitMessage);
        this.api && this.api[releaseProxy]();
        this.fire('destroy');
        this.off();
    }
}
