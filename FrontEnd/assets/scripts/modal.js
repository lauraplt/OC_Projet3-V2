"use strict";

// Selecting DOM elements
const modal = document.querySelector("#editGalleryModal");
const modalGallery = document.querySelector("#modalGallery");
const closeModalBtn = modal.querySelector(".close");

const store = sessionStorage;
const token = store.getItem('token');

function createEditBtn() {
  const target = document.querySelector(".edit");
  const btn = document.createElement('button');
  btn.textContent = "Modifier";
  btn.id = "openModalBtn";
  btn.addEventListener("click", openModal);
  target.append(btn);
}

function openModal() {
  modal.style.display = "block";
  loadModalGallery();
}

/**
 * Asynchronous function to load the gallery into the modal.
 * First clears the existing content of the modal gallery, then fetches works from the API and displays them in the modal.
 */
async function loadModalGallery() {
  modalGallery.innerHTML = "";

  works.forEach((work) => {
    let el_img = document.createElement("img");
    el_img.src = work.imageUrl;
    el_img.alt = work.title;
    el_img.classList.add("modal-thumbnail");
    el_img.addEventListener("click", () => {
      // Handle click on thumbnail (if needed)
    });

    modalGallery.appendChild(el_img);
  });
}

(() => {
  // Adding event listener to close the modal when the close button is clicked
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  if (token) {
    createEditBtn();
  }
})();

