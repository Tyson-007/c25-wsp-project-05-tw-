window.onload = async () => {
  await getAllRooms();
  logout();
  // filterTable();
  selectorTabToggle();
  instanceSearch();
  welcomeUser();
  modalAddParams();
  modalRemoveParams();
};

uploadBookingInfo();

async function welcomeUser() {
  const res_user = await fetch("/user/self");
  const user = await res_user.json();

  document.querySelector("#welcome-user").innerHTML = ` ${user.name}`;
}

async function modalAddParams() {
  const bookingModal = new bootstrap.Modal("#booking-modal");

  document.querySelectorAll(".book-button").forEach((bookBtn) =>
    bookBtn.addEventListener("click", async (e) => {
      const partyroomID = bookBtn.parentElement.dataset.id;

      const currentURL = window.location.href;
      const newURL = currentURL + "?pid=" + partyroomID;
      window.history.pushState({ path: newURL }, "", newURL);

      bookingModal.show();
    })
  );
}

async function modalRemoveParams() {
  const bookingModal = document.querySelector("#booking-modal");
  const usersHTML = "/users.html";

  bookingModal.addEventListener("hidden.bs.modal", async (e) => {
    window.history.replaceState({ path: usersHTML }, "", usersHTML);
  });
}

async function uploadBookingInfo() {
  const form = document.querySelector("#booking-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const start_at = form.start_at.value;
    const finish_at = form.finish_at.value;
    const participants = form.participants.value;
    const special_req = form.special_req.value;

    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get("pid");

    const res = await fetch(`/user/booking/${pid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ start_at, finish_at, participants, special_req }),
    });
    console.log(res);

    if (start_at < finish_at) {
      console.log("fix time");
    }
    if (res.status === 200) {
      window.location = `/users.html`;
      alert("success");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}

async function getAllRooms() {
  const res_user = await fetch("/user/self");
  const user = await res_user.json();

  const res = await fetch("/user/upload");
  const partyrooms = await res.json();

  let partyroomCardsHtml = "";
  document.querySelector(".roomInfo-and-photo").innerHTML = "";

  for (let partyroom of partyrooms) {
    if (!partyroom.is_hidden) {
      const card_image = `<img src="/images/${partyroom.imagefilename}" class="card-img-top" alt="${partyroom.name}">`;
      const editAndDeleteBtn = `
      <div class="edit-button"><a href="/partyrooms_edit.html?pid=${partyroom.id}"><i class="fa-solid fa-pen-to-square fa-lg"></i></a></div>
      <div class="del-button"><a href="#"><i class="fa-solid fa-trash fa-lg"></i></a></div>`;
      const bookButton = `<button class="btn btn-primary book-button" data-id="${partyroom.id}">立即預約</button>`;

      partyroomCardsHtml += `
      <div class="col-md-3 d-flex justify-content-center text-center">
        <div class="card result w-75 partyroom-card mb-5 justify-content-center" data-id="${
          partyroom.id
        }">
          <a href= "/partyrooms_details.html?pid=${
            partyroom.id
          }" class="result">${card_image}</a>
          <div class="card-body">
            <div class="card-title result"><h4>${partyroom.name}</h4></div>
            <div class="card-text result">
              <p>${partyroom.venue}</p>
              最多${partyroom.capacity}人&nbsp;&nbsp;|&nbsp;&nbsp;${
        partyroom.style
      }
            </div>
          </div>
          <div class="result card-footer d-flex justify-content-around" data-id=${
            partyroom.id
          }>
            ${user.id === partyroom.user_id ? editAndDeleteBtn : bookButton}
          </div>
        </div>
      </div>
      `;
    }
  }

  document.querySelector(".roomInfo-and-photo").innerHTML += partyroomCardsHtml;

  document.querySelectorAll(".del-button").forEach((delBtn) =>
    delBtn.addEventListener("click", async (e) => {
      // document.querySelector(".roomInfo-and-photo").style.display = "none";
      const roomDiv = e.currentTarget.parentElement;
      const roomId = roomDiv.dataset.id;

      const resp = await fetch(`/user/upload/${roomId}`, {
        method: "PUT", // change to PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_hidden: true }),
      });

      const result = await resp.json();
      alert(result.message);

      if (resp.status === 200) {
        getAllRooms();
      }
    })
  );
}

async function getMyRooms() {
  const res_partyrooms = await fetch("/user/rooms_self");
  const partyrooms = await res_partyrooms.json();

  let partyroomCardsHtml = "";
  document.querySelector(".roomInfo-and-photo").innerHTML = "";

  for (let partyroom of partyrooms) {
    if (!partyroom.is_hidden) {
      const card_image = `<img src="/images/${partyroom.imagefilename}" class="card-img-top" alt="${partyroom.name}">`;
      const editAndDeleteBtn = `
      <div class="edit-button"><a href="/partyrooms_edit.html?pid=${partyroom.id}"><i class="fa-solid fa-pen-to-square fa-lg"></i></a></div>
      <div class="del-button"><i class="fa-solid fa-trash fa-lg"></i></div>`;
      const bookButton = `<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#booking-modal">立即預約</button>`;

      partyroomCardsHtml += `
      <div class="col-md-3 d-flex justify-content-center text-center">
        <div class="card result w-75 partyroom-card mb-3 justify-content-center" data-id="${partyroom.id}">
          <a href= "/partyrooms_details.html?pid=${partyroom.id}" class="result">${card_image}</a>
          <div class="card-body">
            <div class="card-title result"><h4>${partyroom.name}</h4></div>
            <div class="card-text result"><p>${partyroom.venue}</p>
            最多${partyroom.capacity}人&nbsp;&nbsp;|&nbsp;&nbsp;${partyroom.style}
            </div>
            
          </div>
          <div class="result card-footer d-flex justify-content-around" data-id=${partyroom.id}>
            ${editAndDeleteBtn}
          </div>
        </div>
      </div>
      `;
    }
  }

  document.querySelector(".roomInfo-and-photo").innerHTML += partyroomCardsHtml;
}

