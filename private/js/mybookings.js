window.onload = () => {
  getAllUserBookings();
  logout();
};

async function getAllUserBookings() {
  const res_bookingdetails = await fetch("/user/booking");
  const bookingdetails = await res_bookingdetails.json();
  let allBookingsHTML = "";
  // const modify = document.querySelector('#start_at').value
  // modify = modify.replace("T", " ")

  const date = new Date();
  // console.log(date);
  const isoString = date.toISOString();
<<<<<<< HEAD
  // console.log(isoString);

  for (let booking of bookingdetails) {
    try {
      console.log(new Date(booking.start_at));

=======
  for (let booking of bookingdetails) {
    try {
      start_at = new Date(booking.start_at).toString().slice(0,24);
         finish_at = new Date(booking.finish_at).toString().slice(0,24);
>>>>>>> e2214fba3f2bbe64b9b95319b4292947ee85c68a
      if (booking.start_at > isoString) {
        allBookingsHTML += `

          <div class="booking-container">
            <div class="booked-info">
            Party Room Name:
              ${booking.name} 
            
            <br>
            Venue:
              ${booking.venue} 
            
            <br>
            
              Starts at: ${start_at
               } 
            
            <br>
            
              Finishes at: ${finish_at
                }
            
            </div>

          <div class="test"><a href="/booked.html?bid=${
            booking.id
          }">詳細資訊</a></div>

        

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
