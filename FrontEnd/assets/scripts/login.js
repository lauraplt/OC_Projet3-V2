"use strict";

// URL for user login
const url_login = "http://localhost:5678/api/users/login";


/**
 * Handles the login form submission
 * @param {Event} event - The form submit event
 */
async function handleLogin(event) {
  event.preventDefault();
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  try {
    const data = await httpPost(url_login, { email: username, password: password }, { "Content-Type": "application/json" });

    // Save the token (if returned by the server)
    localStorage.setItem("token", data.token);

    // Update the UI for a logged-in user
    document.querySelector("#loginNav").style.display = "none";
    document.querySelector("#logoutNav").style.display = "block";
  } catch (error) {
    alert("Email ou mot de passe incorrect");
  }
}

/**
 * Handles the logout functionality
 */
function handleLogout() {
  // Clear the token
  localStorage.removeItem("token");

  // Update the UI for a logged-out user
  document.querySelector("#loginNav").style.display = "block";
  document.querySelector("#logoutNav").style.display = "none";
}

// Add event listeners for login and logout
document.querySelector("#loginForm").addEventListener("submit", handleLogin);
document.querySelector("#logoutNav").addEventListener("click", handleLogout);

// Check if the user is logged in when the page loads
if (localStorage.getItem("token")) {
  document.querySelector("#loginNav").style.display = "none";
  document.querySelector("#logoutNav").style.display = "block";
}
