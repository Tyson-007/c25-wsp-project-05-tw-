window.onload = () => {
  initLogin();
  initSignup();
  getAllRooms();
  selectorTabToggle();
  instanceSearch();
};

async function initLogin() {
  const loginForm = document.querySelector("#login-form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = loginForm.name.value;
    const password = loginForm.password.value;
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    if (res.status === 200) {
      // res.json({ message: "success" });
      window.location = "/users.html";
      alert("Login successful");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}

async function initSignup() {
  const signupForm = document.querySelector("#signup-form");
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = signupForm.name.value;
    const password = signupForm.password.value;
    const password_check = signupForm.password_check.value;
    const phone_no = signupForm.phone_no.value;
    const date_of_birth = signupForm.date_of_birth.value;
    const email = signupForm.email.value;
    const res = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        password,
        password_check,
        phone_no,
        date_of_birth,
        email,
      }),
    });

    if (res.status === 200) {
      window.location = "/users.html";
      alert("Signup successful");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}

async function getAllRooms() {
  // const res_user = await fetch("/user/self");
  // const user = await res_user.json();

  const res = await fetch("/user/upload");
  const partyrooms = await res.json();

  let partyroomCardsHtml = "";
  document.querySelector(".roomInfo-and-photo").innerHTML = "";

  for (let partyroom of partyrooms) {
    console.log(partyroom);
    // console.log(partyroom.user_id);
    // console.log(typeof partyroom.phone_no);
    const card_image = `<img src="/images/${partyroom.imagefilename}" class="card-img-top" alt="${partyroom.name}">`;
    const deleteBtn = `<div class="del-button"><a href="#"><i class="fa-solid fa-trash fa-lg"></i></a></div>`;
    const editBtn = `<div class="edit-button"><a href="/partyrooms_edit.html?pid=${partyroom.id}"><i class="fa-solid fa-pen-to-square fa-lg"></i></a></div>`;

    partyroomCardsHtml += `
      <div class="col-md-3 d-flex justify-content-center text-center">
        <div class="card w-75 partyroom-card mb-3" data-id="${partyroom.id}">
          <a href= "/partyrooms_details_logout.html?pid=${partyroom.id}">${card_image}</a>
          <div class="card-body">
            <h5 class="card-title">${partyroom.name}</h5>
            <p class="card-text">${partyroom.venue}</p>
          </div>
        </div>
      </div>
      `;
  }

  document.querySelector(".roomInfo-and-photo").innerHTML += partyroomCardsHtml;
}

function selectorTabToggle() {
  const allRoomsbutton = document.querySelector(".selector-button-all");

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
            <div class="card result w-75 partyroom-card mb-3 justify-content-center" data-id="${partyroom.id}">
              <a href= "/partyrooms_details.html?pid=${partyroom.id}" class="result">${card_image}</a>
              <div class="card-body">
                <div class="card-title result"><h6>${partyroom.name}</h6></div>
                <div class="card-text result">${partyroom.venue}</div>
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
