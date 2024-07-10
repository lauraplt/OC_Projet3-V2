"use strict";

// API URL
const url_login = "http://localhost:5678/api/users/login";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    const loginNav = document.querySelector("#loginNav");
    const logoutNav = document.querySelector("#logoutNav");

    if (!loginNav || !logoutNav) {
        console.error("LoginNav or logoutNav element not found.");
        return;
    }

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
            loginNav.classList.add("hide");
            logoutNav.classList.remove("hide");

            // Redirect to the homepage
            window.location.href = "main.html";
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
        loginNav.classList.remove("hide");
        logoutNav.classList.add("hide");

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

/* Checks the login status of the user and updates the UI elements accordingly.
*/
function checkLoginStatus() {
    const loginNav = document.querySelector("#loginNav");
    const logoutNav = document.querySelector("#logoutNav");
    const token = sessionStorage.getItem("token");

    if (loginNav && logoutNav) {
        if (token) {
            loginNav.classList.add("hide");
            logoutNav.classList.remove("hide");
            modifyButton.classList.remove("hide");
            node_filters.classList.add("hide");
        } else {
            loginNav.classList.remove("hide");
            logoutNav.classList.add("hide");
            modifyButton.classList.add("hide");
            node_filters.classList.remove("hide");
        }
    } else {
        console.error("LoginNav or logoutNav element not found.");
    }
}

document.addEventListener("DOMContentLoaded", checkLoginStatus);
