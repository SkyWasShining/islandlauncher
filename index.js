const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const web = express(); // crash with app exported wth
const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
// const { autoUpdater } = require("electron-updater");
const path = require('path');
const uaup = require('uaup-js');
const fs = require('fs');
const fetch = require('node-fetch');

// const defaultStages = {
//     Checking: "Checking For Updates!", // When Checking For Updates.
//     Found: "Update Found!",  // If an Update is Found.
//     NotFound: "No Update Found.", // If an Update is Not Found.
//     Downloading: "Downloading...", // When Downloading Update.
//     Unzipping: "Installing...", // When Unzipping the Archive into the Application Directory.
//     Cleaning: "Finalizing...", // When Removing Temp Directories and Files (ex: update archive and tmp directory).
//     Launch: "Launching..." // When Launching the Application.
// };

// const updateOptions = {
//     useGithub: true,
//     gitRepo: "islandlauncher",
//     gitUsername: "SkyWasShining",
//     isGitRepoPrivate: false,

//     appName: "Island Proyect Launcher",
//     appExecutableName: "Island Proyect Launcher.exe",
//     forceUpdate: false, // {Default is false} [Optional] If the Application should be forced updated.  This will change to true if any errors ocurr while launching.
//     stageTitles: defaultStages, // {Default is defaultStages} [Optional] Sets the Status Title for Each Stage
// };

// uaup.Update(updateOptions);

let isUpdateAvalible = uaup.CheckForUpdates(updateOptions);
if (isUpdateAvalible) {
    console.log(`update!`);
};


var config = {
    port: 4958,
    isDev: false,
    savefile: path.join(__dirname, `csv.swsc`),
    usettings: {
        "login.token": null
    }
};

openLogin_tserver = web.listen(config.port, function (err) {
    if (err) { console.log(`There was an error starting the port`); return; };
    console.log(`wow an internal server was opened on the port ${config.port}`);
});

web.use(cors({
    origin: '*'
}));

web.use(bodyParser.urlencoded({ extended: true }));
web.use(bodyParser.json());

web.post('/calllogin', cors(), function (req, res) {
    if (typeof req.body.type !== `undefined`) {
        if (req.body.type === `DISCORDLOGIN`) {
            if (openLogin.type === `DISCORDLOGIN`) {
                config.usettings['login.type'] = `DISCORDLOGIN`;
                if (typeof req.body.token !== `undefined`) {
                    config.usettings['login.token'] = req.body.token;
                };

                if (typeof req.body.user !== `undefined`) {
                    config.usettings['login.cache'] = JSON.stringify(req.body.user);
                };

                if (typeof req.body.token !== `undefined`) {
                    if (typeof req.body.user !== `undefined`) {
                        if (typeof req.body.user.discord !== `undefined`) {
                            if (typeof req.body.user.mcuser !== `undefined`) {
                                if (req.body.user.mcuser !== null) {
                                    if (req.body.user.mcuser !== 'null') {
                                        openLogin.get = {
                                            token: req.body.token,
                                            user: req.body.user
                                        };
                                    } else {
                                        req.body.user.mcuser = null;
                                        openLogin.get = {
                                            token: req.body.token,
                                            user: req.body.user
                                        };
                                    };
                                } else {
                                    openLogin.get = {
                                        token: req.body.token,
                                        user: req.body.user
                                    };
                                };
                            };
                        };
                    };
                };
                res.send({ err: null });
                openLogin.enabled = false;
            };                
        } else {
            res.send({
                err: {
                    code: `syx`
                }
            });
        };
    } else {
        res.send({
            err: {
                code: `syx`
            }
        });
    };
});

config_save = () => {
    var ens = ``;
    var config_usettings = Object.keys(config.usettings);
    for (let index = 0; index < config_usettings.length; index++) {
        const element = config_usettings[index];
        ens += `${element}==${config.usettings[element]};`;
    }; 
    fs.writeFile(config.savefile, ens, (err) => {
        if (err) {
            console.error(err);
        };
    });
};

fs.readFile(config.savefile, `utf-8`, (err, data) => {
    if (err) {
        if (err.code === `ENOENT`) {
            config_save();
        } else {
            console.error(err);
        };            
    } else {
        var dataC = data.split(`;`);
        var datao = {};
        for (let index = 0; index < dataC.length; index++) {
            const element = dataC[index].split(`==`);
            if (typeof element[0] !== `undefined`) {
                if (typeof element[1] !== `undefined`) {
                    if (element[0] !== ``) {
                        datao[element[0]] = element[1];
                    };
                };
            };
        };
        config.usettings = datao;
    };
});


