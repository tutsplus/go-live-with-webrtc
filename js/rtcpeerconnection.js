//variables
var localStream, localConnection, remoteConnection;


//video elements
var localVid = document.getElementById('localVid');
var remoteVid = document.getElementById('remoteVid');


//buttons
var connectButton = document.getElementById('connectButton');
var callButton = document.getElementById('callButton');
var hangupButton = document.getElementById('hangupButton');


//button states
connectButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;

//button event handlers
connectButton.onclick = connectCaller;
callButton.onclick = makeCall;
hangupButton.onclick = endCall;


//RTCPeerconnection shim
var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;




//connect function block - getUserMedia call
function connectCaller() { 
    connectButton.disabled = true;
    var constraints = {audio: true, video: true};
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia(constraints, successCallback, errorCallback);
}

function successCallback(stream) {
    callButton.disabled = false;
    localVid.src = URL.createObjectURL(stream);
    localStream = stream;
    localVid.play();
}

function errorCallback(error) { 
    console.log('Get user media error: ', error);
}



//make call function block - RTCpeerconnection
function makeCall() {
    callButton.disabled = true;
    hangupButton.disabled = false;
    var servers = null;
    localConnection = new RTCPeerConnection(servers);
    localConnection.onicecandidate = localCandidate;
    
    remoteConnection = new RTCPeerConnection(servers);
    remoteConnection.onicecandidate = remoteCandidate;
    
    remoteConnection.onaddstream = remoteStream;
    
    localConnection.addStream(localStream);
    
    localConnection.createOffer(localDescription, signalError);
}


function localCandidate(event) {
    if (event.candidate) {
        remoteConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    }   
}


function remoteCandidate(event) {
    if (event.candidate) {
        localConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    }   
}


function remoteStream(event) {
    remoteVid.src = URL.createObjectURL(event.stream);
    remoteVid.play();
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



//end call block
function endCall() {
    localConnection.close();
    remoteConnection.close();
    
    localConnection = null;
    remoteConnection = null;
    hangupButton.disabled = true;
    callButton.disabled = false;
    
}




