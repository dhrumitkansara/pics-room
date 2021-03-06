const submitBtn = document.getElementById("submitBtn");
const errorDiv = document.getElementById("error-div");
const confirmationModal = document.getElementById("statusConfirmationModal");
let srcData;
let validationErrorFlag = false;
let updateFrameUrl;

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
  updateFrameUrl = frameUrl;
  confirmationModal.innerHTML = `
  <div
      class="modal-dialog modal-dialog-centered"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="statusConfirmationModalLongTitle">
            Update frame status?
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">Are you sure, you want to update the frame status? This will update frame status across the app.</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Cancel
          </button>
          <button type="button" onclick="updateFrameStatus()" class="btn btn-primary">
            Update
          </button>
        </div>
      </div>
    </div>`;
};

const updateFrameStatus = async () => {
  const frameObjectData = { frameUrl: updateFrameUrl };
  await fetch("/admin//update-frame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(frameObjectData),
  }).catch((error) => {
    console.error("Error:", error);
  });
  window.location.reload();
};
