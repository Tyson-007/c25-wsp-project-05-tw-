window.onload = () => {
  getAllRooms();
};

/*
   div class & id names TBC
  */

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
          <a href= "/partyrooms_details.html?pid=${
            partyroom.id
          }">${card_image}</a>
          <div class="card-body">
            <h5 class="card-title">${partyroom.name}</h5>
            <p class="card-text">${partyroom.venue}</p>
          </div>
          <div class="card-footer d-flex justify-content-around">
            ${user.id === partyroom.user_id ? editBtn : ""}
            ${user.id === partyroom.user_id ? deleteBtn : ""}
          </div>
        </div>
      </div>
      `;
  }

  document.querySelector(".roomInfo-and-photo").innerHTML += partyroomCardsHtml;

  //del
  document.querySelectorAll(".del-button").forEach((delBtn) =>
    delBtn.addEventListener("click", async (e) => {
      const roomDiv = e.currentTarget.parentElement;
      const roomId = roomDiv.dataset.id;

      const resp = await fetch(`/user/upload/${roomId}`, {
        method: "DELETE",
      });

      const result = await resp.json();
      alert(result.message);

      if (resp.status === 200) {
        getAllRooms();
      }
    })
  );
}
// server.ts加左個get method
//partyrooms.phone_no == users.phone_no can del
