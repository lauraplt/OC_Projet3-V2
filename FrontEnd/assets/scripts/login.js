"use strict";

// API URL
const url_login = "http://localhost:5678/api/users/login";

document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const loginForm = document.querySelector("#loginForm");
    const loginNav = document.querySelector("#loginNav");
    const logoutNav = document.querySelector("#logoutNav");

    /**
     * Handles the login form submission
     * @param {Event} event - The form submit event
     */
    async function handleLogin(event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const username = formData.get("username");
        const password = formData.get("password");

        try {
            const data = await httpPost(url_login, { email: username, password: password }, { "Content-Type": "application/json" });

            // Assuming the token is returned in the response
            sessionStorage.setItem("token", data.token);

            // Display logout link and hide login link
            loginNav.style.display = "none";
            logoutNav.style.display = "inline";

            // Redirect to the homepage
            window.location.href = "index.html";
        } catch (error) {
            alert(`Erreur: ${error.message}`);
        }
    }

    // Add event listener to the login form
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
});
