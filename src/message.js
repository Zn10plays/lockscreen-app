module.exports = {
    "return":[],
    "_send": function (data,remote){
        return new Promise(rn=>{
            let id = Math.random().toString(36).slice(2)
            module.exports.return[id]=rn
            remote.send('message',{data,type:'request',id})
            setTimeout(()=>{
                module.exports.return[id](undefined)
                delete module.exports.return[id]
            },6e4)
        })
    },
    "responce": function (data,id,remote,win){
        if(win)
            return win.webContents.send('message',{data,type:'responce',id})
        return remote.send('message',{data,type:'responce',id})
    },
    "onmsg": function (data,msg,remote,send){
        if(typeof data!="object"||!data.type||!data.id) return 0;
        if(data.type=="responce"){
            if(module.exports.return[data.id]){
                module.exports.return[data.id](data.data)
                delete module.exports.return[data.id]
            }
        }else if(data.type=="request"){
            msg.emit('data',{
                data:data.data,
                return:d=>module.exports.responce(d,data.id,remote,send)
            })
        }
    },
    "window": function (){
        let events = require('events');
        class EventEmitter extends events {}

        let msg = new EventEmitter();

        let remote = require('electron').ipcRenderer
        remote.on('message',(e,d)=>module.exports.onmsg(d,msg,remote))

        msg.send = d=>module.exports._send(d,remote)

        return msg
    },
    "main": function (mainWindow){
        let events = require('events');
        class EventEmitter extends events {}

        let msg = new EventEmitter();

        let remote = require('electron').ipcMain
        remote.on('message',(e,d)=>module.exports.onmsg(d,msg,remote,mainWindow))

        msg.send = d=>module.exports._send(d,remote)

        return msg
    }
}