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

  let status = document.querySelector("input[name = status]:checked").value;
  let selectedEvent = $('[name="events"]').val();

  const frameObjectData = { frameUrl: srcData, event: selectedEvent, status };
  await axios.post("/admin/add-frame", frameObjectData); // Sending POST request to backend
  window.location.reload();
});

const setInactive = async (frameUrl) => {
  const frameObjectData = { frameUrl };
  await axios.post("/admin//update-frame", frameObjectData);
};
