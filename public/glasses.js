// JS for 3D glasses frontend lives here...

let output = null;
let model = null;
let renderer = null;
let scene = null;
let camera = null;
let glasses = null;

// Webcam setup
const setupWebcam = async () => {
  return new Promise((resolve, reject) => {
    const webcamElement = document.getElementById("webcam");
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
          webcamElement.srcObject = stream;
          webcamElement.addEventListener("loadeddata", resolve, false);
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
  const video = document.querySelector("video");
  output.drawImage(
    video,
    0,
    0,
    video.width,
    video.height,
    0,
    0,
    video.width,
    video.height
  );
  renderer.render(scene, camera);

  const faces = await model.estimateFaces({
    input: video,
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

(async () => {
  await setupWebcam();
  const video = document.getElementById("webcam");
  video.play();
  let videoWidth = video.videoWidth;
  let videoHeight = video.videoHeight;
  video.width = videoWidth;
  video.height = videoHeight;

  let canvas = document.getElementById("output");
  canvas.width = video.width;
  canvas.height = video.height;

  let overlay = document.getElementById("overlay");
  overlay.width = video.width;
  overlay.height = video.height;

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
    canvas: document.getElementById("overlay"),
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
})();

// TODO: Add capture image logic
