window.onload = () => {
  initLogin();
  initSignup();
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

    if (res.status === 200) {
      // res.json({ message: "success" });
      window.location = "/users.html";
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}

// need to test!!! //
async function initSignup() {
  const signupForm = document.querySelector("#signup-form");
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = signupForm.name.value;
    const password = signupForm.password.value;
    const phone_no = signupForm.phone_no.value;
    const date_of_birth = signupForm.date_of_birth.value;
    const email = signupForm.email.value;
    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, phone_no, date_of_birth, email }),
    });
    const data = await res.json();

    if (res.status === 200) {
      window.location = "/";
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}
