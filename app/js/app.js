client = {
    f: {
        title: null
    },
    menu: {
        ecene: function(dp) {
            var time = 250;
            var list = [
                `user`,
                `main`
            ];
            if (client_app_context_main_userece.className !== `userece ${dp}`) {
                var exist = false;
                for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    if (dp === element) {
                        var newEcene = index;
                        exist = true;
                    };
                    if (client_app_context_main_userece.className.slice(`userece `.length).replaceAll(` hide`, ``).replaceAll(`hide`, ``) === element) {
                        var nowEcene = index;
                    };
                };
                if (exist) {
                    if (nowEcene > newEcene) {
                        toUp = true;
                    } else {
                        toUp = false;
                    };
                    client_app_context_main_userece.classList.add(`hide`);
                    if (toUp) {
                        client_app_context_main_userece.style.transform = `translateY(25%)`;
                    } else {
                        client_app_context_main_userece.style.transform = `translateY(-25%)`;
                    };
                    client_app_context_main_userece.style.transition = `filter ${((time / 1.5) / 2)}ms, transform ${(time / 2)}ms`;
                    setTimeout(() => {
                        if (toUp) {
                            client_app_context_main_userece.style.transform = `translateY(-25%)`;
                        } else {
                            client_app_context_main_userece.style.transform = `translateY(25%)`;
                        };
                        client_app_context_main_userece.style.transition = `filter ${((time / 1.5) / 2)}ms`;
                        setTimeout(() => {
                            client_app_context_main_userece.style.transition = `filter ${((time / 1.5) / 2)}ms, transform ${(time / 2)}ms`;
                            client_app_context_main_userece.style.transform = `translateY(0em)`;
                            client_app_context_main_userece.classList.remove(`hide`); 
                        }, (time / 2));
                        client_app_context_main_userece.className = `userece ${dp} hide`;
                    }, (time / 2));                    
                };
            };
        },
    },
    bt: {},
    sys: {
        init: () => {
            client.sys.electron.rel();
            client.sys.frame();
        },
        frames: 0,
        fps: 0,
        time: Date.now(),
        sec: () => {
            client.sys.time = Date.now();
            client.sys.fps = client.sys.frames;
            client.sys.frames = 0;
        },
        electron: {
            get: null,
            rel: () => {
                client.sys.electron.get = node.ipc.sendSync(`api.connect`);
                setTimeout(() => {
                    client.sys.electron.rel();
                }, 25);
            }
        },
        politimein: Date.now(),
        politime: 0,
        frame: () => {
            var dif = ((Date.now() - client.sys.time));
            if (dif > 1000) {
                client.sys.sec();
            };
            client.sys.frames += 1;
            client.sys.politime = (Date.now() - client.sys.politimein);

            if (client.f.title !== document.title) {
                client_app_title.innerHTML = document.title;
                client.f.title = document.title;
            };

            if (typeof client.sys.electron.get !== `undefined`) {
                if (typeof client.sys.electron.get.window !== `undefined`) {
                    if (typeof client.sys.electron.get.window.max !== `undefined`) {
                        if (client.sys.electron.get.window.max) {
                            document.body.classList.add(`maximized`);  
                        } else {
                            document.body.classList.remove(`maximized`);  
                        };
                    };
                };
            };
            requestAnimationFrame(()=>{
                client.sys.frame();
            });
        }
    },
    account: {
        setRenderUser: function(data) {
            if (typeof data !== `undefined`) {
                if (typeof data.discord !== `undefined`) {
                    if (typeof data.minecraft !== `undefined`) {
                        userbt_login_box.onclick = () => {
                            client.menu.ecene(`user`);
                        };
                        if (data.minecraft !== null) {
                            CThief_.getFromUrl(`https://sws-island-server-main.herokuapp.com/api/minecraft/skins/${data.minecraft.username}/head`, (mcolor) => {
                                var avatar = `https://cdn.discordapp.com/avatars/${data.discord.id}/${data.discord.avatar}.webp`;
                                CThief_.getFromUrl(`${avatar}?size=16`, (dcolor) => {
                                    var name = data.minecraft.username.replace(data.minecraft.username[0], data.minecraft.username[0].toUpperCase());
                                    userbt_login_box.innerHTML = `<p style="--label-text-color: ${mcolor[0]} ${mcolor[1]} ${mcolor[2]};" class="label">${name}</p><div class="blb"><img class="full circle" src="https://sws-island-server-main.herokuapp.com/api/minecraft/skins/${data.minecraft.username}/head?size=64"></div>`;
                                    render_user_page.innerHTML = `<div style="--brand-color: ${dcolor[0]} ${dcolor[1]} ${dcolor[2]};" class="account_section discord"><h2>Cuenta de Discord</h2><div style="--user-brand-color: ${dcolor[0]} ${dcolor[1]} ${dcolor[2]};" class="discord_user_brand"><div class="banner"></div><div class="user"><div class="line"><img src="${avatar}?size=128" class="avatar"><h2><p class="us">${data.discord.username}</p><p class="ud">#${data.discord.discriminator}</p></h2></div></div></div></div><div style="--brand-color: ${mcolor[0]} ${mcolor[1]} ${mcolor[2]};" class="account_section island"><h2>Cuenta de Island</h2><div class="island_user_brand" style="--user-skin-dominant-color: ${mcolor[0]} ${mcolor[1]} ${mcolor[2]};"><img src="${`https://sws-island-server-main.herokuapp.com/api/minecraft/skins/${data.minecraft.username}/head?size=512`}" class="avatar"><div class="user"><h2 class="susername">${name}</h2><h2 class="nsusername">@${data.minecraft.username}</h2></div></div>`;
                                });
                            });
                        } else {
                            var avatar = `https://cdn.discordapp.com/avatars/${data.discord.id}/${data.discord.avatar}.webp`;
                            CThief_.getFromUrl(`${avatar}?size=16`, (dcolor) => {
                                userbt_login_box.innerHTML = `<p class="label">No Registrado</p><div class="blb"><img class="full circle" src="https://sws-island-server-main.herokuapp.com/api/minecraft/skins/steve/head?size=64"></div>`;
                                var id = crypto.randomUUID();
                                client.bt[id] = function() {
                                    node.ipc.sendSync(`open-url`, { url: `https://www.discord.gg/FjkC3RBArc` });
                                };
                                render_user_page.innerHTML = `<div style="--brand-color: ${dcolor[0]} ${dcolor[1]} ${dcolor[2]};" class="account_section discord"><h2>Cuenta de Discord</h2><div style="--user-brand-color: ${dcolor[0]} ${dcolor[1]} ${dcolor[2]};" class="discord_user_brand"><div class="banner"></div><div class="user"><div class="line"><img src="${avatar}?size=128" class="avatar"><h2><p class="us">${data.discord.username}</p><p class="ud">#${data.discord.discriminator}</p></h2></div></div></div></div><div style="--brand-color: ${25} ${25} ${25};" class="account_section island"><h2>Cuenta de Island</h2><h3>Este usuario no esta registrado</h3><h4>Solicita accesso a un moderador en el server de Discord!</h4><button onclick="client.bt['${id}']();">Unirse a Discord</button>`;
                            });
                        };
                    };
                };
            };
        },
        login: {
            setEcene: function (name) {
                var ecenes = [
                    {
                        name: 'loader'
                    },
                    {
                        name: 'buttons'
                    },
                    {
                        name: 'logged_render'
                    },
                    {
                        name: 'loader_wc'
                    }
                ];
                var isValidName = false;
                var isValidNameIndex = null;
                for (let index = 0; index < ecenes.length; index++) {
                    const element = ecenes[index];
                    if (!isValidName) {
                        if (element.name == name) {
                            isValidName = true;
                            isValidNameIndex = index;
                        };
                    };
                };
                if (isValidName) {
                    boxLoginClientEcenes.style.transform = `translateX(${(25 * 16)}px)`;
                    setTimeout(() => {
                        boxLoginClientEcenes.className = `box ${name}`;
                        boxLoginClientEcenes.style.transition = `transform 0s`;
                        boxLoginClientEcenes.style.transform = `translateX(${((-25 * 16))}px)`;
                        setTimeout(() => {
                            boxLoginClientEcenes.style.transition = ``;
                            boxLoginClientEcenes.style.transform = `translateX(${(0)}px)`;
                        }, (100 / 2));
                    }, (100 / 2));
                };
            },
            useDiscord: () => {
                node.ipc.sendSync(`open-login-discord`);
                client.account.login.setEcene(`loader_wc`);
                var get = null;
                // boxLoginClientEcenes
                boxLoginLoaderWC_cancel_button.onclick = () => {
                    if (!cancel) {
                        cancel = true;
                        node.ipc.sendSync('open-login-discord-cancel');
                        client.account.login.setEcene(`loader`);
                        setTimeout(() => {
                            client.account.login.setEcene(`buttons`);
                        }, 750);
                    };
                };
                var cancel = false;
                var rel = function() {
                    if (!cancel) {
                        get = node.ipc.sendSync('open-login-discord-get');
                        if (typeof get.data !== 'undefined') {
                            if (typeof get.data.token !== 'undefined') {
                                if (typeof get.data.user !== 'undefined') {
                                    if (typeof get.data.user.dominant_color !== 'undefined') {
                                        if (typeof get.data.user.discord !== 'undefined') {
                                            cancel = true;
                                            client.account.login.setEcene(`loader`);
                                            client_app_context_main_userece.className = `userece main`;
                                            setTimeout(() => {
                                                client_app_context_ecenes.className = `ecenes main`;
                                            }, 250);
                                            client.account.setRenderUser({ discord: get.data.user.discord, minecraft: get.data.user.mcuser });
                                            if (get.data.user.mcuser !== null) {
                                                console.log(`log successfully, hi ${get.data.user.discord.username} as ${get.data.user.mcuser.username}`);
                                            } else {
                                                console.log(`log successfully, hi ${get.data.user.discord.username} as ¿?¿?¿?¿?¿?¿?`);
                                            };
                                            setTimeout(() => {
                                                node.ipc.sendSync('open-login-discord-get-clear');
                                            }, 750);
                                        };
                                    };
                                };
                            };
                        };
                        setTimeout(() => {
                            rel();
                        }, 250);                        
                    };
                };
                rel();
            }
        },
        token: null,
        getUserByToken: function(callback, token) {
            var useToken = null;
            if (typeof token !== `undefined`) {
                useToken = token;
            } else {
                if (client.account.token !== null) {
                    useToken = client.account.token;
                };
            };
            if (useToken !== null) {
                jQuery.ajax({
                    type: `POST`,
                    timeout: 45000,
                    url: `https://sws-island-server-main.herokuapp.com/api/science`,
                    data: {
                        type: `getUserInfoFromToken`,
                        use: {
                            token: useToken
                        }
                    },
                    success: (data) => {
                        if (data.err) {
                            console.error(data.err);
                            callback(data.err, null);
                        } else {
                            callback(data.err, data.data);
                        };
                    },
                    error: (err) => {
                        if (err.statusText === `timeout`) {
                            client.account.getUserByToken(callback, useToken);
                        } else {
                            callback(err, null);
                        };
                    }
                });
            };
        }
    }
};

