const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const http = require('http');
const fetch = require('node-fetch');
const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();

var startTheGame = () => {
    let opts = {
        javaPath: `C:\\Program Files\\Common Files\\Oracle\\Java\\javapath\\javaw.exe`,
        clientPackage: null,
        authorization: Authenticator.getAuth("julipapi"),
        root: "./minecraft",
        version: {
            number: "1.18.2",
            type: "release"
        },
        memory: {
            max: "5G",
            min: "2G"
        }
    }

    launcher.launch(opts);

    launcher.on('debug', (e) => console.log('debug', e));
    launcher.on('data', (e) => console.log('data', e));
    launcher.on('progress', (e) => console.log('progress', e));
    launcher.on('download-status', (e) => console.log('download-status', e));
    launcher.on('package-extract', (e) => console.log('package-extract', e));
    launcher.on('close', (e) => console.log('close', e));
    launcher.on('arguments', (e) => console.log('arguments', e));
};

let settings = ipcRenderer.sendSync(`api.settings`).settings;

settings_ = {
    cget: settings,
    get: () => {
        settings = ipcRenderer.sendSync(`api.settings`).settings;
        return settings;
    },
    set: (path, set) => {
        if (typeof path !== `undefined`) {
            if (typeof set !== `undefined`) {
                settings[path] = set;
                var get = ipcRenderer.sendSync(`api.set.settings`, { settings: settings })
                return get.settings;
            };
        }
    }
};

contextBridge.exposeInMainWorld('node', {
    ipc: ipcRenderer,
    fs: fs,
    path: path,
    fetch: fetch,
    settings: settings_,
    launch: startTheGame
});
