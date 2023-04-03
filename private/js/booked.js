const urlSearchParams = new URLSearchParams(window.location.search);
bookingDetails();

async function bookingDetails() {
  const bid = urlSearchParams.get("bid");
  console.log("bid:", bid);
  const res_booking = await fetch(
    `/bookingDetails/${urlSearchParams.get("bid")}`
  );
  const booking = await res_booking.json();
  console.log(booking);

  const formattedStartTime = booking.start_at
    .replace("T", " ")
    .replace(".000Z", " ");
  const formattedEndTime = booking.finish_at
    .replace("T", " ")
    .replace(".000Z", " ");

  const image = `<img src="/images/${booking.imagefilename}" width="90%" alt=""/>`;

  const whatsappIcon = `<i class="fa-brands fa-whatsapp"></i>`;
  const phoneIcon = `<i class="fa-solid fa-phone"></i>`;

  let bookinghtmlstr = "";
  document.querySelector(".owner-info").innerHTML = "";

  bookinghtmlstr += `
    <div class="row justify-content-around">
      <div class="col-md-4 d-flex flex-column">
        <div class="room-name w-100 justify-content-center text-center mb-5">${booking.room_name}</div>
        <div class="room-others">
          <div class="room-address w-100 mb-2">場地地址<br> ${booking.venue}</div>
          <div class="booking-time w-100 mb-2">活動時間<br> 
            ${formattedStartTime} - ${formattedEndTime}
          </div>
          <div class="booking-participants w-100 mb-2">
            活動人數<br> ${booking.participants}
          </div>
          <div class="booking-special-req w-100 mb-4">特別要求<br> ${booking.special_req}</div>
          <div class="booking-buttons w-100 d-flex justify-content-around">
            <button class="btn btn-primary edit-button">更改時間</button>
            <button class="btn btn-danger delete-button">取消預約</button>
          </div>
        </div>
      </div>
      <div class="col-md-4 d-flex flex-column">
        <div class="room-image w-100 d-flex justify-content-center mb-5">
          ${image}
        </div>
        <div class="row owner-details">
          <div class="col-md-6">
            <div class="owner-name mb-3">場地負責人<br>${booking.owner}</div>
            <div class="owner-phone_no mb-3">${phoneIcon} ${booking.phone_no}</div>
            <div class="owner-whatsapp">${whatsappIcon} ${booking.phone_no}</div>
          </div>
          <div class="col-md-6 d-flex justify-content-center align-items-center">
            <i class="fa-solid fa-user fa-6x"></i>
          </div>
        </div>
      </div>
    </div>
    `;
  document.querySelector(".booking-details").innerHTML += bookinghtmlstr;
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
