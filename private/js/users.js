window.onload = () => {
  getAllRooms();
};

/* 
 div class & id names TBC
*/
async function getAllRooms() {
  const res = await fetch("/upload");
  const partyrooms = await res.json();
  let partyroomCardsHtml = "";
  document.querySelector(".roomInfo-and-photo").innerHTML = "";
  for (let partyroom of partyrooms) {
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
