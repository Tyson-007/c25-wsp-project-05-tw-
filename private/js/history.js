window.onload = () => {
  welcomeUser();
  getAllUserBookings();
  logout();
};

async function welcomeUser() {
  const res_user = await fetch("/user/self");
  const user = await res_user.json();

  document.querySelector("#welcome-user").innerHTML = ` ${user.name}`;
}

async function getAllUserBookings() {
  const res_bookingdetails = await fetch("/user/booking");
  const bookingdetails = await res_bookingdetails.json();
  let allBookingsHTML = "";
  // const modify = document.querySelector('#start_at').value
  // modify = modify.replace("T", " ")

  const date = new Date();
  // console.log(date);
  const isoString = date.toISOString();

  // console.log(isoString);

  for (let booking of bookingdetails) {
    try {
      start_at = new Date(booking.start_at).toString().slice(0, 24);
      finish_at = new Date(booking.finish_at).toString().slice(0, 24);

      if (booking.start_at < isoString) {
        allBookingsHTML += `
  
            <div class="booking-container">
            <h1>預約已完成</h2>
              <div class="booked-info mb-2">
              Party Room名稱：
                ${booking.name} 
              
              <br>
              地址：
                ${booking.venue} 
              
              <br>
              價錢 (每小時)：
                ${booking.price} 
              
              <br>
              
                活動開始時間：${start_at} 
              
              <br>
              
                活動結束時間：${finish_at}
              
              </div>
  
            
  
          
  
            </div>
            `;
      } else {
        allBookingsHTML += ``;
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error" });
    }
  }

  document.querySelector(".bookings-container").innerHTML += allBookingsHTML;
}

async function logout() {
  document.querySelector(".logout").addEventListener("click", async (e) => {
    const resp = await fetch(`/auth/logout`, {
      method: "DELETE",
    });

    const result = await resp.json();
    alert(result.message);

    if (resp.status === 200) {
      window.location = "/";
    }
  });
}
