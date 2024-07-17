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
const imageInput = document.querySelector("#image");
const imagePreview = document.querySelector("#imagePreview");

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
 * Creates and displays a work item in the modal gallery
 * @param {Object} work -
 */
function createModalWork(work) {
    console.log("Creating modal work:", work);

    let el_img = document.createElement("img");
    el_img.src = work.imageUrl;
    el_img.alt = work.title;

    let el_trash = document.createElement("span");
    el_trash.innerHTML = "&#128465;"; // Unicode for trash can icon
    el_trash.classList.add("trash-icon");
    el_trash.addEventListener("click", () => deleteWork(work.id));

    let el_item = document.createElement("div");
    el_item.classList.add("modal-work-item");
    el_item.appendChild(el_img);
    el_item.appendChild(el_trash);

    modalGallery.appendChild(el_item);
}

/**
 * Deletes a work item by ID
 * @param {number} workId -
 */
async function deleteWork(workId) {
    const token = sessionStorage.getItem("token");
    try {
        const response = await fetch(`${url_works}/${workId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression de l'œuvre");
        }

        console.log("Œuvre supprimée:", workId);

        // Find the index of the deleted work and remove it from the works array
        const deletedWorkIndex = works.findIndex(work => work.id === workId);
        if (deletedWorkIndex !== -1) {
            works.splice(deletedWorkIndex, 1);
        }

        // Update gallery and modal after deletion
        fetchWorks();
        showModalWorks();
    } catch (error) {
        console.error("Erreur lors de la suppression de l'œuvre:", error);
        alert("Erreur lors de la suppression de l'œuvre");
    }
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

/**
 * Opens the modal and shows the works
 */
function openModal() {
    editModal.style.display = "block";
    showModalWorks();
    addPhotoForm.style.display = "none";
    addPhotoBtn.classList.remove("hidden");
}

/**
 * Shows the works in the modal
 */
function showModalWorks() {
    console.log("Showing modal works");
    modalGallery.innerHTML = "";

    // Add the title
    let el_title = document.createElement("h2");
    el_title.textContent = "Galerie Photo";
    modalGallery.appendChild(el_title);

    for (let i = 0; i < works.length; i++) {
        createModalWork(works[i]);
    }

    modalGallery.style.display = "block";
}

/**
 * Closes the modal
 */
function closeModal() {
    editModal.style.display = "none";
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

/**
 * Fetches categories and creates filter buttons
 */
async function fetchCategories() {
    try {
        const response = await fetch(url_categories);
        const categories = await response.json();

        console.log("Fetched categories:", categories);

        // Create the "Tous" filter
        createFilter({ id: 0, name: "Tous" });

        // Create filters for each category
        categories.forEach((category) => createFilter(category));

        // Set the "Tous" filter as the default active filter
        resetActiveFilter(0);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

/**
 * Fetches works and initializes the gallery
 */
async function fetchWorks() {
    try {
        const response = await fetch(url_works);
        works = await response.json();

        console.log("Fetched works:", works);

        showWorks(0);
        showModalWorks()
    } catch (error) {
        console.error("Error fetching works:", error);
    }
}

// ------------------ Modal ----------------------------

// Open modal on "Modifier" button click
modifyButton.addEventListener("click", openModal);

// Close modal on close button click
closeModalBtn.addEventListener("click", closeModal);

// Close modal on clicking outside the modal content
window.addEventListener("click", (event) => {
    if (event.target === editModal) {
        closeModal();
    }
});

// Close modal on pressing the Escape key
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && editModal.style.display === "block") {
        closeModal();
    }
});

// Open add photo form on "Ajouter une photo" button click
addPhotoBtn.addEventListener("click", () => {
    modalGallery.style.display = "none";
    addPhotoForm.style.display = "block";
    addPhotoBtn.classList.add("hidden");
});

// Close add photo form and reset on back arrow click
backArrow.addEventListener("click", () => {
    addPhotoForm.style.display = "none";
    modalGallery.style.display = "block";
    uploadForm.reset();
    imagePreview.innerHTML = "";
    addPhotoBtn.classList.remove("hidden");
});

// Preview image on image input change
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            const imgElement = document.createElement("img");
            imgElement.src = reader.result;
            imgElement.alt = "Preview Image";
            imgElement.classList.add("selected-image");

            imagePreview.innerHTML = "";
            imagePreview.appendChild(imgElement);
        });

        reader.readAsDataURL(file);
    }
});

// Handle upload form submission
uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(uploadForm);
    const token = sessionStorage.getItem("token");

    try {
        const response = await fetch(url_works, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout de la photo");
        }

        const newWork = await response.json();
        console.log("Nouvelle œuvre ajoutée:", newWork);

        uploadForm.reset();
        imagePreview.innerHTML = "";

        closeModal();
        fetchWorks();
    } catch (error) {
        console.error("Erreur lors de l'envoi de la photo:", error);
        alert("Erreur lors de l'ajout de la photo");
    }
});

// Initialization
fetchCategories();
fetchWorks();
