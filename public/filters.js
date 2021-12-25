// JS for filter selfie frontend lives here...

const videoGrid = document.getElementById("video-grid"); // Getting video-grid div
const myVideo = document.createElement("video"); // Creating video element in HTML
myVideo.muted = true;

const filterDiv = document.getElementById("filter-select");

const btnCapture = document.getElementById("btn-capture");

let captureDiv = document.getElementById("capture-div");

let data;

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
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  context.drawImage(myVideo, 0, 0, 400, 300);

  data = canvas.toDataURL("image/png");
  videoGrid.innerHTML = "";
  filterDiv.innerHTML = "";
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
});

const postCaptureData = async (data) => {
  const sendData = { data }; // Creating JSON object to pass it to backend

  // Sending POST request to backend
  await fetch("/save-capture-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  }).catch((error) => {
    console.error("Error:", error);
  });
};

// setFilter method to set filters on video
const setFilter = (property) => {
  videoGrid.style.filter = property;
};
