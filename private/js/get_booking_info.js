window.onload = () => {
  // getUserInfo();
  getAllBookings();
};

async function getAllBookings() {
  const res_bookings = await fetch("/user/booking");
  const bookings = await res_bookings.json();
  let bookinghtmlstr = "";
  document.querySelector(".append-here").innerHTML = "";
  // for (let user of users) {
  for (let booking of bookings) {
    // console.log(partyroom.name);
    const image = `<img src="/images/${booking.id}" width = "20" alt=""/>`;

    bookinghtmlstr += `
    <div class="roomInfo-photo-title" data-id="${booking.finish_at}">
      <div class="room-card-photo">
       <a href= "/partyrooms_details.html?pid=${booking.start_at}"> ${image} </a>
        
      </div>
      <div class="room-card-copy">
        ${booking.finish_at} @ ${booking.finish_at}
      </div>
      
      <div class="del-button memo-button">
      <i class="fa-solid fa-trash"></i>
    </div>
    </div>
    `;
  }
    document.querySelector(".append-here").innerHTML += bookinghtmlstr;
}