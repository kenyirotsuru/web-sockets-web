function showToast(msg){
    console.log('el mensaje es ', msg);
    $.toast({
        text: msg, 
        position: 'top-right'
    })
}

window.socket = null;

function connectToSocketIo() {
    let server = window.location.protocol + '//' + window.location.host;
    window.socket = io.connect(server);

    window.socket.on('toast', function(data){
        showToast(data.message);
    })
}

function messageToServer(msg){
    window.socket.emit('message-to-server', {message: msg});
}

$(function(){
    //
    connectToSocketIo();
})