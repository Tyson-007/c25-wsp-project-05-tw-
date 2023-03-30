window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("pid")) {
    window.location = `/`;
    return;
  }

  const resp = await fetch(`/roomDetails/${urlSearchParams.get("pid")}`);
  const partyroom_details = await resp.json();
  console.log(partyroom_details);

  // const loginBtn = `<button onClick="login()">Login</button>`;
  // const addPokemon = `<button onClick="addPokemon(${pokemon.id})">Add Pokemon</button>`;
  const image = `<img src="/images/${partyroom_details.imagefilename}" width = "20" alt=""/>`;

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
      <p class="equipments">Names: ${partyroom_details.equipment_name}<br>Types: ${partyroom_details.type}</p>
    </div>
    <div class="right-part">
      <p class="room-image">我要圖: ${image}</p>
    </div>
  </div>
    `;
  //   <p>場地主人: ${partyroom_details.name}</p>
  //   ${(await checkLogin()) ? addPokemon : loginBtn}
  document.querySelector(".banner").innerHTML = htmlStr;
};
