window.onload = () => {
  getAllRooms();
  logout();
};

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
      <div class="del-button"><i class="fa-solid fa-trash fa-lg"></i></div>`;
      const bookButton = `<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#booking-modal">立即預約</button>`;

      partyroomCardsHtml += `
      <div class="col-md-3 d-flex justify-content-center text-center">
        <div class="card w-75 partyroom-card mb-3" data-id="${partyroom.id}">
          <a href= "/partyrooms_details.html?pid=${
            partyroom.id
          }">${card_image}</a>
          <div class="card-body">
            <h5 class="card-title">${partyroom.name}</h5>
            <p class="card-text">${partyroom.venue}</p>
          </div>
          <div class="card-footer d-flex justify-content-around" data-id=${
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

  //del
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
