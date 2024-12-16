let email = document.querySelector("#email");
let password = document.querySelector("#password");

let loginBtn = document.querySelector("#login");

let getEmail = localStorage.getItem("email");
let getPassword = localStorage.getItem("password");

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (email.value === "" || password.value === "") {
    alert("please fill data ");
  } else {
    if (
      getEmail &&
      getEmail.trim() === email.value.trim() &&
      getPassword === password.value
    ) {
      setTimeout(() => {
        window.location = "index.html";
      }, 1000);
      localStorage.setItem("logged-in", "true");
    } else {
      loginBtn.setAttribute("data-bs-target", "#exampleModal");
      loginBtn.setAttribute("data-bs-toggle", "#modal");

      alert("email or password is wrong");
    }
  }
});
