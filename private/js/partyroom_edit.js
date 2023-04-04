console.log("testing");
const urlSearchParams = new URLSearchParams(window.location.search);
check();
createUpdateForm();
updateRoomDetails();

async function check() {
  if (!urlSearchParams.has("pid")) {
    window.location = `/`;
    return;
  }
}

async function createUpdateForm() {
  const resp = await fetch(`/roomDetails/${urlSearchParams.get("pid")}`);
  const partyroom_details = await resp.json();
  console.log(partyroom_details);

  const image = `<img src="/images/${partyroom_details.imagefilename}" width = "20" alt=""/>`;

  formHTMLString = `    
        <div class="top-info">
            <div class="name-div">
                <p>Name:</p>
                <textarea class="uploads" name="name">${partyroom_details.name}</textarea>
            </div>
            <div class="phone-no-div">
                <p>Phone Number:</p>
                <textarea class="uploads" name="phone_no">${partyroom_details.phone_no}</textarea>
            </div>
            <div class="price-div">
                <p>Price (per hour):</p>
                <textarea class="uploads" name="price">${partyroom_details.price}</textarea>
            </div>
            <div class="venue-div">
                <p>Venue:</p>
                <textarea class="uploads" name="venue">${partyroom_details.venue}</textarea>
            </div>
        </div>
        <div class="mid-info">
            <div class="area-div">
                <p>Area:</p>
                <textarea class="uploads" name="area">${partyroom_details.area}</textarea>
            </div>
            <div class="capacity-div">
                <p>Capacity:</p>
                <textarea class="uploads" name="capacity">${partyroom_details.capacity}</textarea>
            </div>
            <div class="style-div">
                <p>Style:</p>
                <textarea class="uploads" name="style">${partyroom_details.style}</textarea>
            </div>
        </div>
        <div class="mid-info" style="justify-content: space-around">
            <div class="equipment-heading" style="width: 100%">Equipment</div>
            <div class="equipment-in-service-div">
                <p>Name:</p>
                <textarea class="uploads" name="equipment_name">${partyroom_details.equipment_name}</textarea>
            </div>
            <div class="switch-game-div">
                <p>Type:</p>
                <textarea class="uploads" name="type">${partyroom_details.type}</textarea>
            </div>
        </div>
        <div class="bottom-info">
            <p>Introduction of Party Room:</p>
            <textarea class="uploads" name="intro" cols="153" rows="15">${partyroom_details.intro}</textarea>
            <p>Current Image</p>
            ${image}
            <input type="file" name="image" />
            <input type="submit" id="submit-button" "Submit Party Room Information" />
        </div>
   `;

  document.querySelector(".form-container").innerHTML = formHTMLString;
}
async function updateRoomDetails() {
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
      const equipment_name = form.equipment_name.value;
      const type = form.type.value;
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
      formData.append("equipment_name", equipment_name);
      formData.append("type", type);
      formData.append("intro", intro);
      formData.append("image", image);

      const resp = await fetch(`/roomDetails/${urlSearchParams.get("pid")}`, {
        method: "PUT",
        body: formData,
      });
      const result = await resp.json();
      if (resp.status === 200) {
        alert("Success");
        window.location = "/users.html";
      } else {
        alert(result.message);
      }
    });
}
