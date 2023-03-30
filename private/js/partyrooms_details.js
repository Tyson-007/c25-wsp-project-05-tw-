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
      <p class="equipments">設備: ${partyroom_details.equipment_in_service}<br>Switch: ${partyroom_details.switch_game}<br>卓上遊戲: ${partyroom_details.board_game}</p>
    </div>
    <div class="right-part">
      <p class="room-image">我要圖: ${image}</p>
    </div>


  </div>

  <div class="edit-and-del">
    <button class="edit-button">
      更改
    </button>
    <button class="del-button">
      刪除
    </button>
  </div>
    `;
  //   <p>場地主人: ${partyroom_details.name}</p>
  //   ${(await checkLogin()) ? addPokemon : loginBtn}
  document.querySelector(".banner").innerHTML = htmlStr;

  const editBtn = document.querySelector(".edit-button");

  editBtn.addEventListener("click", async (e) => {
    // const memoDiv = e.currentTarget.parentElement;
    const roomDiv = editBtn.parentElement;
    const roomId = roomDiv.dataset.id;
    const newContent = roomDiv.querySelector(".banner").textContent.trim();

    const resp = await fetch(`/roomDetails/${memoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent }),
    });

    // if (resp.status == 200) {
    //   const result = await resp.json();
    //   alert(result.message);
    // } else {
    //   const result = await resp.json();
    //   alert(result.message);
    // }
    const result = await resp.json();
    alert(result.message);
  });
};
