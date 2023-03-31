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
    console.log(partyroom.user_id);
    // console.log(typeof partyroom.phone_no);
    const image = `<img src="/images/${partyroom.imagefilename}" width = "80%" alt=""/>`;
    const deleteBtn = `<div class="del-button"><a href="#"><i class="fa-solid fa-trash"></i></a></div>`;
    const editBtn = `<div class="edit-button"><a href="#"><i class="fa-solid fa-pen-to-square"></i></a></div>`;

    partyroomCardsHtml += `
            <div class="roomInfo-photo-title" data-id="${partyroom.id}">
              <div class="room-card-photo">
               <a href= "/partyrooms_details.html?pid=${
                 partyroom.id
               }"> ${image} </a>
              </div>
              <div class="room-card-copy">
                ${partyroom.name} @ ${partyroom.venue}
              </div>  
              ${user.id === partyroom.user_id ? deleteBtn : ""}
              ${user.id === partyroom.user_id ? editBtn : ""}
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
