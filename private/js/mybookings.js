window.onload = () => {
  getAllUserBookings();
};

async function getAllUserBookings() {
  const res_bookingdetails = await fetch("/user/booking");
  const bookingdetails = await res_bookingdetails.json();
  let allBookingsHTML = "";

  for (let booking of bookingdetails) {
    allBookingsHTML += `
      <div class=booking-container>
          ${booking.name} <br>
          ${booking.venue} <br>
          starts at: ${booking.start_at} <br>
          finishes at: ${booking.finish_at}
      </div>
      <div class=test"><a href="/booked.html?bid=${booking.id}">test</a></div>
      `;
  }
  document.querySelector(".bookings-container").innerHTML += allBookingsHTML;
}
