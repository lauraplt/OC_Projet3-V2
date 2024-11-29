"use strict";

// Call URL GET
async function httpGet(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

// Call URL POST
async function httpPost(url, data, headers = {}) {
  const isFormData = data instanceof FormData;
  const options = {
      method: 'POST',
      headers: Object.assign(
          {},
          headers,
          isFormData ? {} : { 'Content-Type': 'application/json' }
      ),
      body: isFormData ? data : JSON.stringify(data)
  };

  isFormData && delete options.headers['Content-Type'];

  try {
      const response = await fetch(url, options);

      if (!response.ok) {
          // If response is not OK, throw an exception
          throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
  } catch (error) {
      console.error("Error during POST request", error);
      throw error; // Reject the error to be handled in the calling function
  }
}

// Utility function to check login status
function checkLoginStatus() {
    const loginNav = document.querySelector("#loginNav");
    const logoutNav = document.querySelector("#logoutNav");
    const token = sessionStorage.getItem("token");

    if (token) {
        loginNav.style.display = "none";
        logoutNav.style.display = "inline";
    } else {
        loginNav.style.display = "inline";
        logoutNav.style.display = "none";
    }
}

// Appeler checkLoginStatus au chargement du DOM
document.addEventListener("DOMContentLoaded", checkLoginStatus);
