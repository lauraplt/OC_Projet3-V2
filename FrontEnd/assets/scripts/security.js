"use strict";

// API URL
const url_login = "http://localhost:5678/api/users/login";

/**
 * Handles the login form submission
 * @param {Event} event - The form submit event
 */
async function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(document.querySelector("#loginForm"));
    const username = formData.get("username");
    const password = formData.get("password");

    try {
        const data = await httpPost(url_login, { email: username, password: password }, { "Content-Type": "application/json" });

        // Assuming the token is returned in the response
        sessionStorage.setItem("token", data.token);

        // Display logout link and hide login link
        document.querySelector("#loginNav").classList.add("hide");
        document.querySelector("#logoutNav").classList.remove("hide");

        // Redirect to the homepage
        window.location.href = "index.html";
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * Handles user logout
 */
function handleLogout() {
    sessionStorage.removeItem("token");

    // Display login link and hide logout link
    document.querySelector("#loginNav").classList.remove("hide");
    document.querySelector("#logoutNav").classList.add("hide");

    // Refresh the page to apply changes
    window.location.reload();
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    const loginNav = document.querySelector("#loginNav");
    const logoutNav = document.querySelector("#logoutNav");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (logoutNav) {
        logoutNav.addEventListener("click", handleLogout);
    }

    checkLoginStatus();
});

/**
 * Checks the login status of the user and updates the UI elements accordingly.
 */
function checkLoginStatus() {
    const loginNav = document.querySelector("#loginNav");
    const logoutNav = document.querySelector("#logoutNav");
    const modifyButton = document.querySelector(".modify-button");
    const node_filters = document.querySelector("#filters");
    const token = sessionStorage.getItem("token");

    if (loginNav && logoutNav && modifyButton && node_filters) {
        if (token) {
            loginNav.style.display = "none";
            logoutNav.style.display = "inline";
            modifyButton.style.display = "inline";
            node_filters.style.display = "none";
        } else {
            loginNav.style.display = "inline";
            logoutNav.style.display = "none";
            modifyButton.style.display = "none";
            node_filters.style.display = "";
        }
    } else {
    
    }
}

// Call checkLoginStatus on DOMContentLoaded
document.addEventListener("DOMContentLoaded", checkLoginStatus);
