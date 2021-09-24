// JS for virtual background frontend lives here...

const videoGrid = document.getElementById("video-grid"); // Getting video-grid div
const myVideo = document.createElement("video"); // Creating video element in HTML
myVideo.muted = true;
myVideo.setAttribute("width", "400");
myVideo.setAttribute("height", "300");

const btnCapture = document.getElementById("btn-capture");

let captureDiv = document.getElementById("capture-div");
let data;

const outputCanvas = document.getElementById("output-canvas");
let outputContext = outputCanvas.getContext("2d");

// Gets video and audio from browser
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream); // Passing video element and stream to addVideoStream()
  });

// Adding video stream
const addVideoStream = (video, stream) => {
  video.srcObject = stream; // Adding stream to video source
  video.addEventListener("loadeddata", () => {
    video.play(); // Plays video when video data is loaded
    removeBackground(); // Calling removeBackground() function for removing background from stream
  });
  videoGrid.append(video); // Appending video to video-grid div
};

const removeBackground = async () => {
  // Loading bodyPix model
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 8, // Enhanced for better body tracking
    multiplier: 0.75,
    quantBytes: 1, // Enhanced for better body tracking
  });

  // For getting segment of human from stream
  const segmentation = await net
    .segmentPerson(myVideo, {
      flipHorizontal: true,
      internalResolution: "medium", // Keeping resolution medium for low and mid end devices
      segmentationThreshold: 0.5,
    })
    .then((personSegmentation) => {
      if (personSegmentation != null) {
        drawBody(personSegmentation); // Calling draw segment method to draw human segment on the canvas
      }
    });
  setTimeout(removeBackground, 0); // Calling setTimeout to constantly keep calling it
};

// For drawing the human segment onto the canvas
const drawBody = (personSegmentation) => {
  outputContext.drawImage(myVideo, 0, 0, myVideo.width, myVideo.height);
  let imageData = outputContext.getImageData(
    0,
    0,
    myVideo.width,
    myVideo.height
  );
  let pixel = imageData.data;

  for (let p = 0; p < pixel.length; p += 4) {
    if (personSegmentation.data[p / 4] == 0) {
      pixel[p + 3] = 0;
    }
  }
  outputContext.imageSmoothingEnabled = true;
  outputContext.putImageData(imageData, 0, 0);
};

// Capturing selfie on capture button click
btnCapture.addEventListener("click", () => {
  let reCaptureButton = document.createElement("button"); // Creating recapture button
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  context.drawImage(outputCanvas, 0, 0, 400, 300);

  data = canvas.toDataURL("image/png");
  videoGrid.innerHTML = "";
  btnCapture.remove(); // Removing capture button to place recapture button
  outputCanvas.innerHTML = `<img src='${data}' width = '400' height = '300' alt='The screen capture will appear here.' />`;

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
  await axios.post("/save-capture-data", sendData); // Sending POST request to backend
};