async function getOthersRooms() {
  const res_partyrooms = await fetch("/user/rooms_others");
  const partyrooms = await res_partyrooms.json();

  let partyroomCardsHtml = "";
  document.querySelector(".roomInfo-and-photo").innerHTML = "";

  for (let partyroom of partyrooms) {
    if (!partyroom.is_hidden) {
      const card_image = `<img src="/images/${partyroom.imagefilename}" class="card-img-top" alt="${partyroom.name}">`;
      const editAndDeleteBtn = `
      <div class="edit-button"><a href="/partyrooms_edit.html?pid=${partyroom.id}"><i class="fa-solid fa-pen-to-square fa-lg"></i></a></div>
      <div class="del-button"><i class="fa-solid fa-trash fa-lg"></i></div>`;
      const bookButton = `<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#booking-modal">立即預約</button>`;

      partyroomCardsHtml += `
      <div class="col-md-3 d-flex justify-content-center text-center">
        <div class="card result w-75 partyroom-card mb-3 justify-content-center" data-id="${partyroom.id}">
          <a href= "/partyrooms_details.html?pid=${partyroom.id}" class="result">${card_image}</a>
          <div class="card-body">
            <div class="card-title result"><h4>${partyroom.name}</h4></div>
            <div class="card-text result"><p>${partyroom.venue}</p>
            最多${partyroom.capacity}人&nbsp;&nbsp;|&nbsp;&nbsp;${partyroom.style}
            </div>
          </div>
          <div class="result card-footer d-flex justify-content-around" data-id=${partyroom.id}>
            ${bookButton}
          </div>
        </div>
      </div>
      `;
    }
  }
  document.querySelector(".roomInfo-and-photo").innerHTML += partyroomCardsHtml;
}

//del

async function logout() {
  document.querySelector(".logout").addEventListener("click", async (e) => {
    const resp = await fetch(`/auth/logout`, {
      method: "DELETE",
    });

    const result = await resp.json();
    alert(result.message);

    if (resp.status === 200) {
      window.location = "/";
    }
  });
}

// function filterTable() {
//   const searchInput = document.querySelector("#search-input");
//   const results = document.querySelectorAll(".result");

