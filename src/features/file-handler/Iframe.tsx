import React, { EmbedHTMLAttributes, useEffect, useCallback, useRef } from 'react';
import { ClientExposedAPI } from '../../utils';

interface IFrameProps extends EmbedHTMLAttributes<HTMLIFrameElement> {
    exposedAPI: ClientExposedAPI;
}

export function Iframe({ exposedAPI, src, ...props }: IFrameProps) {
    let iframe: HTMLIFrameElement | null = null;

    const handleIframeLoad = useCallback(async () => {
        console.log('load');
        exposedAPI.current = new ClientExposedAPI(src!, iframe!);
        exposedAPI.current.on('ready', async event => {
            console.log('result 1 + 3 = ', await event.data(1, 3));
        });
    }, [src, iframe]);

    useEffect(() => {
        if (iframe) {
            iframe.addEventListener('load', handleIframeLoad);
        }

        return () => {
            exposedAPI.current?.destroy();
        };
    }, [iframe, handleIframeLoad]);

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
