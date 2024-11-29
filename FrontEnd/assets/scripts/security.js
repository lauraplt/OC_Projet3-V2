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
        // Envoi des données au backend pour validation
        const data = await httpPost(url_login, { email: username, password: password }, { "Content-Type": "application/json" });

        // Vérification si le backend retourne une erreur (e.g. utilisateur non trouvé, mot de passe incorrect)
        if (data && data.token) {
            // Si un token est retourné, on l'enregistre et on redirige
            sessionStorage.setItem("token", data.token);

            // Affichage des liens de déconnexion et masquage de la connexion
            document.querySelector("#loginNav").classList.add("hide");
            document.querySelector("#logoutNav").classList.remove("hide");

            // Redirection vers la page d'accueil
            window.location.href = "index.html";
        } else {
            // Si aucun token n'est renvoyé, l'authentification a échoué
            alert("Nom d'utilisateur ou mot de passe incorrect.");
        }
    } catch (error) {
        alert(`Erreur: ${error.message}`);
    }
}

/**
 * Handles user logout
 */
function handleLogout() {
    sessionStorage.removeItem("token");

    // Affichage du lien de connexion et masquage du lien de déconnexion
    document.querySelector("#loginNav").classList.remove("hide");
    document.querySelector("#logoutNav").classList.add("hide");

    // Rafraîchissement de la page pour appliquer les changements
    window.location.reload();
}

/**
 * Checks the login status of the user and updates the UI elements accordingly.
 */
function checkLoginStatus() {
    const loginNav = document.querySelector("#loginNav");
    const logoutNav = document.querySelector("#logoutNav");
    const editionMode = document.querySelector(".editionMode");
    const modifyButton = document.querySelector(".modify-button");
    const node_filters = document.querySelector("#filters");
    const token = sessionStorage.getItem("token");

    if (loginNav && logoutNav && modifyButton && node_filters && editionMode) {
        if (token) {
            // Si l'utilisateur est connecté
            loginNav.style.display = "none";   
            logoutNav.style.display = "inline"; 
            modifyButton.style.display = "inline"; 
            editionMode.classList.add("show");   
            node_filters.style.display = "none";  
        } else {
            // Si l'utilisateur n'est pas connecté
            loginNav.style.display = "inline";   
            logoutNav.style.display = "none";   
            modifyButton.style.display = "none"; 
            editionMode.classList.remove("show");   
            node_filters.style.display = "block"; 
        }
    }
}

// Appeler checkLoginStatus au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    // Suppression du code redondant pour gérer l'édition mode
    // La vérification se fait maintenant uniquement dans checkLoginStatus()
  
    const loginForm = document.querySelector("#loginForm");
    const logoutNav = document.querySelector("#logoutNav");
  
    // Vérification du statut de connexion
    checkLoginStatus();

    // Gestion du formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    // Gestion de la déconnexion
    if (logoutNav) {
        logoutNav.addEventListener("click", handleLogout);
    }
});
