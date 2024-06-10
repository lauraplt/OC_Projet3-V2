"use strict";

/**
 * Main function triggered when the DOM is fully loaded.
 * Initializes event listeners to open and close the modal, and load the gallery into the modal.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Selecting DOM elements
  const openModalBtn = document.querySelector("#openModalBtn");
  const modal = document.querySelector("#editGalleryModal");
  const closeModalBtn = document.querySelector(".close");
  const modalGallery = document.querySelector("#modalGallery");
  // Adding event listener to open the modal when the button is clicked
  openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    loadModalGallery();
  });
  // Adding event listener to close the modal when the close button is clicked
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  // Adding event listener to close the modal when the user clicks outside of it
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  /**
   * Asynchronous function to load the gallery into the modal.
   * First clears the existing content of the modal gallery, then fetches works from the API and displays them in the modal.
   */
  async function loadModalGallery() {
    modalGallery.innerHTML = "";
    const works = await httpGet(url_works);

    works.forEach((work) => {
      let el_img = document.createElement("img");
      el_img.src = work.imageUrl;
      el_img.alt = work.title;

      let el_title = document.createElement("figcaption");
      el_title.textContent = work.title;

      let el_item = document.createElement("figure");
      el_item.classList.add("work-item");
      el_item.appendChild(el_img);
      el_item.appendChild(el_title);

      modalGallery.appendChild(el_item);
    });
  }
});
