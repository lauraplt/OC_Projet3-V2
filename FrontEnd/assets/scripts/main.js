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
async function httpPost(url, data, headers) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'HTTP POST error');
    }
    return responseData;
  } catch (e) {
    console.error("HTTP POST error:", e);
    throw e;
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

// Call checkLoginStatus on DOMContentLoaded
document.addEventListener("DOMContentLoaded", checkLoginStatus);