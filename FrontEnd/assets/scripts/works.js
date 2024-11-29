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

   
}

/**
 * Creates a filter button for a category
 * @param {Object} category - 
 */
function createFilter(category) {
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
    }
}

// Initialization
fetchCategories();
fetchWorks();

if (modifyButton) {
    modifyButton.addEventListener("click", () => openModal(gallery)); 
}

document.addEventListener('DOMContentLoaded', () => {
    setupModalTriggers();
    setupModifyButton();
});

function setupModifyButton() {
    const modifyButton = document.querySelector('.modify-button');
    if (modifyButton) {
        // check if token to display the CTA
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
                modal.style.display = 'none'; 
            }
        });
    });

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                modal.style.display = 'none'; 
            }
        });
    });
}



