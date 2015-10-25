var userMedia1 = document.getElementById('userMedia1');
var userMedia2 = document.getElementById('userMedia2');
var peerConnection = document.getElementById('peerConnection');
var dataChannel = document.getElementById('dataChannel');


userMedia1.onclick = function() {
    location.href='getUserMedia.html';
};
userMedia2.onclick = function() {
    location.href='getUserMedia2.html';
};
peerConnection.onclick = function() {
    location.href='rtcpeerconnection.html';
};
dataChannel.onclick = function() {
    location.href='datachannel.html';
};














