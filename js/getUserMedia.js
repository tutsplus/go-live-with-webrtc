


navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


var constraints = {audio: true, video: {mandatory: { minWidth: 1280, minHeight: 720 }}};

var video = document.querySelector("video");


function successCallback(stream) {


window.stream = stream;



video.src = URL.createObjectURL(stream);

// Firefox and Opera: the src of the video can be set directly from the stream
//video.src = stream;

video.play();
}


function errorCallback(error){
console.log("navigator.getUserMedia error: ", error);
}


navigator.getUserMedia(constraints, successCallback, errorCallback);