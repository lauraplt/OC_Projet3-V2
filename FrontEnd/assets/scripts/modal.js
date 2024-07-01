"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const editModal = document.querySelector("#editModal");
    const modalGallery = document.querySelector("#modalGallery");
    const closeModalBtn = document.querySelector(".close");
    const addPhotoBtn = document.querySelector("#addPhotoBtn");
    const addPhotoForm = document.querySelector("#addPhotoForm");
    const uploadForm = document.querySelector("#uploadForm");
    const backArrow = document.querySelector(".back-arrow");

    /**
     * Open the modal to show the edit gallery
     */
    function openModal() {
        editModal.style.display = "block";
        showGallery();
    }

    /**
     * Show the gallery section and hide the add photo form
     */
    function showGallery() {
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
     * Showthe modal gallery with works (without titles)
     */
    async function showModalGallery() {
        try {
            const works = await httpGet("http://localhost:5678/api/works");
            modalGallery.innerHTML = "";
            works.forEach(work => {
                let el_img = document.createElement("img");
                el_img.src = work.imageUrl;
                el_img.alt = work.title;

                let el_item = document.createElement("figure");
                el_item.classList.add("work-item");
                el_item.appendChild(el_img);

                modalGallery.appendChild(el_item);
            });
        } catch (error) {
            console.error("Error fetching works:", error);
            alert("Erreur lors du chargement de la galerie");
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

    // Open modal for modify button
    const modifyButton = document.querySelector(".modify-button");
    if (modifyButton) {
        modifyButton.addEventListener("click", openModal);
    }

    // Show the add photo form
    addPhotoBtn.addEventListener("click", showAddPhotoForm);

    // Submit the form
    uploadForm.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(uploadForm);
        const url_addWork = "http://localhost:5678/api/works";
        const token = sessionStorage.getItem("token");

        fetch(url_addWork, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout de la photo");
            }
            return response.json();
        })
        .then(newWork => {
            works.push(newWork);
            showGallery(); // Refresh the gallery after adding a new work
        })
        .catch(error => {
            console.error("Erreur:", error);
            alert("Erreur lors de l'ajout de la photo");
        });
    });

    // Navigate back to the gallery when clicking the back arrow
    backArrow.addEventListener("click", showGallery);

    // Utility function to perform GET requests
    async function httpGet(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("HTTP GET error");
        }
        return await response.json();
    }

    // Call checkLoginStatus on DOMContentLoaded (from existing script)
    checkLoginStatus();
});

// Utility function to check login status (from existing script)
function checkLoginStatus() {
    const loginNav = document.querySelector("#loginNav");
    const logoutNav = document.querySelector("#logoutNav");
    const token = sessionStorage.getItem("token");

    if (token) {
        loginNav.style.display = "none";
        logoutNav.style.display = "inline";
    } else {
        loginNav.style.display = "inline";
        logoutNav.style.display = "none";
    }
}
