import React, { EmbedHTMLAttributes, MutableRefObject, useEffect, useCallback } from 'react';
import { Event } from '@billjs/event-emitter';
import { ClientExposedAPI } from '../../utils';

interface IFrameProps extends EmbedHTMLAttributes<HTMLIFrameElement> {
    exposedAPI: MutableRefObject<ClientExposedAPI | undefined>;
    onAPIReady?: (event: Event) => void;
}

export function Iframe({ exposedAPI, onAPIReady, src, ...props }: IFrameProps) {
    let iframe: HTMLIFrameElement | null = null;

    const handleIframeLoad = useCallback(async () => {
        // console.log('load');
        exposedAPI.current = new ClientExposedAPI(src!, iframe!);
        onAPIReady && exposedAPI.current.once('ready', onAPIReady);
    }, [exposedAPI, onAPIReady, src, iframe]);

    useEffect(() => {
        if (iframe) {
            iframe.addEventListener('load', handleIframeLoad, { once: true });
        }

        return () => {
            exposedAPI.current?.destroy();
            exposedAPI.current = undefined;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [iframe]);

    return (
        <iframe
            id="df-iframe"
            title="DF Iframe Example"
            width="1024"
            height="720"
            frameBorder="0"
            allow="fullscreen"
            src={src}
            ref={ref => {
                iframe = ref as HTMLIFrameElement;
            }}
            {...props}
        />
    );
}
