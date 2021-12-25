const eventName = document.getElementById("name");
const eventDate = document.getElementById("date");
const submitBtn = document.getElementById("submitBtn");
const errorDiv = document.getElementById("error-div");
const notificationDiv = document.getElementById("notification");

let validationErrorFlag = false;
let allEventsData;
let activeEvent;

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

const changeEventStatus = async (id) => {
  let updatedStatus;
  let eventActive = false;
  allEventsData.map((eventData) => {
    if (eventData.status === "active") {
      eventActive = true;
      if (eventData._id === id) {
        notificationDiv.style.display = "none";
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
      notificationDiv.innerHTML = `<strong style="color: red"> You can only run one event at a time! </strong>`;
    }
  });

  //   Updating event's status
  if (!eventActive) {
    const eventUpdateObject = { id, status: updatedStatus };
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
