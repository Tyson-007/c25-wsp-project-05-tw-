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
  console.log(partyroom_details);
  //get comment
  const resp_comment = await fetch(
    `/user/rating/${urlSearchParams.get("pid")}`
  );
  const comment_details = await resp_comment.json();

  const image = `<img src="/images/${partyroom_details.imagefilename}" class="img-fluid" alt="${partyroom_details.name}"/>`;
  const bookBtn = `<button class="booking-now btn btn-lg btn-primary" data-bs-toggle="modal" data-bs-target="#booking-modal">立即預約</button>`;

  // header
  document.querySelector(
    "#partyroom-name"
  ).innerHTML = `<h2>${partyroom_details.name}</h2>`;
  document.querySelector("#book-button").innerHTML = bookBtn;

  // partyroom details
  document.querySelector(
    "#partyroom-main-details-price"
  ).innerHTML = `時租價：$${partyroom_details.price}`;
  document.querySelector(
    "#partyroom-main-details-venue"
  ).innerHTML = `地址：${partyroom_details.venue}`;
  document.querySelector(
    "#partyroom-main-details-area"
  ).innerHTML = `面積：${partyroom_details.area}`;
  document.querySelector(
    "#partyroom-main-details-capacity"
  ).innerHTML = `最多容納人數：${partyroom_details.capacity}`;
  document.querySelector(
    "#partyroom-equipment-name"
  ).innerHTML = `特色設備：${partyroom_details.equipment_name}`;
  document.querySelector(
    "#partyroom-equipment-type"
  ).innerHTML = `種類：${partyroom_details.type}`;

  //partyroom image and owner details
  document.querySelector("#room-image").innerHTML = image;
  document.querySelector(
    "#owner-name"
  ).innerHTML = `負責人：${partyroom_details.owner}`;
  document.querySelector("#owner-phone_no").innerHTML = `
  <i class="fa-solid fa-phone"></i>
  ${partyroom_details.phone_no}
  `;
  document.querySelector("#owner-whatsapp").innerHTML = `
  <i class="fa-brands fa-whatsapp"></i>
  ${partyroom_details.phone_no}
  `;

  let htmlStr = "";
  for (let comment of comment_details) {
    htmlStr += `
    <div class="commentBar">
    ${comment.name}: ${comment.comments} <p class="score">給予評分: ${comment.ratings}</p>
    </div>
    
  `;
  }

  document.querySelector(".commentBox").innerHTML += htmlStr;
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

    const booking_details = await res.json();
    if (start_at < finish_at) {
      console.log("hihihi");
    }
    console.log(booking_details);
    if (res.status === 200) {
      window.location = `/users.html`;
      alert("success");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}

//try
// async function uploadBookingInfo() {
//   const form = document.querySelector("#booking-form");
//   form.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const form = event.target;
//     const start_at = form.start_at.value;
//     const finish_at = form.finish_at.value;
//     const participants = form.participants.value;
//     const special_req = form.special_req.value;

//     const res = await fetch(
//       `/user/booking/${urlSearchParams.get(
//         "pid"
//       )}?start=${start_at}&end=${finish_at}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ participants, special_req }),
//       }
//     );

//     const booking_details = await res.json();
//     if (start_at < finish_at) {
//       console.log("hihihi");
//     }

//     if (res.status === 200) {
//       window.location = `/users.html`;
//       alert("success");
//     } else {
//       const data = await res.json();
//       alert(data.message);
//     }
//   });
// }

//try

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
