const urlSearchParams = new URLSearchParams(window.location.search);
check();
inputRoomDetails();
uploadRating();

async function check() {
  if (!urlSearchParams.has("pid")) {
    window.location = `/`;
    return;
  }
}

async function inputRoomDetails() {
  const resp = await fetch(`/roomDetails/${urlSearchParams.get("pid")}`);
  const partyroom_details = await resp.json();
  //get comment
  const resp_comment = await fetch(
    `/user/rating/${urlSearchParams.get("pid")}`
  );
  const comment_details = await resp_comment.json();

  const image = `<img src="/images/${partyroom_details.imagefilename}" width = "20" alt=""/>`;

  let htmlStr = `
  
    <div class="row details-header justify-content-center w-100 mt-4 mb-3">
 
      <div class="pr-booking-div w-50 justify-content-center text-center align-items-center align-content-center pt-4 pb-3">
        <h2>場地名稱: ${partyroom_details.name}</h2>

        
      </div>
    </div>
    <!-- Details-Area-->
    <div class="row details-main-container">
      <div class="col left-part d-flex flex-column justify-content-center">
        <div class="room-details fs-5">
        <p><b>場地資訊</b></p>
        <p>價錢: $${partyroom_details.price} (每小時)</p>
        <p>地址: ${partyroom_details.venue}</p>
        </div>

        <p class="equipments col fs-5"><b>PartyRoom 設備:</b> ${partyroom_details.equipment_name}<br>種類: ${partyroom_details.type}</p>
        </div>
      <div class="right-part col d-flex justify-content-end">
        <p class="room-image">${image}</p>
      </div>

    </div>

      `;

  let htmlStr2 = "";

  for (let comment of comment_details) {
    htmlStr2 += `
    <div class="commentBar">
    ${comment.name}: ${comment.comments} <p class="score">給予評分: ${comment.ratings}</p>
    </div>
    
  `;
  }

  document.querySelector(".result-container").innerHTML = htmlStr;
  document.querySelector(".commentBox").innerHTML += htmlStr2;
}

async function uploadBookingInfo() {
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
    // const booking_details = await res.json();
    if (res.status === 200) {
      window.location = `/users.html`;
      alert("success");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}

async function uploadRating() {
  const resp = await fetch(`/roomDetails/${urlSearchParams.get("pid")}`);
  const partyroom_details = await resp.json();
  const form = document.querySelector("#ratingForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const comments = form.comments.value;
    const ratings = form.ratings.value;

    const res = await fetch(`/user/rating/${urlSearchParams.get("pid")}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comments,
        ratings,
      }),
    });
    // const booking_details = await res.json();
    if (res.status === 200) {
      window.location = `/partyrooms_details.html?pid=${partyroom_details.id}`;
      alert("success");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}
