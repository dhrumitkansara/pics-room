const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
myVideo.setAttribute("width", "400");
myVideo.setAttribute("height", "300");

const canvasPerson = document.getElementById("output-canvas");
let contextPerson = canvasPerson.getContext("2d");

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
  });

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadeddata", () => {
    video.play();
    removeBackground();
  });
  videoGrid.append(video);
};

const removeBackground = async () => {
  // Loading the model
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2,
  });

  const segmentation = await net
    .segmentPerson(myVideo, {
      flipHorizontal: true,
      internalResolution: "medium",
      segmentationThreshold: 0.5,
    })
    .then((personSegmentation) => {
      if (personSegmentation != null) {
        drawBody(personSegmentation);
      }
    });
  setTimeout(removeBackground, 0);
};

const drawBody = (personSegmentation) => {
  contextPerson.drawImage(myVideo, 0, 0, myVideo.width, myVideo.height);
  let imageData = contextPerson.getImageData(
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
  contextPerson.imageSmoothingEnabled = true;
  contextPerson.putImageData(imageData, 0, 0);
};
