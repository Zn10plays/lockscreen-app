const { BrowserWindow, screen } = require('electron');
let path = require('path')

global.list = []
var screens = function() {
    return screen.getAllDisplays()
}



function mackLockScreen() {
    let screens_ = screens()
    Object.keys(screens_).forEach(display=>{
        display=screens_[display]
        let win = openWindowOnMonitor(display,{ //I want it to do it for every screen
            height:display.bounds.height,
            width:display.bounds.width,
            frame:false,
            webPreferences: {
                nodeIntegration: true
            },
        });
        win.loadFile('..\.\lockscreen\newScreen.html');
        list.push(win)
    })
}

function closeLockScreen() {
    if(list.length<=0) return 0;
    let window = list.splice(0,1)[0]
    window.close();
    closeLockScreen()
}

module.exports = {
    makeWin:mackLockScreen,
    closeWin:closeLockScreen,
}

function openWindowOnMonitor(mon,cfg){
    const monitor = mon || screen.getPrimaryDisplay()
    const { x, y } = monitor.bounds
    return new BrowserWindow(Object.assign(cfg,{
        x: x + (cfg.x||0),
        y: y + (cfg.y||0)
    }))
}
