window.onload = () => {
  // getUserInfo();
  getAllBookings();
};

async function getAllBookings() {
  const res_bookings = await fetch("/user/booking");
  const bookings = await res_bookings.json();

  const res_user = await fetch("/user/self");
  const user = await res_user.json();

  //try {
  // const res_partyroom = await fetch("/user/partyroomself");
  // const partyroom = await res_partyroom.json();
  //try}

  const res_bookingself = await fetch("/user/bookingself");
  const bookingself = await res_bookingself.json();

  console.log(bookings);
  console.log(bookingself);
  console.log(user);
  // console.log(partyroom);
  let bookinghtmlstr = "";
  document.querySelector(".owner-info").innerHTML = "";

  const image = `<img src="/images/${bookings.id}" width = "20" alt=""/>`;

  bookinghtmlstr += `
    <p>${user.name}</p>
            <i class="fa-brands fa-whatsapp"></i>
            <p>${user.phone_no}</p>
            <i class="fa-solid fa-phone-volume"></i>
            <p>${user.phone_no}</p>
    `;
  document.querySelector(".owner-info").innerHTML += bookinghtmlstr;
}
