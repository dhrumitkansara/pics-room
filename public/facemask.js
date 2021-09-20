// JS for face tracker frontend lives here...

let faceTracker; // Face tracker
let videoInput;

let imgSpidermanMask; // Spiderman mask filter

//  p5.js library automatically executes the `preload()` function. Basically, it is used to load external files. In our case, we'll use it to load the images for our filters and assign them to separate variables for later use.
function preload() {
  imgSpidermanMask = loadImage("https://i.ibb.co/9HB2sSv/spiderman-mask-1.png"); // Spiderman mask filter assetilter asset
}

// In p5.js, `setup()` function is executed at the beginning of our program, but after the `preload()` function.
function setup() {
  pixelDensity(1);
  createCanvas(400, 300);

  // Webcam capture
  videoInput = createCapture(VIDEO);
  videoInput.size(400, 300);
  videoInput.hide();

  // Tracker
  faceTracker = new clm.tracker();
  faceTracker.init();
  faceTracker.start(videoInput.elt);
}

// In p5.js, draw() function is executed after setup(). This function runs inside a loop until the program is stopped.
function draw() {
  image(videoInput, 0, 0, 400, 300); // Render video from webcam
  drawSpidermanMask();
}

// Spiderman Mask Filter
function drawSpidermanMask() {
  const positions = faceTracker.getCurrentPosition();
  if (positions !== false) {
    push();
    const wx = Math.abs(positions[13][0] - positions[1][0]) * 1.2; // The width is given by the face width, based on the geometry
    const wy =
      Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) *
      1.2; // The height is given by the distance from nose to chin, times 2
    translate(-wx / 2, -wy / 2);
    image(imgSpidermanMask, positions[62][0], positions[62][1], wx, wy); // Show the mask at the center of the face
    pop();
  }
}
