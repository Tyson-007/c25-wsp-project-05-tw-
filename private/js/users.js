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
  document.querySelector(".roomInfo-photo").innerHTML = "";
  for (let partyroom of partyrooms) {
    const image = `<img src="/images/${partyroom.imagefilename}" width = "20" alt=""/>`;

    partyroomCardsHtml += `
    <div class="roomInfo-photo-title" data-id="${partyroom.id}">
      <div class="room-card-photo">
        ${image}
      </div>
      <div class="room-card-copy">
        ${partyroom.name} @ ${partyroom.venue}
      </div>
    </div>
    `;
  }
  document.querySelector(".roomInfo-photo").innerHTML += partyroomCardsHtml;
}
