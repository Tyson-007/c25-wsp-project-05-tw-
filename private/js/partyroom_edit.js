console.log("testing");
const urlSearchParams = new URLSearchParams(window.location.search);
check();
createUpdateForm();
// inputRoomDetails();

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
    <form id="upload-info" enctype="multipart/form-data">
        <div class="top-info">
            <div class="name-div">
                <p>Name:</p>
                <textarea class="uploads" name="name" placeholder=${partyroom_details.name}></textarea>
            </div>
            <div class="phone-no-div">
                <p>Phone Number:</p>
                <textarea class="uploads" name="phone_no" placeholder=${partyroom_details.phone_no}></textarea>
            </div>
            <div class="price-div">
                <p>Price (per hour):</p>
                <textarea class="uploads" name="price" placeholder=${partyroom_details.price}></textarea>
            </div>
            <div class="venue-div">
                <p>Venue:</p>
                <textarea class="uploads" name="venue" placeholder=${partyroom_details.venue}></textarea>
            </div>
        </div>
        <div class="mid-info">
            <div class="area-div">
                <p>Area:</p>
                <textarea class="uploads" name="area" placeholder=${partyroom_details.area}></textarea>
            </div>
            <div class="capacity-div">
                <p>Capacity:</p>
                <textarea class="uploads" name="capacity" placeholder=${partyroom_details.capacity}></textarea>
            </div>
            <div class="style-div">
                <p>Style:</p>
                <textarea class="uploads" name="style" placeholder=${partyroom_details.style}></textarea>
            </div>
        </div>
        <div class="mid-info" style="justify-content: space-around">
            <div class="equipment-heading" style="width: 100%">Equipment</div>
            <div class="equipment-in-service-div">
                <p>Name:</p>
                <textarea class="uploads" name="equipment_name" placeholder=${partyroom_details.equipment_name}></textarea>
            </div>
            <div class="switch-game-div">
                <p>Type:</p>
                <textarea class="uploads" name="type" placeholder=${partyroom_details.type}></textarea>
            </div>
        </div>
        <div class="bottom-info">
            <p>Introduction of Party Room:</p>
            <textarea class="uploads" name="intro" cols="153" rows="15" placeholder=${partyroom_details.intro}></textarea>
            <p>Current Image</p>
            ${image}
            <input type="file" name="image" />
            <input type="submit" value="Submit Party Room Information" />
        </div>
    </form>`;

  document.querySelector(".form-container").innerHTML = formHTMLString;
}
