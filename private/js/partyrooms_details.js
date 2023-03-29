window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("pid")) {
    window.location = "/";
    return;
  }

  const resp = await fetch(`/upload/${urlSearchParams.get("pid")}`);
  const partyroom_details = await resp.json();
  console.log(partyroom_details);

  // const loginBtn = `<button onClick="login()">Login</button>`;
  // const addPokemon = `<button onClick="addPokemon(${pokemon.id})">Add Pokemon</button>`;

  let htmlStr = `
  <div class="banner">
  <div class="pr-booking-div">
  <h1>場地名稱: ${partyroom_details.name}</h1>
    <button class="booking-now">立場預約</button>
  </div>
</div>
<!-- Details-Area-->
<div class="details-main-container">
  <div class="left-part">
    <p class="room-details">場地資訊: ${partyroom_details.price}</p>
    <p class="equipments">設備: ${partyroom_details.intro}</p>
  </div>
  <div class="right-part">
    <p class="room-image">我要圖: ${partyroom_details.imagefilename}</p>
  </div>
</div>
    `;
  //   <p>場地主人: ${partyroom_details.name}</p>
  //   ${(await checkLogin()) ? addPokemon : loginBtn}
  document.querySelector(".all-details").innerHTML = htmlStr;
};

//   let htmlStr = `
//       <h1>場地名稱: ${partyroom_details.name}</h1>
//       <p class="partyroom-name">場地資訊: ${partyroom_details.price}</p>
//       <p class="room-image">我要圖: ${partyroom_details.imagefilename}</p>
//       <p class="equipments">設備: ${partyroom_details.intro}</p>
//     `;
//   //   <p>場地主人: ${partyroom_details.name}</p>
//   //   ${(await checkLogin()) ? addPokemon : loginBtn}
//   document.querySelector(".all-details").innerHTML = htmlStr;
// };

//   async function checkLogin() {
//     const resp = await fetch("/users");
//     return resp.status === 200;
//   }

//   function login() {
//     window.location = `/login.html?path=${location.pathname}${window.location.search}`;
//   }

//   function addPokemon(id) {
//     console.log(id);
//   }

// window.onload = () => {
//   getEdit();
// };

// /*
//      div class & id names TBC
//     */
// async function getEdit() {
//   const res = await fetch("/upload");
//   const partyroom_details = await res.json();
//   let partyroom_detailsCardsHtml = "";
//   document.querySelector(".roomInfo-photo").innerHTML = "";
//   //攞出黎嘅data放嘅位置

//   for (let partyroom_detail of partyroom_details) {
//     const image = `<img src="/images/${partyroom_detail.imagefilename}" width = "20" alt=""/>`;

//     partyroom_detailsCardsHtml += `
//         <div class="roomInfo-photo-title" data-id="${partyroom_detail.id}">
//           <div class="room-card-photo">
//             ${image}
//           </div>
//           <div class="room-card-copy">
//             ${partyroom_detail.name} @ ${partyroom_detail.venue}
//           </div>
//         </div>
//         `;
//   }
//   //加一個空嘅div係HTML，上面嘅野係edit落去空嘅HTML到
//   document.querySelector(".roomInfo-photo").innerHTML +=
//     partyroom_detailsCardsHtml;
// }
