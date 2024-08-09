"use strict";

// API URLs
const url_works = "http://localhost:5678/api/works";
const url_categories = "http://localhost:5678/api/categories";

// DOM elements
const node_filters = document.querySelector("#filters");
const node_gallery = document.querySelector("#gallery");
const modifyButton = document.querySelector(".modify-button");

// Array to store the works
let works = [];

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

    if (category === 0) {
        works.forEach((work) => createWork(work));
    } else {
        works.forEach((work) => {
            if (work.categoryId === category) {
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
    } catch (error) {
        console.error("Error fetching works:", error);
    }
}

/**
 * Opens the modal when the modify button is clicked
 * @param {string} modalId - The ID of the modal to open
 */
function openModal(gallery) {
    const modal = document.querySelector(`#${gallery}`);
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("Modal element not found.");
    }
}

// Initialization
fetchCategories();
fetchWorks();

if (modifyButton) {
    modifyButton.addEventListener("click", () => openModal(gallery)); // Remplacez 'modalId' par l'ID réel de votre modal
}

document.addEventListener('DOMContentLoaded', () => {
    setupModalTriggers();
    setupModifyButton();
});

function setupModifyButton() {
    const modifyButton = document.querySelector('.modify-button');
    if (modifyButton) {
        // Vérifiez si un token est présent pour décider de l'affichage du bouton
        if (sessionStorage.getItem("token")) {
            modifyButton.style.display = 'block';
        } else {
            modifyButton.style.display = 'none';
        }

        modifyButton.addEventListener('click', event => {
            event.preventDefault();
            openModal(gallery);
        });
    } else {
        console.error("Bouton de modification introuvable.");
    }
}

function setupModalTriggers() {
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none'; // Cache la modale
            }
        });
    });

    // Optionnel : Cacher la modale en cliquant en dehors du contenu
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                modal.style.display = 'none'; // Cache la modale si on clique en dehors du contenu
            }
        });
    });
}