const eventName = document.getElementById("name");
const eventDate = document.getElementById("date");
const submitBtn = document.getElementById("submitBtn");
const errorDiv = document.getElementById("error-div");
const eventModalDiv = document.getElementById("eventConfirmationModal");
let deleteEventModalDiv = document.getElementById("deleteConfirmationModal");

let validationErrorFlag = false;
let allEventsData;
let activeEvent;
let toBeUpdatedEventId;
let updatedStatus;
let eventActive = false;
let notificationString = "";
let toBeDeletedEventId;

submitBtn.addEventListener("click", async () => {
  //   Form data validations
  if (_.isEmpty(eventName.value)) {
    validationErrorFlag = true;
    errorDiv.innerHTML = `<p style="color: red"> Please enter event name! </p>`;
  }

  if (_.isEmpty(eventDate.value)) {
    validationErrorFlag = true;
    errorDiv.innerHTML = `<p style="color: red"> Please select event date! </p>`;
  }

  if (validationErrorFlag == false) {
    const eventObjectData = {
      name: eventName.value,
      date: eventDate.value,
      status: "inactive",
      deleted: false,
    };

    // Sending POST request to backend
    await fetch("/admin/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventObjectData),
    }).catch((error) => {
      console.error("Error:", error);
    });
    window.location.reload();
  }
});

const changeEventStatus = (id) => {
  toBeUpdatedEventId = id;
  allEventsData.map((eventData) => {
    if (eventData.status === "active") {
      eventActive = true;
      if (eventData._id === id) {
        notificationString = "";
        updatedStatus = "inactive"; // Setting status inactive if active
        eventActive = false;
      }
    }

    // Allow user to change status if no event is empty
    if (eventActive === false) {
      //   Matching event based on id
      if (eventData._id === id) {
        if (eventData.status === "active") {
          updatedStatus = "inactive"; // Setting status inactive if active
        } else {
          updatedStatus = "active"; // Setting status active if inactive
        }
      }
    } else {
      notificationString = `<strong style="color: red"> You can only run one event at a time! </strong>`;
    }
  });

  if (notificationString === "") {
    eventModalDiv.innerHTML = `
    <div
      class="modal-dialog modal-dialog-centered"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="eventConfirmationModalLongTitle">
            Update event status?
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
        <div class="modal-body">Are you sure, you want to update the event status? This will update all data associated with the event.</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Cancel
          </button>
          <button type="button" onclick="updateEventStatus()" class="btn btn-primary">
            Update
          </button>
          <br />
        <div>${notificationString}</div>
        </div>
      </div>
    </div>`;
  } else {
    eventModalDiv.innerHTML = `
    <div
      class="modal-dialog modal-dialog-centered"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="eventConfirmationModalLongTitle">
            Oops!
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
        <div class="modal-body">You can run only one event at a time.</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>`;
  }
};

const updateEventStatus = async () => {
  if (!eventActive) {
    const eventUpdateObject = { id: toBeUpdatedEventId, status: updatedStatus };

    // Sending POST request to backend
    await fetch("/admin/update-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventUpdateObject),
    }).catch((error) => {
      console.error("Error:", error);
    });
    window.location.reload();
  }
};

const deleteEvent = (id) => {
  toBeDeletedEventId = id;
  deleteEventModalDiv.innerHTML = `
  <div
    class="modal-dialog modal-dialog-centered"
    role="document"
  >
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id=deleteConfirmationModalLongTitle">
        Delete event?
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
    <div class="modal-body">Are you sure, you want to delete event? The data associated with the event will still be available.</div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          data-dismiss="modal"
        >
          Cancel
        </button>
        <button type="button"  onclick="deleteCurrentEvent()" class="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  </div>`;
};

const deleteCurrentEvent = async () => {
  const eventUpdateObject = { id: toBeDeletedEventId, deleted: true };
  // Sending POST request to backend
  await fetch("/admin/delete-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventUpdateObject),
  }).catch((error) => {
    console.error("Error:", error);
  });
  window.location.reload();
};

window.onload = async () => {
  // Sending GET request to backend
  await fetch("/admin/load-events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      allEventsData = data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Fetching active event from backend
  await fetch("/admin/get-active-event", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      activeEvent = data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