//   searchInput.addEventListener("input", function () {
//     const searchTerm = searchInput.value.toLowerCase();

//     results.forEach((result) => {
//       const text = result.textContent.toLowerCase();
//       if (!text.includes(searchTerm)) result.style.display = "none";
//       else result.style.display = "flex";
//     });
//   });
// }

function selectorTabToggle() {
  const myRoomsButton = document.querySelector(".selector-button-own");
  const othersRoomsButton = document.querySelector(".selector-button-others");
  const allRoomsbutton = document.querySelector(".selector-button-all");

  myRoomsButton.addEventListener("click", () => {
    getMyRooms();
  });
  othersRoomsButton.addEventListener("click", () => {
    getOthersRooms();
  });

  allRoomsbutton.addEventListener("click", () => {
    getAllRooms();
  });
}

function instanceSearch() {
  const textInput = document.querySelector("#search-input");

  textInput.addEventListener("keydown", async (e) => {
    if (e.key == "Enter") {
      const searchQuery = e.target.value;
      const numberQuery = parseInt(e.target.value);

      let duplicatedResults = [];
      let searchResults = [];

      const res_user = await fetch("/user/self");
      const user = await res_user.json();

      const res_partyrooms = await fetch(`/user/search`);
      const partyrooms = await res_partyrooms.json();

      for (partyroom of partyrooms) {
        for (key in partyroom) {
          if (key === "phone_no") {
            if (partyroom[key] === searchQuery) {
              duplicatedResults.push(partyroom);
            }
          } else if (
            key != "imagefilename" &&
            key != "user_id" &&
            key != "id"
          ) {
            if (
              (typeof partyroom[key] === "string" &&
                partyroom[key].includes(searchQuery)) ||
              (typeof partyroom[key] === "number" &&
                partyroom[key] === numberQuery)
            ) {
              console.log("pushed " + partyroom[key]);
              duplicatedResults.push(partyroom);
            }
          }
        }
      }

      const ids = duplicatedResults.map((partyroom) => partyroom.id);
      // the partyroom IDs from the partyrooms in duplicatedResults are extracted into an array called "ids"
      searchResults = duplicatedResults.filter(
        ({ id }, index) => !ids.includes(id, index + 1)
        // { id } = the partyroom_id of a partyroom search result from duplicatedResults
        // index = the index position of the partyroom search result in duplicatedResults

        // after the arrow:
        // id = the id mentioned before the arrow
        // index + 1 = the includes() function will start searching from the index position right after the index provided before the arrow
      );

      let partyroomCardsHtml = "";
      document.querySelector(".roomInfo-and-photo").innerHTML = "";

      for (partyroom of searchResults) {
        if (!partyroom.is_hidden) {
          const card_image = `<img src="/images/${partyroom.imagefilename}" class="card-img-top" alt="${partyroom.name}">`;
          const editAndDeleteBtn = `
          <div class="edit-button"><a href="/partyrooms_edit.html?pid=${partyroom.id}"><i class="fa-solid fa-pen-to-square fa-lg"></i></a></div>
          <div class="del-button"><i class="fa-solid fa-trash fa-lg"></i></div>`;
          const bookButton = `<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#booking-modal">立即預約</button>`;

          partyroomCardsHtml += `
          <div class="col-md-3 d-flex justify-content-center text-center">
            <div class="card result w-75 partyroom-card mb-3 justify-content-center" data-id="${
              partyroom.id
            }">
              <a href= "/partyrooms_details.html?pid=${
                partyroom.id
              }" class="result">${card_image}</a>
              <div class="card-body">
                <div class="card-title result"><h4>${partyroom.name}</h4></div>
                <div class="card-text result">${partyroom.venue}</div>
              </div>
              <div class="result card-footer d-flex justify-content-around" data-id=${
                partyroom.id
              }>
                ${user.id === partyroom.user_id ? editAndDeleteBtn : bookButton}
              </div>
            </div>
          </div>
          `;
        }
      }

      document.querySelector(".roomInfo-and-photo").innerHTML +=
        partyroomCardsHtml;
    }
  });
}
