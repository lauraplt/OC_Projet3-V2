"use strict";

// API URLs
const url_works = "http://localhost:5678/api/works";
const url_categories = "http://localhost:5678/api/categories";

// DOM elements
const node_filters = document.querySelector("#filters");
const node_gallery = document.querySelector("#gallery");
const editModal = document.querySelector("#editModal");
const modalGallery = document.querySelector("#modalGallery");
const closeModalBtn = document.querySelector(".close");
const addPhotoBtn = document.querySelector("#addPhotoBtn");
const addPhotoForm = document.querySelector("#addPhotoForm");
const uploadForm = document.querySelector("#uploadForm");
const backArrow = document.querySelector(".back-arrow");
const modifyButton = document.querySelector(".modify-button");

// Array to store the works
let works = [];

// ------------------ Works ----------------------------

/**
 * Creates and displays a work item in the gallery
 * @param {Object} work -
 */
function createWork(work) {
  console.log("Creating work:", work);

  let el_img = document.createElement("img");
  el_img.src = work.imageUrl;
  el_img.alt = work.title;

  let el_title = document.createElement("figcaption");
  el_title.textContent = work.title;

  let el_item = document.createElement("figure");
  el_item.classList.add("work-item");
  el_item.appendChild(el_img);
  el_item.appendChild(el_title);

  node_gallery.appendChild(el_item);
}

/**
 * Displays works filtered by category
 * @param {number} category - 
 */
function showWorks(category) {
  console.log("Showing works for category:", category);
  resetGallery();

  if (category == 0) {
    works.forEach((work) => createWork(work));
  } else {
    works.forEach((work) => {
      if (work.categoryId == category) {
        createWork(work);
      }
    });
  }

  resetActiveFilter(category);
}

/**
 * Resets the gallery by removing all child elements
 */
function resetGallery() {
  console.log("Resetting gallery");
  node_gallery.innerHTML = "";
}

// ------------------ Filters ----------------------------

/**
 * Creates a filter button for a category
 * @param {Object} category - 
 */
function createFilter(category) {
  console.log("Creating filter:", category);

  let el_filter = document.createElement("button");
  el_filter.textContent = category.name;
  el_filter.classList.add("filter-item");
  el_filter.dataset.filter = category.id;

  el_filter.addEventListener("click", applyFilter);

  node_filters.append(el_filter);
}

/**
 * Applies a filter based on the click event on a filter button
 * @param {Event} event - 
 */
function applyFilter(event) {
  const btn = event.target;
  showWorks(parseInt(btn.dataset.filter));
}

/**
 * Resets the active filter state by adding an 'is-active' class to the selected filter button
 * @param {number} category - 
 */
function resetActiveFilter(category) {
  document
    .querySelectorAll(".filter-item")
    .forEach((button) => button.classList.remove("is-active"));
  document.querySelectorAll(".filter-item").forEach((button) => {
    if (parseInt(button.dataset.filter) === category) {
      button.classList.add("is-active");
    }
  });

  // Conditionally add/remove classes to show/hide modifyButton based on login status
  if (sessionStorage.getItem("token")) {
    modifyButton.classList.remove("hide");
    modifyButton.classList.add("show");
  } else {
    modifyButton.classList.remove("show");
    modifyButton.classList.add("hide");
  }
}

// ------------------ Modal ----------------------------

/**
 * Open the modal to show the edit gallery
 */
function openModal() {
  editModal.style.display = "block";
  showModalGallery(); 
}

/**
 * Show the gallery section and hide the add photo form
 */
function showGalleryInModal() {
  modalGallery.style.display = "flex";
  addPhotoForm.style.display = "none";
  addPhotoBtn.style.display = "block";
  backArrow.style.display = "none";
  showModalGallery();
}

/**
 * Show the add photo form and hide the gallery section
 */
function showAddPhotoForm() {
  modalGallery.style.display = "none";
  addPhotoForm.style.display = "block";
  addPhotoBtn.style.display = "none";
  backArrow.style.display = "block";
}

/**
 * Show the modal gallery with works (without titles)
 */
async function showModalGallery() {
  try {
    const works = await httpGet(url_works);
    modalGallery.innerHTML = "";
    works.forEach((work) => {
      let el_img = document.createElement("img");
      el_img.src = work.imageUrl;
      el_img.alt = work.title;

      let el_deleteIcon = document.createElement("i");
      el_deleteIcon.classList.add("fa", "fa-trash", "delete-icon");
      el_deleteIcon.addEventListener("click", () => deleteWork(work.id));

      let el_item = document.createElement("figure");
      el_item.classList.add("work-item");
      el_item.appendChild(el_img);
      el_item.appendChild(el_deleteIcon);

      modalGallery.appendChild(el_item);
    });
  } catch (error) {
    console.error("Error fetching works:", error);
    alert("Erreur lors du chargement de la galerie");
  }
}

async function deleteWork(workId) {
  const url_deleteWork = `${url_works}/${workId}`;
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(url_deleteWork, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'œuvre");
    }

    // Remove the work from the local array
    works = works.filter((work) => work.id !== workId);

    const deletedItem = document.querySelector(
      `.work-item[data-id="${workId}"]`
    );
    if (deletedItem) {
      deletedItem.remove();
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur lors de la suppression de l'œuvre");
  }
}

/**
 * Close the modal
 */
function closeModal() {
  editModal.style.display = "none";
}

closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", function (event) {
  if (event.target === editModal) {
    closeModal();
  }
});

// Show the add photo form
addPhotoBtn.addEventListener("click", showAddPhotoForm);

// Submit the form
uploadForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(uploadForm);
  const url_addWork = url_works;
  const token = sessionStorage.getItem("token");

  fetch(url_addWork, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la photo");
      }
      return response.json();
    })
    .then((newWork) => {
      works.push(newWork);
      showGalleryInModal(); // Refresh the gallery after adding a new work
    })
    .catch((error) => {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout de la photo");
    });
});

// Navigate back to the gallery when clicking the back arrow
backArrow.addEventListener("click", showGalleryInModal);

// Initialize modify button functionality
modifyButton.addEventListener("click", openModal);

// ------------------ Init ----------------------------

/**
 * Function to initialize filters and display all works
 */
(async function () {
  const categories = await httpGet(url_categories);
  console.log("Categories:", categories);
  works = await httpGet(url_works);
  console.log("Works:", works);

  // Display the "All" Filters Buttons
  createFilter({ id: 0, name: "Tous" });
  // Create a filter button for each category
  categories.forEach((category) => createFilter(category));

  // Display all Works and set "Tous" as active filter by default
  showWorks(0);
  resetActiveFilter(0);

  // Initialize login status check
  checkLoginStatus();
})();

