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

const toggleChanged = async (event) => {
  // Enabling 3D glasses if enable glasses toggle is set to true
  if (event.target.checked === true) {
    await setupWebcam();
    // const video = document.createElement("video");
    myVideo.play();
    let videoWidth = myVideo.videoWidth;
    let videoHeight = myVideo.videoHeight;
    myVideo.width = videoWidth;
    myVideo.height = videoHeight;

    // let canvas = document.createElement("canvas");
    canvas.width = myVideo.width;
    canvas.height = myVideo.height;

    // let overlay = document.createElement("canvas");
    overlay.width = myVideo.width;
    overlay.height = myVideo.height;

    output = canvas.getContext("2d");
    output.translate(canvas.width, 0);
    output.scale(-1, 1); // Mirror cam
    output.fillStyle = "#fdffb6";
    output.strokeStyle = "#fdffb6";
    output.lineWidth = 2;

    // Load face landmarks detection
    model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );

    renderer = new THREE.WebGLRenderer({
      canvas: overlay, // document.getElementById("overlay"),
      alpha: true,
    });

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.position.x = videoWidth / 2;
    camera.position.y = -videoHeight / 2;
    camera.position.z = -(videoHeight / 2) / Math.tan(45 / 2); // Distance to z should be tan( fov / 2 )

    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xcccccc, 0.4));
    camera.add(new THREE.PointLight(0xffffff, 0.8));
    scene.add(camera);

    camera.lookAt({
      x: videoWidth / 2,
      y: -videoHeight / 2,
      z: 0,
      isVector3: true,
    });

    // Glasses from https://sketchfab.com/3d-models/heart-glasses-ef812c7e7dc14f6b8783ccb516b3495c
    glasses = await loadModel("../web/3d/heart_glasses.gltf");
    scene.add(glasses);

    trackFace(); // Calling track face function

    // TODO: Add capture image logic
  }
};

// Webcam setup
const setupWebcam = async () => {
  return new Promise((resolve, reject) => {
    // const video = document.getElementById("webcam");
    const navigatorAny = navigator;
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigatorAny.webkitGetUserMedia ||
      navigatorAny.mozGetUserMedia ||
      navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: true },
        (stream) => {
          myVideo.srcObject = stream;
          myVideo.addEventListener("loadeddata", resolve, false);
        },
        (error) => reject()
      );
    } else {
      reject();
    }
  });
};

// Loading the model using three.js
const loadModel = (file) => {
  return new Promise((res, rej) => {
    const loader = new THREE.GLTFLoader();
    loader.load(
      file,
      function (gltf) {
        res(gltf.scene);
      },
      undefined,
      function (error) {
        rej(error);
      }
    );
  });
};

// Tracking face from webcam
const trackFace = async () => {
  // const video = document.querySelector("video");
  output.drawImage(
    myVideo,
    0,
    0,
    myVideo.width,
    myVideo.height,
    0,
    0,
    myVideo.width,
    myVideo.height
  );
  renderer.render(scene, camera);

  const faces = await model.estimateFaces({
    input: myVideo,
    returnTensors: false,
    flipHorizontal: false,
  });

  faces.forEach((face) => {
    glasses.position.x = face.annotations.midwayBetweenEyes[0][0];
    glasses.position.y = -face.annotations.midwayBetweenEyes[0][1];
    glasses.position.z =
      -camera.position.z + face.annotations.midwayBetweenEyes[0][2];

    // Calculate an Up-Vector using the eyes position and the bottom of the nose
    glasses.up.x =
      face.annotations.midwayBetweenEyes[0][0] -
      face.annotations.noseBottom[0][0];
    glasses.up.y = -(
      face.annotations.midwayBetweenEyes[0][1] -
      face.annotations.noseBottom[0][1]
    );
    glasses.up.z =
      face.annotations.midwayBetweenEyes[0][2] -
      face.annotations.noseBottom[0][2];
    const length = Math.sqrt(
      glasses.up.x ** 2 + glasses.up.y ** 2 + glasses.up.z ** 2
    );
    glasses.up.x /= length;
    glasses.up.y /= length;
    glasses.up.z /= length;

    // Scale to the size of the head
    const eyeDist = Math.sqrt(
      (face.annotations.leftEyeUpper1[3][0] -
        face.annotations.rightEyeUpper1[3][0]) **
        2 +
        (face.annotations.leftEyeUpper1[3][1] -
          face.annotations.rightEyeUpper1[3][1]) **
          2 +
        (face.annotations.leftEyeUpper1[3][2] -
          face.annotations.rightEyeUpper1[3][2]) **
          2
    );
    glasses.scale.x = eyeDist / 6;
    glasses.scale.y = eyeDist / 6;
    glasses.scale.z = eyeDist / 6;

    glasses.rotation.y = Math.PI;
    glasses.rotation.z = Math.PI / 2 - Math.acos(glasses.up.x);
  });

  requestAnimationFrame(trackFace);
};
