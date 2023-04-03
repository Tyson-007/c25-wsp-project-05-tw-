window.onload = () => {
  // getUserInfo();
  getAllBookings();
};

async function getAllBookings() {
  const res_bookings = await fetch("/user/booking");
  const bookings = await res_bookings.json();

  const res_user = await fetch("/user/self");
  const user = await res_user.json();

  // const res_partyroom= await fetch("/user/partyroomself");
  // const partyroom = await res_partyroom.json();

  const res_bookingself = await fetch("/user/bookingself");

  const bookingself = await res_bookingself.json();

  let bookinghtmlstr = "";
  document.querySelector(".owner-info").innerHTML = "";
  // for (let user of users) {
  // console.log(partyroom.name);
  const image = `<img src="/images/${bookings.id}" width = "20" alt=""/>`;

  bookinghtmlstr += `
    <p>${user.name}</p>
            <i class="fa-brands fa-whatsapp"></i>
            <p>${user.id}</p>
            <i class="fa-solid fa-phone-volume"></i>
            <p>${user.id}</p>
    `;
  document.querySelector(".owner-info").innerHTML += bookinghtmlstr;
}
