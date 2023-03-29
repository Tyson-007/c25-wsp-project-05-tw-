window.onload = () => {
  getEdit();
};

/* 
     div class & id names TBC
    */
async function getEdit() {
  const res = await fetch("/upload");
  const partyroom_details = await res.json();
  let partyroom_detailsCardsHtml = "";
  document.querySelector(".roomInfo-photo").innerHTML = "";
  //攞出黎嘅data放嘅位置
  for (let partyroom_detail of partyroom_details) {
    const image = `<img src="/images/${partyroom_detail.imagefilename}" width = "20" alt=""/>`;

    partyroom_detailsCardsHtml += `
        <div class="roomInfo-photo-title" data-id="${partyroom_detail.id}">
          <div class="room-card-photo">
            ${image}
          </div>
          <div class="room-card-copy">
            ${partyroom_detail.name} @ ${partyroom_detail.venue}
          </div>
        </div>
        `;
  }
  //加一個空嘅div係HTML，上面嘅野係edit落去空嘅HTML到
  document.querySelector(".roomInfo-photo").innerHTML +=
    partyroom_detailsCardsHtml;
}