window.onload = () => {
    CThief = new ColorThief();
    CThief_ = {
        getFromUrl: function (url, callback) {
            if (typeof url !== `undefined`) {
                var tpImg = new Image();
                tpImg.crossOrigin = `anonymous`;
                tpImg.onload = function () {
                    var color = CThief.getColor(tpImg);
                    callback(color);
                };
                tpImg.src = url;
            };
        }
    };
    magicLaunchButton = {
        allowClic: function() {
            client_app_context_main_launch_button.classList.remove(`noClic`);
        },
        disableClic: function () {
            client_app_context_main_launch_button.classList.add(`noClic`);
        },
        setText: function (stringtext) {
            client_app_context_main_launch_button_text.classList.add(`hide`);
            setTimeout(() => {
                client_app_context_main_launch_button.style.width = `${((stringtext.length) * (14))}px`;
                setTimeout(() => {
                    client_app_context_main_launch_button_text.classList.remove(`hide`);
                    client_app_context_main_launch_button_text.innerHTML = stringtext;
                }, 250);
            }, 250);
        },
        setColor: function (color) {
            client_app_context_main_launch_button.style.setProperty(`--use-color`, color);
        }
    };
    client.sys.init();
    magicLaunchButton.disableClic();
    magicLaunchButton.setText(`Espera...`);
    client_app_context_ecenes.className = `ecenes loader`;
    client_app_context_main_userece.className = `userece main`;
    var loginToken = node.settings.get()[`login.token`];
    if (typeof loginToken !== `undefined`) {
        if (loginToken !== null) {
            if (loginToken !== 'null') {
                console.log(`has a token, trying to login...`);
                client.account.getUserByToken((err, data)=>{
                    if (err) {
                        console.log(err);
                        if (err.code === `syx`) {
                            console.log(`token is invalid.`);
                            client_app_context_ecenes.className = `ecenes login`;
                        };
                    } else {
                        client.account.token = loginToken;
                        console.log(`log successfully, hi ${data.discord.username} as ${data.minecraft.username}`);
                        magicLaunchButton.setText(`Play`);
                        magicLaunchButton.allowClic();
                        client.account.setRenderUser({ discord: data.discord, minecraft: data.minecraft });
                        setTimeout(() => {
                            client_app_context_ecenes.className = `ecenes main`;
                        }, 250);
                    };
                }, loginToken);
            } else {
                console.log(`no token, asking for account...`);
                client_app_context_ecenes.className = `ecenes login`;
            };
        } else {
            console.log(`no token, asking for account...`);
            client_app_context_ecenes.className = `ecenes login`;
        };
    } else {
        console.log(`no token, asking for account...`);
        client_app_context_ecenes.className = `ecenes login`;
    };
};

isAppFocused = true;

onStartFocus = [];
onStartFocus_ = false;

window.onfocus = function() {
    isAppFocused = true;
    if (!onStartFocus_) {
        onStartFocus_ = true;
        for (let index = 0; index < onStartFocus.length; index++) {
            const element = onStartFocus[index];
            element();
        };
    };
};

window.onblur = function () {
    isAppFocused = false;
};