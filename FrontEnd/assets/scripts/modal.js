"use strict";

// DOM elements for the modal
const modal = document.querySelector("#editGalleryModal");
const modalGallery = document.querySelector("#modalGallery");
const closeModalBtn = modal.querySelector(".close");

const store = sessionStorage;
let token = store.getItem('token'); // Change 'const' to 'let' if token might change

/**
 * Creates and displays the edit button
 */
function createEditBtn() {
  const target = document.querySelector(".edit");
  const btn = document.createElement('button');
  btn.textContent = "Modifier";
  btn.id = "openModalBtn";
  btn.addEventListener("click", openModal); // Add click event listener here
  target.append(btn);
}

/**
 * Opens the modal
 */
function openModal() {
  modal.style.display = "block";
  loadModalGallery();
}

/**
 * Loads and displays the gallery in the modal
 */
async function loadModalGallery() {
  modalGallery.innerHTML = "";

  works.forEach((work) => {
    let el_img = document.createElement("img");
    el_img.src = work.imageUrl;
    el_img.alt = work.title;
    el_img.classList.add("modal-thumbnail");

    let deleteIcon = document.createElement("span");
    deleteIcon.textContent = "🗑️";
    deleteIcon.classList.add("delete-icon");
    deleteIcon.addEventListener("click", () => deleteWork(work.id));

    let el_container = document.createElement("div");
    el_container.classList.add("modal-item");
    el_container.appendChild(el_img);
    el_container.appendChild(deleteIcon);

    modalGallery.appendChild(el_container);
  });
}

/**
 * Deletes a work item by its ID
 * @param {number} workId - The ID of the work item to delete
 */
async function deleteWork(workId) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      works = works.filter(work => work.id !== workId);
      loadModalGallery();
      showWorks(0);
    } else {
      console.error("Failed to delete work");
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

// ------------------ Init ----------------------------

/**
 * Initializes modal functionalities
 */
(() => {
  const closeModalBtn = modal.querySelector(".close");

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  token = sessionStorage.getItem('token'); // Update token if necessary

  if (token) {
    createEditBtn(); // Ajoute le bouton "Modifier"
    // Ne pas appeler openModal() ici pour éviter l'affichage automatique de la modale
  }
})();