const processArgs = process.argv.slice(2);

for (let index = 0; index < processArgs.length; index++) {
    const element = processArgs[index];
    if (element === `--dev-mode`) {
        config.isDev = true;
    };
};

isAppQuitting = false;

app.whenReady().then(() => {
    console.log(`un electron se fue volando`);
    console.log(`electron js is ready!`);

    var coons = function() {
        Window = new BrowserWindow({
            title: 'Island',
            show: false,
            skipTaskbar: false,
            // icon: path.join(__dirname, `icons/icon.png`),
            minWidth: (850),
            minHeight: (450),
            resizable: true,
            maximizable: true,
            frame: true,
            autoHideMenuBar: true,
            transparent: false,
            titleBarStyle: 'hidden',
            titleBarOverlay: {
                color: '#0f0f10',
                symbolColor: '#fff'
            },
            webPreferences: {
                preload: path.join(__dirname, `app/preload.js`),
                // contextIsolation: false,
                // nodeIntegration: true
            }
        });

        Window.loadFile('app/index.html');

        Window.once('ready-to-show', () => {
            console.log(`a nice window ready to be seen`);
            setTimeout(() => {
                if (config.isDev) {
                    setTimeout(() => {
                        Window.webContents.openDevTools();
                    }, 450);                    
                };
                Window.show();
            }, 750);
        });

        ipcMain.on('launch-the-game', (event, eventconfig) => {
            Window.hide();
        });

        ipcMain.on('open-url', (event, eventconfig) => {
            if (typeof eventconfig.url !== `undefined`) {                
                shell.openExternal(eventconfig.url);
            };
        });

        openLogin = {
            tserver: null,
            enabled: false,
            type: null,
            get: {}
        };

        ipcMain.on('open-login-discord', (event, eventconfig) => {
            if (!openLogin.enabled) {
                openLogin.type = 'DISCORDLOGIN';
                if (config.isDev) {
                    // shell.openExternal('https://discord.com/oauth2/authorize?client_id=993582438469083247&redirect_uri=http%3A%2F%2Flocalhost%3A4554%2Fapi%2Flogin%2Fdiscord%2Fcallback%2Felectron&response_type=code&scope=identify%20email');
                } else {
                };
                shell.openExternal('https://discord.com/api/oauth2/authorize?client_id=993582438469083247&redirect_uri=https%3A%2F%2Fsws-island-server-main.herokuapp.com%2Fapi%2Flogin%2Fdiscord%2Fcallback%2Felectron&response_type=code&scope=identify%20email');
            };
            event.returnValue = {};
        });

        ipcMain.on('open-login-discord-get', (event, eventconfig) => {
            if (openLogin.type === `DISCORDLOGIN`) {
                event.returnValue = {
                    data: openLogin.get
                };
            } else {
                event.returnValue = {
                    data: {}
                };
            };
        });
        
        

        ipcMain.on('open-login-discord-get-clear', (event, eventconfig) => {
            if (openLogin.type === `DISCORDLOGIN`) {
                event.returnValue = {
                    data: openLogin.get
                };
                openLogin.get = {};
            } else {
                event.returnValue = {
                    data: {}
                };
            };
        });
        
        ipcMain.on('open-login-discord-cancel', (event, eventconfig) => {
            if (openLogin.type === `DISCORDLOGIN`) {
                openLogin_tserver_canceled = true;
            } else {
                event.returnValue = {
                    data: {}
                };
            };
        });       

        ipcMain.on('api.connect', (event, eventconfig) => {
            var is_max = false;
            if (!isAppQuitting) {
                var is_max = Window.isMaximized();
            };
            event.returnValue = {
                window: {
                    max: is_max
                }
            };
        });

        ipcMain.on('api.settings', (event, eventconfig) => {
            event.returnValue = {
                settings: config.usettings
            };
        });

        ipcMain.on('api.set.settings', (event, eventconfig) => {
            config.usettings = eventconfig.settings;
            config_save();
            event.returnValue = {
                settings: config.usettings
            };
        });

        Window.on('close', function (evt) {
            if (!isAppQuitting) {
                isAppQuitting = true;
                evt.preventDefault();
                Window.hide();
                setTimeout(() => {
                    app.quit();
                }, 100);
            };
        });
    };

    coons();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            coons();
        };
    });
}).catch((err) => {
    console.error(err);
});