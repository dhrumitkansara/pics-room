const submitBtn = document.getElementById("submitBtn");
const errorDiv = document.getElementById("error-div");
let srcData;
let validationErrorFlag = false;

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
  let status = document.querySelector("input[name = status]:checked").value;
  let selectedEvent = $('[name="events"]').val();

  if (_.isEmpty(srcData)) {
    validationErrorFlag = true;
    errorDiv.innerHTML = `<p style="color: red"> Please select a frame! </p>`;
  }

  if (_.isEmpty(selectedEvent)) {
    validationErrorFlag = true;
    errorDiv.innerHTML = `<p style="color: red"> Please select an event! </p>`;
  }

  if (validationErrorFlag == false) {
    const frameObjectData = { frameUrl: srcData, event: selectedEvent, status };

    // Sending POST request to backend
    await fetch("/admin/add-frame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(frameObjectData),
    }).catch((error) => {
      console.error("Error:", error);
    });
    window.location.reload();
  }
});

const setInactive = async (frameUrl) => {
  const frameObjectData = { frameUrl };
  await fetch("/admin//update-frame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(frameObjectData),
  }).catch((error) => {
    console.error("Error:", error);
  });
};
