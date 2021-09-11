// JS for selfie frontend lives here...

const videoGrid = document.getElementById("video-grid"); // Getting video-grid div
const myVideo = document.createElement("video"); // Creating video element in HTML
myVideo.muted = true;

const btnCapture = document.getElementById("btn-capture");

// Gets video and audio from browser
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
  });

// Adding video stream
const addVideoStream = (video, stream) => {
  video.srcObject = stream; // Adding stream to video source
  video.addEventListener("loadedmetadata", () => {
    video.play(); // Plays video when video data is loaded
  });
  videoGrid.append(video); // Appending video to video-grid div
};

btnCapture.addEventListener("click", () => {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  context.drawImage(myVideo, 0, 0, 400, 300);

  let data = canvas.toDataURL("image/png");
  videoGrid.innerHTML = "";
  videoGrid.innerHTML = `<img src='${data}' width = '400' height = '300' alt='The screen capture will appear here.' />`;
});
