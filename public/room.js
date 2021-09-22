// JS for room frontend lives here...

// Import statements
const socket = io("/");

const videoGrid = document.getElementById("video-grid"); // Getting video-grid div
const myVideo = document.createElement("video"); // Creating video element in HTML
myVideo.muted = true;
const peers = {};

const btnCapture = document.getElementById("btn-capture");

let captureDiv = document.getElementById("capture-div");

let peer = new Peer(undefined, {
  path: "/peerjs", // Coming from server
  host: "/",
  port: "443",
});

// Gets video and audio from browser
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream); // Passing video element and stream to addVideoStream()

    // Answering a call from new user and add stream
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // Gets executed when user connected emits
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream); // Passing user id and user's stream from promise above to connectToNewUser()
    });
  });

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

// Emitting join room event
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id); // Passing room id on joining the room
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream); // Calling user id and sending own stream
  const video = document.createElement("video"); // Creating video element for new user
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream); // Adding user's stream
  });
  peers[userId] = call;
};

// Adding video stream
const addVideoStream = (video, stream) => {
  video.srcObject = stream; // Adding stream to video source
  video.addEventListener("loadeddata", () => {
    video.play(); // Plays video when video data is loaded
  });
  videoGrid.append(video); // Appending video to video-grid div
};

// Capturing group selfie on capture button click
btnCapture.addEventListener("click", () => {
  let reCaptureButton = document.createElement("button"); // Creating recapture button
  let dowloadButton = document.createElement("button"); // Creating download button
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  context.drawImage(videoGrid, 0, 0, 400, 300); // TODO: Capture all videos on screen instead of user's video only

  let data = canvas.toDataURL("image/png");
  videoGrid.innerHTML = "";
  // videoGrid.innerHTML = `<img src='${data}' width = '400' height = '300' alt='The screen capture will appear here.' />`;

  btnCapture.remove(); // Removing capture button to place recapture button
  canvasOutput.innerHTML = `<img src='${data}' width = '400' height = '300' alt='The screen capture will appear here.' />`;

  // HTML for recapture button
  reCaptureButton.innerHTML = `
  <button
    class="fas fa-camera"
    style="color: black; height: 50px; width: 200px; cursor: pointer"
    onclick="window.location.reload()"
  >
    &nbsp;
    <span>Recapture</span>
  </button>`;

  captureDiv.appendChild(reCaptureButton); // Appending recapture button on UI

  // HTML for download button
  dowloadButton.innerHTML = `
  <button
    class="fas fa-download"
    style="color: black; height: 50px; width: 200px; cursor: pointer"
    onclick="downloadImage()"
  >
    <span>Download</span>
  </button>`;

  captureDiv.appendChild(dowloadButton); // Appending download button on UI
});

// Function to download captured image
const downloadImage = () => {
  const captureURL = canvasOutput.toDataURL("image/png");
  // Creating and setting up document for downloading captured image
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  a.href = captureURL;
  a.download = `snapshot-${new Date()
    .toJSON()
    .slice(0, 10)
    .replace(/-/g, "")}.png`;
  a.click();
};
