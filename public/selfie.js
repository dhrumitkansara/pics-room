async function getWebCam() {
  try {
    const videoSrc = await navigator.mediaDevices.getUserMedia({ video: true });
    var video = document.getElementById("video");
    video.srcObject = videoSrc;
  } catch (e) {
    console.log(e);
  }
}

getWebCam();
var capture = document.getElementById("capture");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

capture.addEventListener("click", function () {
  context.drawImage(video, 0, 0, 650, 490);

  canvas.toBlob((blob) => {
    takePicture(
      blob,
      `snapshot-${new Date().toJSON().slice(0, 10).replace(/-/g, "")}.png`
    );
  });

  const takePicture = (function () {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    return function saveData(blob, fileName) {
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
    };
  })();
});
