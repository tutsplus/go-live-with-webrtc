var localConnection, remoteConnection, sendChannel, receiveChannel;


//RTCPeerconnection shim
var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;


// textareas for sending and receiving
var sendBox = document.getElementById('local');
var recvBox = document.getElementById('remote');


// Buttons
var connectButton = document.getElementById('connectButton');
var sendButton = document.getElementById('sendButton');
var closeButton = document.getElementById('closeButton');

connectButton.disabled = false;
sendButton.disabled = true;
closeButton.disabled = true;

connectButton.onclick = connectSender;
sendButton.onclick = sendMessage;
closeButton.onclick = closeChannel;



function connectSender() {
    var servers = null;
    localConnection = new RTCPeerConnection(servers);
    localConnection.onicecandidate = localCandidate;
    
    sendChannel = localConnection.createDataChannel('sendChannel');
    sendChannel.onopen = channelChange;
    sendChannel.onclose = channelChange;
    
    remoteConnection = new RTCPeerConnection(servers);
    remoteConnection.onicecandidate = remoteCandidate;
    remoteConnection.ondatachannel = theReceiveChannel;
    
    localConnection.createOffer(localDescription, signalError);
    
    connectButton.disabled = true;
    
    
}

function sendMessage() {
    var message = sendBox.value;
    sendChannel.send(message);
    
    sendBox.value = '';
}

function channelChange() {
    var readyState = sendChannel.readyState;
    if (readyState == "open") {
        sendBox.disabled = false;
        
        closeButton.disabled = false;
        sendButton.disabled = false;
    } else {
        sendBox.disabled = true;
        
        closeButton.disabled = true;
        sendButton.disabled = true;
    }
}

function theReceiveChannel(event) {
    receiveChannel = event.channel; 
    receiveChannel.open = recChannelChange;
    receiveChannel.close = recChannelChange;
    receiveChannel.onmessage = recMessage;
}


function recMessage(event) {
    recvBox.value = event.data;
}


function recChannelChange() {
    var readyState = receiveChannel.readyState;
    alert(readyState);
}



function closeChannel() {
    sendChannel.close();
    receiveChannel.close();
    
    
    localConnection.close();
    remoteConnection.close();

    sendChannel = null;
    receiveChannel = null;
    localConnection = null;
    remoteConnection = null;
    
    connectButton.disabled = false;
    sendButton.disabled = true;
    closeButton.disabled = true;
    
    sendBox.value = '';
    recvBox.value = '';
    
}




function localDescription(description) {
    localConnection.setLocalDescription(description);
    remoteConnection.setRemoteDescription(description);
    
    remoteConnection.createAnswer(remoteDescription, signalError);
} 


function remoteDescription(description) {
    remoteConnection.setLocalDescription(description);
    localConnection.setRemoteDescription(description);
}

function signalError(error) {
    console.log("Signal error: " + error.name);
}

function localCandidate(event) {
    if (event.candidate) {
        remoteConnection.addIceCandidate(event.candidate);
    }   
}


function remoteCandidate(event) {
    if (event.candidate) {
        localConnection.addIceCandidate(event.candidate);
    }   
}

