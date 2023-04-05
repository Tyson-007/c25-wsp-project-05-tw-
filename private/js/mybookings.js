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

  const isoString = date.toISOString();

  for (let booking of bookingdetails) {
    try {
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
            
              starts at: ${booking.start_at
                .replace("T", " ")
                .replace(".000Z", " ")} 
            
            <br>
            
              finishes at: ${booking.finish_at
                .replace("T", " ")
                .replace(".000Z", " ")}
            
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
