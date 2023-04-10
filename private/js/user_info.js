window.onload = () => {
  changeUserInfo();
  logout();
  welcomeUser();
};

function changeUserInfo() {
  const user_info_form = document.querySelector("#user_info_form");
  user_info_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = user_info_form.email.value;
    const phone_no = user_info_form.phone_no.value;
    const date_of_birth = user_info_form.date_of_birth.value;
    const res = await fetch("/user/user_info", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone_no, date_of_birth }),
    });

    if (res.status === 200) {
      // res.json({ message: "success" });
      alert("Update successful");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}

function logout() {
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

async function welcomeUser() {
  const res_user = await fetch("/user/self");
  const user = await res_user.json();

  document.querySelector("#welcome-user").innerHTML = ` ${user.name}`;
}
