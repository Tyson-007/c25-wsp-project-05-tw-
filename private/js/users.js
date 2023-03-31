window.onload = () => {
  // getUserInfo();
  getAllRooms();
};

/* 
 div class & id names TBC
*/

// async function getUserInfo() {
//   const res_user = await fetch("/login");
//   const users = await res_user.json();
//   //上面兩句加左
//   for (let user of users) {
//     console.log(user.phone_no);
//   }
// }

async function getAllRooms() {
  const res_user = await fetch("/login");
  const users = await res_user.json();
  console.log(users);
  /////////////////////////////////////
  const res = await fetch("/upload");
  const partyrooms = await res.json();
  let partyroomCardsHtml = "";
  document.querySelector(".roomInfo-and-photo").innerHTML = "";
  // for (let user of users) {
  for (let partyroom of partyrooms) {
    // console.log(partyroom.name);
    const image = `<img src="/images/${partyroom.imagefilename}" width = "20" alt=""/>`;

    partyroomCardsHtml += `
    <div class="roomInfo-photo-title" data-id="${partyroom.id}">
      <div class="room-card-photo">
       <a href= "/partyrooms_details.html?pid=${partyroom.id}"> ${image} </a>
        
      </div>
      <div class="room-card-copy">
        ${partyroom.name} @ ${partyroom.venue}
      </div>
      
      <div class="del-button memo-button">
      <i class="fa-solid fa-trash"></i>
    </div>
    </div>
    `;
  }

  document.querySelector(".roomInfo-and-photo").innerHTML += partyroomCardsHtml;

  // try del
  // document.querySelectorAll(".del-button").forEach((delBtn) =>
  //   delBtn.addEventListener("click", async (e) => {
  //     const roomDiv = e.currentTarget.parentElement;
  //     const roomId = roomDiv.dataset.id;
  //     console.log(partyrooms.phone_no);
  //     if ((users.phone_no = partyrooms.phone_no)) {
  //       const resp = await fetch(`/upload/${roomId}`, {
  //         method: "DELETE",
  //       });
  //     } else {
  //       alert("you are not the owner!");
  //     }

  //     const result = await resp.json();
  //     alert(result.message);

  //     if (resp.status === 200) {
  //       getAllRooms();
  //     }
  //   })
  // );

  //real del
  document.querySelectorAll(".del-button").forEach((delBtn) =>
    delBtn.addEventListener("click", async (e) => {
      const roomDiv = e.currentTarget.parentElement;
      const roomId = roomDiv.dataset.id;

      // /memos/3
      const resp = await fetch(`/upload/${roomId}`, {
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
