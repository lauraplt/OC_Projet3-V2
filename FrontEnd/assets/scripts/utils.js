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
async function httpPost(url, data, headers = {}, requiresAuth = true) {
  const isFormData = data instanceof FormData;
  const token = sessionStorage.getItem("token");

  const options = {
      method: 'POST',
      headers: Object.assign(
          {},
          headers,
          isFormData ? {} : { 'Content-Type': 'application/json' },
          (requiresAuth && token) ? { 'Authorization': `Bearer ${token}` } : {}
      ),
      body: isFormData ? data : JSON.stringify(data)
  };

  if (isFormData) {
      delete options.headers['Content-Type'];
  }

  try {
      const response = await fetch(url, options);

      if (requiresAuth && response.status === 401) {
          console.error("Unauthorized: Login required.");
          sessionStorage.removeItem("token");
          checkLoginStatus();
          throw new Error("Unauthorized - Token invalid or expired");
      }

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
  } catch (error) {
      console.error("Error during POST request", error);
      throw error;
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
    
    const modifyButton = document.querySelector('.modify-button');
    if (modifyButton) {
        modifyButton.style.display = token ? 'block' : 'none';
    }
}

// Appeler checkLoginStatus au chargement du DOM
document.addEventListener("DOMContentLoaded", checkLoginStatus);
