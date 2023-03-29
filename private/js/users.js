window.onload = () => {
  uploadRoomData();
  getAllRooms();
};

function uploadRoomData() {
  document
    .querySelector("#upload-info")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = e.target;
      const name = form.name.value;
      const price = form.price.value;
      const venue = form.venue.value;
      const style = form.style.value;
      const area = form.area.value;
      const capacity = form.capacity.value;
      const intro = form.intro.value;
      const image = form.image.files[0];

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("venue", venue);
      formData.append("style", style);
      formData.append("area", area);
      formData.append("capacity", capacity);
      formData.append("intro", intro);
      formData.append("image", image);

      const resp = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      const result = await resp.json();
      if (resp.status === 200) {
        alert("Success");
        form.reset();
        // loadMemoData();
      } else {
        alert(result.message);
      }
    });
}

/* 
 div class & id names TBC
*/
export async function getAllRooms() {
  const res = await fetch("/upload");
  const partyrooms = await res.json();
  let partyroomCardsHtml = "";
  document.querySelector(".roomInfo-photo").innerHTML = "";
  for (let partyroom of partyrooms) {
    const image = `<img src="/images/${partyroom.image}" width = "20" alt=""/>`;
    partyroomCardsHtml = `
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
