"use strict";

const apiUrl = "http://localhost:5678/api";
const worksEndpoint = "/works";
const loginEndpoint = "/login";

const filtersElement = document.getElementById("filters");
const projectsElement = document.getElementById("gallery");
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

function fetchData(endpoint) {
  return fetch(`${apiUrl}${endpoint}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur de la requête HTTP");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
}

function getUniqueFilters(works) {
  return new Set(works.map((project) => project.category.name));
}

function generateFilterButtons(filters) {
  let filterHTML = `<button id="Tous" class="button-filter selected">Tous</button>`;
  filters.forEach((filter) => {
    const filterId = filter.replace(/\s+/g, "-");
    filterHTML += `<button id="${filterId}" class="button-filter">${filter}</button>`;
  });
  filtersElement.innerHTML = filterHTML;
}

function addFilterEventListeners() {
  document.querySelectorAll(".button-filter").forEach((button) => {
    button.addEventListener("click", () => {
      displayWorks(works, button.innerText);
      document.querySelectorAll(".button-filter").forEach((btn) => {
        btn.classList.remove("selected");
      });
      button.classList.add("selected");
    });
  });
}

function displayWorks(works, filter) {
  projectsElement.innerHTML = "";
  const filteredWorks = filter === "Tous" ? works : works.filter((work) => work.category.name === filter);
  filteredWorks.forEach(createWork);
}

function createWork(work) {
  const workItem = document.createElement("div");
  workItem.classList.add("work-item");

  const workImage = document.createElement("img");
  workImage.src = work.imageUrl;
  workImage.alt = work.title;

  const workTitle = document.createElement("p");
  workTitle.textContent = work.title;

  workItem.append(workImage, workTitle);
  projectsElement.append(workItem);
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch(`${apiUrl}${loginEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Nom d'utilisateur ou mot de passe incorrect");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Login successful:", data);

      const token = data.token;
      if (!token) {
        throw new Error("Token not found in the response");
      }

      localStorage.setItem("authToken", token);
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Login error:", error);
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    });
}

fetchData(worksEndpoint)
  .then((works) => {
    const uniqueFilters = getUniqueFilters(works);
    generateFilterButtons(uniqueFilters);
    addFilterEventListeners();
    displayWorks(works, "Tous");
  });

loginForm.addEventListener("submit", handleLoginSubmit);
