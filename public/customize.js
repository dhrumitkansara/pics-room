const submitBtn = document.getElementById("submitBtn");
let srcData;

// Function that converts image to base64 url
const encodeImageFileAsURL = () => {
  let filesSelected = document.getElementById("inputFileToLoad").files;
  if (filesSelected.length > 0) {
    let fileToLoad = filesSelected[0];

    let fileReader = new FileReader();

    fileReader.onload = (fileLoadedEvent) => {
      srcData = fileLoadedEvent.target.result; // Converting image to data: base64
    };
    fileReader.readAsDataURL(fileToLoad);
  }
};

submitBtn.addEventListener("click", async () => {
  if (srcData === undefined) {
    alert("src data is empty");
  }
  const frameObjectData = { frameUrl: srcData };
  await axios.post("/admin/add-frame", frameObjectData); // Sending POST request to backend
  window.location.reload();
});
