// JS for selfie frontend lives here...

const videoGrid = document.getElementById("video-grid"); // Getting video-grid div
const myVideo = document.createElement("video"); // Creating video element in HTML
myVideo.muted = true;

const btnCapture = document.getElementById("btn-capture");

let captureDiv = document.getElementById("capture-div");
let canvasOutput = document.getElementById("output-canvas");
let outputContext = canvasOutput.getContext("2d");

// Creating temp canvas for processing each frame before outputting it
let canvasTemp = document.createElement("canvas");
let tempContext = canvasTemp.getContext("2d");
let backgroundVideo = document.createElement("video");

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
  let reCaptureButton = document.createElement("button"); // Creating recapture button
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  context.drawImage(myVideo, 0, 0, 400, 300);

  let data = canvas.toDataURL("image/png");
  videoGrid.innerHTML = "";
  btnCapture.remove(); // Removing capture button to place recapture button
  canvasOutput.innerHTML = `<img src='${data}' width = '400' height = '300' alt='The screen capture will appear here.' />`;

  // HTML for recapture button
  reCaptureButton.innerHTML = `
  <button
    id="btn-capture"
    class="fas fa-camera"
    style="color: black; height: 50px; width: 200px; cursor: pointer"
    onclick="window.location.reload()"
  >
    <span>Recapture</span>
  </button>`;

  captureDiv.appendChild(reCaptureButton); // Appending recapture button on UI
});

// Init function that executes on page load for setting up stuff for other background load
const init = () => {
  canvasTemp.setAttribute("width", 400);
  canvasTemp.setAttribute("height", 300);

  backgroundVideo.src =
    "https://static.videezy.com/system/resources/previews/000/018/965/original/blue-plate.mp4";
  backgroundVideo.muted = true;
  backgroundVideo.autoplay = true;
  backgroundVideo.loop = true;
  backgroundVideo.setAttribute("crossOrigin", "");

  myVideo.addEventListener("loadedmetadata", computeFrame());
};

// For removing background from video stream
const computeFrame = () => {
  tempContext.drawImage(myVideo, 0, 0, 400, 300); // For actual stream
  let mainFrame = tempContext.getImageData(0, 0, 400, 300);

  tempContext.drawImage(backgroundVideo, 0, 0, 400, 300); // For background stream
  let backgroundFrame = tempContext.getImageData(0, 0, 400, 300);

  for (let i = 0; i < mainFrame.data.length / 4; i++) {
    let red = mainFrame.data[i * 4 + 0];
    let green = mainFrame.data[i * 4 + 1];
    let blue = mainFrame.data[i * 4 + 2];

    // Checking rgb value is green or close to green
    if (
      red > 70 &&
      red < 160 &&
      green > 95 &&
      green < 220 &&
      blue > 25 &&
      blue < 150
    ) {
      // Replacing original background with stock video
      mainFrame.data[i * 4 + 0] = backgroundFrame.data[i * 4 + 0]; // Red
      mainFrame.data[i * 4 + 1] = backgroundFrame.data[i * 4 + 1]; // Green
      mainFrame.data[i * 4 + 2] = backgroundFrame.data[i * 4 + 2]; // Blue
    }
  }

  outputContext.putImageData(mainFrame, 0, 0);
  setTimeout(computeFrame, 0);
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
