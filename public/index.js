window.onload = () => {
  initLogin();
  initSignup();
  // getAllRooms();
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
    const data = await res.json();

    if (res.status === 200) {
      // res.json({ message: "success" });
      console.log("success");
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
    const phone_no = signupForm.phone_no.value;
    const date_of_birth = signupForm.date_of_birth.value;
    const email = signupForm.email.value;
    const res = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, phone_no, date_of_birth, email }),
    });
    const data = await res.json();

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
  const res_user = await fetch("/user/self");
  const user = await res_user.json();

  const res = await fetch("/user/upload");
  const partyrooms = await res.json();

  let partyroomCardsHtml = "";
  document.querySelector(".roomInfo-and-photo").innerHTML = "";

  for (let partyroom of partyrooms) {
    // console.log(partyroom.user_id);
    // console.log(typeof partyroom.phone_no);
    const card_image = `<img src="/images/${partyroom.imagefilename}" class="card-img-top" alt="${partyroom.name}">`;
    const deleteBtn = `<div class="del-button"><a href="#"><i class="fa-solid fa-trash fa-lg"></i></a></div>`;
    const editBtn = `<div class="edit-button"><a href="/partyrooms_edit.html?pid=${partyroom.id}"><i class="fa-solid fa-pen-to-square fa-lg"></i></a></div>`;

    partyroomCardsHtml += `
      <div class="col-md-3 d-flex justify-content-center text-center">
        <div class="card w-75 partyroom-card mb-3" data-id="${partyroom.id}">
          <a href= "/partyrooms_details.html?pid=${partyroom.id}">${card_image}</a>
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
