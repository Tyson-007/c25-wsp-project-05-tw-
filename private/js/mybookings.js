window.onload = () => {
  getAllUserBookings();
};

async function getAllUserBookings() {
  const res_bookingdetails = await fetch("/user/booking");
  const bookingdetails = await res_bookingdetails.json();
  let allBookingsHTML = "";
  // const modify = document.querySelector('#start_at').value
  // modify = modify.replace("T", " ")

  for (let booking of bookingdetails) {
    allBookingsHTML += `
      <div class=booking-container>
          ${booking.name} <br>
          ${booking.venue} <br>
          starts at: ${booking.start_at.replace("T", " ").replace(".000Z", " ")} <br>
          finishes at: ${booking.finish_at.replace("T", " ").replace(".000Z", " ")}
      </div>
      <div class=test"><a href="/booked.html?bid=${booking.id}">test</a></div>
      `;
  }
  document.querySelector(".bookings-container").innerHTML += allBookingsHTML;
}
