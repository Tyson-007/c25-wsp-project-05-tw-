// const urlSearchParams = new URLSearchParams(window.location.search);
// // check();
// inputBookingDetails();

// // async function check() {
// //   if (!urlSearchParams.has("pid")) {
// //     window.location = `/`;
// //     return;
// //   }
// // }

// async function inputBookingDetails() {
//   const resp = await fetch(`/bookingDetails/${urlSearchParams.get("pid")}`);
//   const booking_details = await resp.json();
//   console.log(booking_details);

//   // const loginBtn = `<button onClick="login()">Login</button>`;
//   // const addPokemon = `<button onClick="addPokemon(${pokemon.id})">Add Pokemon</button>`;

//   let htmlStr = `
//     <div class="details-header">
//       <div class="pr-booking-div">
//         <h1>場地名稱: ${booking_details.start_at}</h1>
//         <button class="booking-now" data-bs-toggle="modal" data-bs-target="#booking-modal">立場預約</button>
//       </div>
//     </div>
//     <!-- Details-Area-->
//     <div class="details-main-container">
//       <div class="left-part">
//         <p class="room-details">場地資訊: ${booking_details.start_at}</p>
//         <p class="equipments">Names: ${booking_details.start_at}<br>Types: ${booking_details.start_at}</p>
//       </div>
//       <div class="right-part">
//         <p class="room-image">我要圖: ${image}</p>
//       </div>


//     </div>

//     <div class="edit-and-del">
//       <button class="edit-button">
//         更改
//       </button>
//       <button class="del-button">
//         刪除
//       </button>
//     </div>
//       `;
//   document.querySelector(".result-container").innerHTML = htmlStr;
// }
