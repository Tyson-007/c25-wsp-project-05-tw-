// const urlSearchParams = new URLSearchParams(window.location.search);
// uploadBookInfo();
// // window.onload = () => {
// //   uploadBookInfo();
// // };

// async function uploadBookInfo() {
//   const form = document.querySelector("#booking-form");
//   form.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const form = event.target;
//     const start_at = form.start_at.value;
//     const finish_at = form.finish_at.value;
//     const participants = form.participants.value;
//     const special_req = form.special_req.value;

//     const res = await fetch(`/user/booking/${urlSearchParams.get("pid")}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ start_at, finish_at, participants, special_req }),
//     });
//     const booking_details = await res.json()
//     if (res.status === 200) {
//       window.location = "/booked.html";
//       alert("success");
//     } else {
//       const data = await res.json();
//       alert(data.message);
//     }
//   });
// }