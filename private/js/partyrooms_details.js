const urlSearchParams = new URLSearchParams(window.location.search);
check();
inputRoomDetails();
uploadBookingInfo();
logout();
uploadRating();
welcomeUser();

async function check() {
  if (!urlSearchParams.has("pid")) {
    window.location = `/`;
    return;
  }
}

async function welcomeUser() {
  const res_user = await fetch("/user/self");
  const user = await res_user.json();

  document.querySelector("#welcome-user").innerHTML = ` ${user.name}`;
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
    <div class="details-header">
      <div class="pr-booking-div">
        <h1>場地名稱: ${partyroom_details.name}</h1>

        <button class="booking-now btn btn-primary" data-bs-toggle="modal" data-bs-target="#booking-modal">立即預約</button>
      </div>
    </div>
    <!-- Details-Area-->
    <div class="row details-main-container d-flex justify-content-center">
      <div class="col d-flex flex-column justify-content-center mb-2">
        <div class="room-details m-3 p-3">
          <h4>場地資訊</h4>
          價錢: $${partyroom_details.price} (每小時)<br>
          地址: ${partyroom_details.venue}
        </div>
        <div class="col equipments m-3 p-3 d-flex flex-column justify-content-center">
          <h4>場地設備</h4>
          PartyRoom 設備: ${partyroom_details.equipment_name}<br>
          種類: ${partyroom_details.type}
        </div>
      </div>
      <div class="col d-flex justify-content-end">
        <p class="room-image">${image}</p>
      </div>
      <div class=col d-flex justify-content-center text-center">
        <div class="row owner-details d-flex flex-row justify-content-center m-3 p-3">
          <div class="col-md-6">
            <h4>場地主人</h4>
            價錢: $${partyroom_details.price} (每小時)<br>
            地址: ${partyroom_details.venue}
          </div>
          <div class="col-md-6 d-flex justify-content-center align-items-center">
            <i class="fa-solid fa-user fa-6x"></i>
          </div>
        </div>
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
    if (start_at < finish_at) {
      console.log("hihihi");
    }
    if (res.status === 200) {
      window.location = `/users.html`;
      alert("success");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}

async function logout() {
  document.querySelector(".logout").addEventListener("click", async (e) => {
    const resp = await fetch(`/auth/logout`, {
      method: "DELETE",
    });

    const result = await resp.json();
    alert(result.message);

    if (resp.status === 200) {
      window.location = "/";
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
