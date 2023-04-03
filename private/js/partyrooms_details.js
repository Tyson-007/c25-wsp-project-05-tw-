const urlSearchParams = new URLSearchParams(window.location.search);
check();
inputRoomDetails();
uploadBookInfo();

async function check() {
  if (!urlSearchParams.has("pid")) {
    window.location = `/`;
    return;
  }
}

async function inputRoomDetails() {
  const resp = await fetch(`/roomDetails/${urlSearchParams.get("pid")}`);
  const partyroom_details = await resp.json();
  console.log(partyroom_details);

  // const loginBtn = `<button onClick="login()">Login</button>`;
  // const addPokemon = `<button onClick="addPokemon(${pokemon.id})">Add Pokemon</button>`;
  const image = `<img src="/images/${partyroom_details.imagefilename}" width = "20" alt=""/>`;

  let htmlStr = `
    <div class="details-header">
      <div class="pr-booking-div">
        <h1>場地名稱: ${partyroom_details.name}</h1>
        <button class="booking-now" data-bs-toggle="modal" data-bs-target="#booking-modal">立場預約</button>
      </div>
    </div>
    <!-- Details-Area-->
    <div class="details-main-container">
      <div class="left-part">
        <p class="room-details">場地資訊: ${partyroom_details.price}</p>
        <p class="equipments">Names: ${partyroom_details.equipment_name}<br>Types: ${partyroom_details.type}</p>
      </div>
      <div class="right-part">
        <p class="room-image">我要圖: ${image}</p>
      </div>


    </div>

    <div class="edit-and-del">
      <button class="edit-button">
        更改
      </button>
      <button class="del-button">
        刪除
      </button>
    </div>
      `;
  //   <p>場地主人: ${partyroom_details.name}</p>
  //   ${(await checkLogin()) ? addPokemon : loginBtn}
  document.querySelector(".result-container").innerHTML = htmlStr;

  // const editBtn = document.querySelector(".edit-button");

  // editBtn.addEventListener("click", async (e) => {
  //   // const memoDiv = e.currentTarget.parentElement;
  //   const roomDiv = editBtn.parentElement;
  //   const roomId = roomDiv.dataset.id;
  //   const newContent = roomDiv.querySelector(".banner").textContent.trim();

  //   const resp = await fetch(`/roomDetails/${memoId}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ content: newContent }),
  //   });

  //   // if (resp.status == 200) {
  //   //   const result = await resp.json();
  //   //   alert(result.message);
  //   // } else {
  //   //   const result = await resp.json();
  //   //   alert(result.message);
  //   // }
  //   const result = await resp.json();
  //   alert(result.message);
  // });
}

async function uploadBookInfo() {
  const form = document.querySelector("#booking-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const start_at = form.start_at.value;
    const finish_at = form.finish_at.value;
    const participants = form.participants.value;
    const special_req = form.special_req.value;

    const res = await fetch(`/user/booking/${urlSearchParams.get("pid")}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ start_at, finish_at, participants, special_req }),
    });
    const booking_details = await res.json();
    if (res.status === 200) {
      window.location = "/booked.html";
      alert("success");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}
