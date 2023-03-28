window.onload = () => {
  initLogin();
};

async function initLogin() {
  const loginForm = document.querySelector("#login-form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = loginForm.name.value;
    const password = loginForm.password.value;
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    const data = await res.json();
    console.log(data);

    if (res.status === 200) {
      // res.json({ message: "success" });
      window.location = "/users.html";
    } else {
      const data = await res.json();
      alert(data.mesage);
    }
  });
}
