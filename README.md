## Install project
Clone repo:
```bash
git clone https://github.com/AlyStoned/df-iframe.git
```

Install yarn:
```bash
npm install --global yarn
yarn --version
```

Install project deps (in the project directory):
```bash
yarn install
```

Start local server:
```bash
yarn start
```

## Explanation
This is an example of using the exposed API of DF application (app.digifabster.com).

Exposed API - properties and functions of the DF application that you can use from another browser window.

We rely on the [channel messaging](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API/Using_channel_messaging) from the browser API to expose our application's API. To simplify that process, we use [comlink](https://github.com/GoogleChromeLabs/comlink), this helps us build a neat way to communicate between windows.
Comlink is the only peer dependency to use the exposed API since we use it inside the DF application. In this example we've also used [@billjs/event-emitter](https://github.com/billjs/event-emitter) to emit api ready event, but it's not necessary.
[Here](src/utils/exposedAPI.ts) is a possible implementation of the client part of the API, it's just a wrapper waiting for DF exposed API readiness signal.

## Exposed API

The DF application is ready to listen for such calls:

**_transferModels_**, it takes a list of [File](https://w3c.github.io/FileAPI/#file-section) objects as the first argument.

Usage example based on our implementation:
```javascript
exposedApi.call(
    'transferModels',
    fileObjects.map(fileObject => fileObject.file),
);
```

### Current API scheme
```javascript
interface ExposedAPI {
    transferModels: (files: File[]) => void;
}
```
