"use strict";

// DOM elements for the modal
const modalGallery = document.querySelector("#modalGallery");
const closeModalBtn = document.querySelector("#editGalleryModal .close");

const store = sessionStorage;
let token = store.getItem('token'); // Change 'const' to 'let' if token might change

/**
 * Loads and displays the gallery in the modal
 */
async function loadModalGallery() {
  try {
    const works = await fetchWorks();
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
  } catch (e) {
    console.error("Error loading modal gallery:", e);
  }
}

/**
 * Fetches works from the server
 * @returns {Promise<Array>} - Array of works
 */
async function fetchWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) {
      throw new Error('Failed to fetch works');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching works:', error.message);
    return [];
  }
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
      await loadModalGallery(); // Reload modal gallery after deletion
    } else {
      console.error("Failed to delete work");
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

/**
 * Validates and adds a new image to the gallery
 */
async function validateImage() {
  const image = document.querySelector("#imageUpload").files[0];
  const title = document.querySelector("#imageTitle").value;
  const category = document.querySelector("#imageCategory").value;

  if (!image || !title || !category) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  try {
    const response = await fetch(`http://localhost:5678/api/works`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      await loadModalGallery(); // Reload modal gallery after adding a new image
      backToGallery();
    } else {
      console.error("Failed to add work");
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

/**
 * Shows the form to add a new image
 */
function showAddImageForm() {
  document.querySelector("#addImageForm").style.display = "block";
  modalGallery.style.display = "none";
  document.querySelector("#addImageBtn").style.display = "none";
}

/**
 * Hides the form to add a new image and shows the gallery
 */
function backToGallery() {
  document.querySelector("#addImageForm").style.display = "none";
  modalGallery.style.display = "block";
  document.querySelector("#addImageBtn").style.display = "block";
}

// Event listeners
document.querySelector("#addImageBtn").addEventListener("click", showAddImageForm);
document.querySelector("#backToGalleryBtn").addEventListener("click", backToGallery);
document.querySelector("#validateImageBtn").addEventListener("click", validateImage);
closeModalBtn.addEventListener("click", () => {
  document.querySelector("#editGalleryModal").style.display = "none";
});

