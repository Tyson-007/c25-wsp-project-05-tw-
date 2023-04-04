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

  const image = `<img src="/images/${partyroom_details.imagefilename}" width = "100" alt=""/>`;

  formHTMLString = `    
        <!--name-->
          <div class="col-md-4 name-div mb-3">
            <label for="inputName" class="form-label">場地名稱</label>
            <input type="text" name="name" class="form-control uploads" />
          </div>
          <!--phone no-->
          <div class="col-md-4 phone-no-div mb-3">
            <label for="inputPhoneNo" class="form-label">聯絡人電話</label>
            <input type="tel" name="phone_no" class="form-control uploads" />
          </div>
          <!--price-->
          <div class="col-md-4 price-div mb-3">
            <label for="inputPrice" class="form-label">定價（時租）</label>
            <input
              type="number"
              name="price"
              class="form-control uploads"
              value="100"
              step="50"
            />
          </div>
          <!--venue-->
          <div class="col-md-12 venue-div mb-3">
            <label for="inputVenue" class="venue-label">地址</label>
            <input type="text" name="venue" class="form-control uploads" />
          </div>
          <div class="col-md-4 area-div mb-3">
            <label for="inputArea" class="area-label">場地面積</label>
            <input
              type="number"
              name="area"
              class="form-control uploads"
              value="100"
            />
          </div>
          <!--capacity-->
          <div class="col-md-4 capacity-div mb-3">
            <label for="inputCapacity" class="capacity-label"
              >最大容納人數</label
            >
            <input
              type="number"
              name="capacity"
              class="form-control uploads"
              value="16"
            />
          </div>
          <!--style-->
          <div class="col-md-4 style-div mb-3">
            <label for="inputStyle" class="style-label">場地風格</label>
            <input type="text" name="style" class="form-control uploads" />
          </div>
          <!--signature equipment-->
          <div class="col-md-12 d-flex justify-content-center">
            <h5>請輸入Party Room最有特色的設備 (Signature Item)</h5>
          </div>
          <div class="col-md-6 equipment-in-service-div mb-3">
            <label for="inputEquipmentName" class="equipment-name-label"
              >設備名</label
            >
            <input
              type="text"
              name="equipment_name"
              class="form-control uploads"
            />
          </div>
          <div class="col-md-6 equipment-type-div mb-3">
            <label for="inputEquipmentType" class="equipment-type-label"
              >設備種類</label
            >
            <input type="text" name="type" class="form-control uploads" />
          </div>
          <!--intro-->
          <div class="col-md-12 intro-div mb-3">
            <label for="inputIntro" class="intro-label">場地介紹</label>
            <textarea
              class="form-control uploads"
              name="intro"
              rows="4"
            ></textarea>
          </div>
          <!--image-->
          <div class="col-md-12 image-div mb-3">
          <div>current image ${image} </div>
            <label for="inputImage" class="image-label">上傳圖片</label>
            <input type="file" name="image" class="form-control uploads" />
          </div>
          <div class="col-md-12">
            <button class="btn btn-primary" type="submit">
              Submit Your Party Room
            </button>
          </div>
   `;

  document.querySelector(".update-form-append-here").innerHTML = formHTMLString;
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
