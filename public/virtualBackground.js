// JS for selfie frontend lives here...

const videoGrid = document.getElementById("video-grid"); // Getting video-grid div
const myVideo = document.createElement("video"); // Creating video element in HTML
myVideo.muted = true;
myVideo.setAttribute("width", "400");
myVideo.setAttribute("height", "300");

const btnCapture = document.getElementById("btn-capture");

let captureDiv = document.getElementById("capture-div");

let canvasOutput = document.getElementById("output-canvas");
let outputContext = canvasOutput.getContext("2d");

// Creating temp canvas for processing each frame before outputting it
let canvasTemp = document.createElement("canvas");
let tempContext = canvasTemp.getContext("2d");
let backgroundImage = document.createElement("img");

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
    removeBackground();
  });
  videoGrid.append(video); // Appending video to video-grid div
  // removeBackground();
};

const removeBackground = async () => {
  // const canvas = document.querySelector("canvas");
  // const ctx = canvas.getContext("2d");

  // Loading the model
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2,
  });

  // Segmentation
  const { data: map } = await net.segmentPerson(myVideo, {
    internalResolution: "medium",
  });

  // Extracting image data
  const { data: imgData } = outputContext.getImageData(
    0,
    0,
    canvasOutput.width,
    canvasOutput.height
  );
  console.log(imgData);

  // Creating new image data
  const newImg = outputContext.createImageData(
    canvasOutput.width,
    canvasOutput.height
  );
  console.log("new image: ", newImg);
  const newImgData = newImg.data;

  backgroundImage.src =
    "https://analyticsindiamag.com/wp-content/uploads/2020/10/7d744a684fe03ebc7e8de545f97739dd.jpg";
  backgroundImage.setAttribute("crossOrigin", "");

  outputContext.drawImage(
    backgroundImage,
    0,
    0,
    canvasOutput.width,
    canvasOutput.height
  ); // For background stream
  let backgroundFrame = outputContext.getImageData(
    0,
    0,
    canvasOutput.width,
    canvasOutput.height
  );
  let backgroundFrameData = backgroundFrame.data;

  for (let i = 0; i < map.length; i++) {
    //The data array stores four values for each pixel
    const [r, g, b, a] = [
      imgData[i * 4],
      imgData[i * 4 + 1],
      imgData[i * 4 + 2],
      imgData[i * 4 + 3],
    ];
    [
      newImgData[i * 4],
      newImgData[i * 4 + 1],
      newImgData[i * 4 + 2],
      newImgData[i * 4 + 3],
    ] = !map[i]
      ? [
          backgroundFrameData[i * 4 + 0],
          backgroundFrameData[i * 4 + 1],
          backgroundFrameData[i * 4 + 2],
          1000,
        ]
      : [r, g, b, a];
  }

  // Draw the new image back to canvas
  outputContext.putImageData(newImg, 0, 0);
  setTimeout(removeBackground, 0);
};
