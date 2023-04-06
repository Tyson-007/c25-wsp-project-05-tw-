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

  const formattedStartTime = new Date(booking.start_at).toString().slice(0, 21);
  const formattedEndTime = new Date(booking.finish_at).toString().slice(0, 21);

  const image = `<img src="/images/${booking.imagefilename}" class="img-fluid" alt=""/>`;

  const whatsappIcon = `<i class="fa-brands fa-whatsapp"></i>`;
  const phoneIcon = `<i class="fa-solid fa-phone"></i>`;

  let bookinghtmlstr = "";

  bookinghtmlstr += `
    <div class="row justify-content-center g-5">
      <div class="col-md-4 d-flex flex-column me-md-5">
        <div class="room-name w-100 justify-content-center text-center mb-5"><h2>你已預約${booking.room_name}</h></div>
        <div class="room-others mb-md-5">
          <div class="room-address w-100 mb-2"><b>場地地址</b><br> ${booking.venue}</div>
          <div class="booking-time w-100 mb-2"><b>活動時間</b><br> 
            ${formattedStartTime} - ${formattedEndTime}
          </div>
          <div class="booking-participants w-100 mb-2">
            <b>活動人數</b><br> ${booking.participants}
          </div>
          <div class="booking-special-req w-100 mb-4"><b>特別要求</b><br> ${booking.special_req}</div>
          <div class="booking-buttons w-100 d-flex justify-content-around">
            <button class="btn btn-primary edit-button">更改時間</button>
            <button class="btn btn-danger delete-button">取消預約</button>
          </div>
        </div>
      </div>
      <div class="col-md-4 d-flex flex-column ms-md-5">
        <div class="room-image w-100 d-flex justify-content-center mb-5">
          ${image}
        </div>
        <div class="row owner-details">
          <div class="col-md-6">
            <div class="owner-name mb-3"><s場地負責人<br><h5>${booking.owner}</h5></div>
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
