"use strict";

// API URL
const url_login = "http://localhost:5678/api/users/login";

document.addEventListener("DOMContentLoaded", () => {
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

    /**
     * Handles user logout
     */
    function handleLogout() {
        sessionStorage.removeItem("token");

        // Display login link and hide logout link
        loginNav.style.display = "inline";
        logoutNav.style.display = "none";

        // Refresh the page to apply changes
        window.location.reload();
    }

    // Add event listener to the login form
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    // Add event listener to the logout link
    logoutNav.addEventListener("click", handleLogout);
});

/**
 * Utility function for HTTP POST requests
 * @param {string} url - The URL to send the request to
 * @param {Object} body - The body of the request
 * @param {Object} headers - The headers for the request
 * @returns {Promise<Object>} - The response data
 */
async function httpPost(url, body, headers) {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers,
    });
    return response.json();
}
