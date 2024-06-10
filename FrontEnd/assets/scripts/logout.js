"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const logoutNav = document.querySelector("#logoutNav");
    const loginNav = document.querySelector("#loginNav");


    /**
     * Handles user logout
     */
    function handleLogout() {
      console.log("Logout clicked"); // Vérifier si la fonction handleLogout est appelée
      // Supprimer le token
      sessionStorage.removeItem("token");
  
      // Afficher le lien de connexion et masquer le lien de déconnexion
      loginNav.style.display = "inline";
      logoutNav.style.display = "none";
  }
  

    // Add event listener to the logout link (outside handleLogout)
    logoutNav.addEventListener("click", handleLogout);
});

