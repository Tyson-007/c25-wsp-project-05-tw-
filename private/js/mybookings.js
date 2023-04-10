window.onload = () => {
  getAllUserBookings();
  logout();
  welcomeUser();
};

async function welcomeUser() {
  const res_user = await fetch("/user/self");
  const user = await res_user.json();

  document.querySelector("#welcome-user").innerHTML = ` ${user.name}`;
}

async function getAllUserBookings() {
  const res_bookingdetails = await fetch("/user/booking");
  const bookingdetails = await res_bookingdetails.json();

  let allBookingsHTML = "";
  // const modify = document.querySelector('#start_at').value
  // modify = modify.replace("T", " ")

  const date = new Date();
  // console.log(date);
  const isoString = date.toISOString();

  // console.log(isoString);

  for (let booking of bookingdetails) {
    console.log(booking);
    // if (!booking.is_cancelled) {
    try {
      start_at = new Date(booking.start_at).toString().slice(0, 21);
      finish_at = new Date(booking.finish_at).toString().slice(0, 21);

      if (booking.start_at > isoString) {
        allBookingsHTML += `
          <div class="col-md-3 mx-2 mb-3">
            <div class="booking-card card w-100">
              <div class="card-header text-center"><h5>${booking.name}</h5></div>
              <div class="card-body">
                <p><b>地址：</b> ${booking.venue}</p>
                <p><b>價錢(每小時)：</b> ${booking.price}</p>
                <p><b>活動開始時間：</b> ${start_at}</p>
                <p><b>活動結束時間：</b> ${finish_at}</p>
                <div class="card-button d-flex justify-content-center">
                  <a class="btn btn-primary" href="/booked.html?bid=${booking.id}">詳細資訊</a>
                </div>
              </div>
            </div>
          </div>
            `;
      } else {
        allBookingsHTML += ``;
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error" });
    }
  }

  document.querySelector(".bookings-container").innerHTML += allBookingsHTML;
}

// }
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
