const urlSearchParams = new URLSearchParams(window.location.search);
bookingDetails();
logout();
deleteBooking();
welcomeUser();

async function welcomeUser() {
  const res_user = await fetch("/user/self");
  const user = await res_user.json();

  document.querySelector("#welcome-user").innerHTML = ` ${user.name}`;
}

async function bookingDetails() {
  const bid = urlSearchParams.get("bid");
  console.log("bid:", bid);
  const res_booking = await fetch(
    `/bookingDetails/${urlSearchParams.get("bid")}`
  );
  const booking = await res_booking.json();
  console.log(booking);

  const formattedStartTime = new Date(booking.start_at).toString().slice(0, 21);
  const formattedEndTime = new Date(booking.finish_at).toString().slice(0, 21);

  const image = `<img src="/images/${booking.imagefilename}" class="img-fluid" alt=""/>`;

  const whatsappIcon = `<i class="fa-brands fa-whatsapp"></i>`;
  const phoneIcon = `<i class="fa-solid fa-phone"></i>`;

  document.querySelector(
    "#banner-bubble"
  ).innerHTML = `你已預約${booking.room_name}`;

  // booking basic info
  document.querySelector(
    "#room-address"
  ).innerHTML = `<b>場地地址</b><br> ${booking.venue}</div>`;
  document.querySelector("#booking-time").innerHTML = `<b>活動時間</b><br> 
    ${formattedStartTime} - ${formattedEndTime}`;
  document.querySelector(
    "#booking-participants"
  ).innerHTML = `<b>活動人數</b><br> ${booking.participants}`;
  document.querySelector(
    "#booking-special-req"
  ).innerHTML = `<b>特別要求</b><br> ${booking.special_req}`;

  // owner info
  document.querySelector(
    "#owner-name"
  ).innerHTML = `場地負責人：${booking.owner}`;
  document.querySelector(
    "#owner-phone_no"
  ).innerHTML = `${phoneIcon}&nbsp;&nbsp;${booking.phone_no}`;
  document.querySelector(
    "#owner-whatsapp"
  ).innerHTML = `${whatsappIcon}&nbsp;&nbsp;${booking.phone_no}`;

  // image
  document.querySelector("#booking-image").innerHTML = image;
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

async function deleteBooking() {
  document
    .querySelector("#cancel-button")
    .addEventListener("click", async (e) => {


      const resp = await fetch(
        `/bookingDetails/${urlSearchParams.get("bid")}`,
        {
          method: "DELETE",
        });

      const result = await resp.json();
      alert(result.message);

      if (resp.status === 200) {
        window.location = "/mybookings.html";
      }
    });
}
