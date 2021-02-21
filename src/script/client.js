let msg = require('./message.js').window()

const button = document.getElementById('nngh');

button.onclick = () => { 
    if(!button.classList.contains('locked')) {
        msg.send({method:'makeWin'})
    } else {
        msg.send({method:'closeWin'})
    }
    button.classList.toggle('locked')
}