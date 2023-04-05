const urlSearchParams = new URLSearchParams(window.location.search);
check();
inputRoomDetails();
uploadBookingInfo();
logout();
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

  //get rating score

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

      `;

  let htmlStr2 = "";
  for (let comment of comment_details) {
    console.log(comment);
    htmlStr2 += `

    ${comment.name}${comment.comments}${comment.ratings}
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

    // 加boolean

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
