"use strict";

/**
 * Main function triggered when the DOM is fully loaded.
 * Initializes event listeners to open and close the modal, and load the gallery into the modal.
 */
  // Selecting DOM elements
  const modal = document.querySelector("#editGalleryModal");
  const closeModalBtn = document.querySelector(".close");
  const modalGallery = document.querySelector("#modalGallery");

  const store = sessionStorage;
  const token = store.getItem('token');
  
function createEditBtn()
{
  const target = document.querySelector(".edit");
  const btn = document.createElement('button');
        btn.textContent = "Modifier";
        btn.id = "openModalBtn"; 
        btn.addEventListener("click", openModal);
  target.append(btn);       
}


function openModal()
{
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

      let el_title = document.createElement("figcaption");
      el_title.textContent = work.title;

      let el_item = document.createElement("figure");
      el_item.classList.add("work-item");
      el_item.appendChild(el_img);
      el_item.appendChild(el_title);

      modalGallery.appendChild(el_item);
    });
  }

  (() => {
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

    if (token)
    {
      createEditBtn();
    }
})();
