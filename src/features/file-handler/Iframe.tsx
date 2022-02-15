import React, { useEffect, useCallback } from 'react';
import { wrap, windowEndpoint } from 'comlink';

const iframeUrl = 'http://localhost:4200/4taps/widget/cart';
// const iframeUrl = 'https://surma.dev/things/comlink-webrtc/index.html';
const { port1, port2 } = new MessageChannel();

export function Iframe() {
    let frame: HTMLIFrameElement | null = null;

    // function onClick(e) {
    //     e.preventDefault();
    //     port1.postMessage(input.value);
    // }

    const handleReceiveMessage = useCallback(e => {
        console.log('message');
        console.log(e.data);
    }, []);

    const handleIframeLoad = useCallback(() => {
        console.log('load');

        // Listen for messages on port1
        port1.onmessage = handleReceiveMessage;
        // Transfer port2 to the iframe
        frame?.contentWindow?.postMessage('Hello from the main page!', iframeUrl, [port2]);
    }, [frame, handleReceiveMessage]);

    useEffect(() => {
        // if (frame) {
        //     await new Promise(resolve => (frame.onload = resolve));
        //     const f = wrap(windowEndpoint(frame.contentWindow));
        //     alert(`1 + 3 = ${await f(1, 3)}`);
        // }
        // frame && frame.addEventListener('load', handleIframeLoad);
        // window.addEventListener('message', handleReceiveMessage);
        // return () => {
        //     window.removeEventListener('message', handleReceiveMessage, false);
        // };
    }, [frame, handleIframeLoad]);

    return (
        <iframe
            id="df-iframe"
            title="DF Iframe Example"
            width="800"
            height="720"
            frameBorder="0"
            allow="fullscreen"
            src={iframeUrl}
            ref={ref => {
                frame = ref as HTMLIFrameElement;
            }}
        />
    );
}
