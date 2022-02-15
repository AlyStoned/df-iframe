import React, { useEffect, useCallback } from 'react';

export function Iframe() {
    let frame: HTMLIFrameElement;

    const handleIframeLoad = useCallback(() => {
        console.log('load');
    }, []);

    const handleReceiveMessage = useCallback(() => {
        console.log('message');
    }, []);

    useEffect(() => {
        window.addEventListener('message', handleReceiveMessage);
        frame.addEventListener('load', handleIframeLoad);
        return () => {
            window.removeEventListener('message', handleReceiveMessage, false);
        };
    });

    return (
        <iframe
            id="df-iframe"
            title="DF Iframe Example"
            width="800"
            height="720"
            frameBorder="0"
            allow="fullscreen"
            src="http://localhost:4200/4taps/widget/cart"
            ref={ref => {
                frame = ref as HTMLIFrameElement;
            }}
        />
    );
}
