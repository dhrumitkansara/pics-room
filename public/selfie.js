// JS for selfie frontend lives here...

const videoGrid = document.getElementById("video-grid"); // Getting video-grid div
const myVideo = document.createElement("video"); // Creating video element in HTML
myVideo.muted = true;

const btnCapture = document.getElementById("btn-capture");

let captureDiv = document.getElementById("capture-div");
let data;

// Creating temp canvas for processing each frame before outputting it
let canvasTemp = document.createElement("canvas");
let tempContext = canvasTemp.getContext("2d");
let backgroundVideo = document.createElement("video");

let frameImage = document.getElementById("frame-image");

// 3D Glass elements
// let video = document.createElement("video");
let canvas = document.createElement("canvas");
let overlay = document.createElement("canvas");

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
  video.addEventListener("loadeddata", () => {
    video.play(); // Plays video when video data is loaded
  });
  videoGrid.append(video); // Appending video to video-grid div
};

// Capturing selfie on capture button click
btnCapture.addEventListener("click", () => {
  let reCaptureButton = document.createElement("button"); // Creating recapture button
  let dowloadButton = document.createElement("button"); // Creating download button
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  context.drawImage(myVideo, 0, 0, 400, 300);

  data = canvas.toDataURL("image/png");
  videoGrid.innerHTML = "";
  btnCapture.remove(); // Removing capture button to place recapture button
  videoGrid.innerHTML = `<img src='${data}' width = '400' height = '300' alt='The screen capture will appear here.' />`;

  // HTML for recapture button
  reCaptureButton.innerHTML = `
  <button
    class="fas fa-camera"
    style="color: black; height: 50px; width: 200px; cursor: pointer"
    onclick="window.location.reload()"
  >
    &nbsp;
    <span>Recapture</span>
  </button>
  <button
    class="fas fa-check"
    style="color: black; height: 50px; width: 200px; cursor: pointer"
    onclick='postCaptureData(data)'>
    &nbsp;
    <span>Confirm</span>
  </button>`;

  captureDiv.appendChild(reCaptureButton); // Appending recapture button on UI

  // HTML for download button
  // dowloadButton.innerHTML = `
  // <button
  //   class="fas fa-download"
  //   style="color: black; height: 50px; width: 200px; cursor: pointer"
  //   onclick="downloadImage()"
  // >
  //   <span>Download</span>
  // </button>`;

  // captureDiv.appendChild(dowloadButton); // Appending download button on UI
});

const postCaptureData = async (data) => {
  const sendData = { data }; // Creating JSON object to pass it to backend
  await axios.post("/save-capture-data", sendData); // Sending POST request to backend
};

// Function to download captured image
// const downloadImage = () => {
//   html2canvas(document.getElementById("main-videos")).then((canvas) => {
//     document.body.append(canvas);
//     const captureURL = canvas.toDataURL("image/png");
//     // Creating and setting up document for downloading captured image
//     const a = document.createElement("a");
//     document.body.appendChild(a);
//     a.style.display = "none";
//     a.href = captureURL;
//     a.download = `snapshot-${new Date()
//       .toJSON()
//       .slice(0, 10)
//       .replace(/-/g, "")}.png`;
//     a.click();
//   });
// };

// setFrame method to set filters on video
const setFrame = (frameUrl) => {
  frameImage.src = frameUrl;
};

// setFilter method to set filters on video
const setFilter = (property) => {
  myVideo.style.filter = property; // Setting filter to video
};
