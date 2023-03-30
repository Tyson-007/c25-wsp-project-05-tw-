window.onload = () => {
  uploadRoomData();
};

function uploadRoomData() {
  document
    .querySelector("#upload-info")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = e.target;
      const name = form.name.value;
      const phone_no = form.phone_no.value;
      const price = form.price.value;
      const venue = form.venue.value;
      const style = form.style.value;
      const area = form.area.value;
      const capacity = form.capacity.value;
      const equipment_in_service = form.equipment_in_service.value;
      const switch_game = form.switch_game.value;
      const board_game = form.board_game.value;
      const intro = form.intro.value;
      const image = form.image.files[0];

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone_no", phone_no);
      formData.append("price", price);
      formData.append("venue", venue);
      formData.append("style", style);
      formData.append("area", area);
      formData.append("capacity", capacity);
      formData.append("equipment_in_service", equipment_in_service);
      formData.append("switch_game", switch_game);
      formData.append("board_game", board_game);
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
