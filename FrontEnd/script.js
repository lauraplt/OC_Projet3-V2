"use strict";

const url = "http://localhost:5678/api/works"; 

const divFilters = document.getElementById("filters");
const divProjects = document.getElementById("gallery");

// Request from API
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erreur de la requête HTTP");
    }
    return response.json();
  })
  .then((works) => {
    // Generate filters
    const portfolioSection = new Set();
    works.forEach((project) => {
      portfolioSection.add(project.category.name);
    });

    const tableProjects = Array.from(portfolioSection);
    let filterHTML = '<button id="Tous" class="button-filter selected">Tous</button>';
    tableProjects.forEach((filter) => {
      const filterId = filter.replace(/\s+/g, '-'); // Ensure valid HTML IDs
      filterHTML += `<button id="${filterId}" class="button-filter">${filter}</button>`;
    });

    divFilters.innerHTML = filterHTML;

    // Add event listeners for filters
    document.querySelectorAll('.button-filter').forEach((button) => {
      button.addEventListener('click', () => {
        displayWorks(works, button.innerText);

        // Remove 'selected' class of every buttons
        document.querySelectorAll('.button-filter').forEach((btn) => {
          btn.classList.remove('selected');
        });
        
        // Add the class 'selected' for the selected button
        button.classList.add('selected');
      
      });
    });

    // Display all works initially
    displayWorks(works, 'Tous');
  })
  .catch((error) => {
    console.error("Erreur:", error);
  });

// Function to display works based on filter
function displayWorks(works, filter) {
  divProjects.innerHTML = ''; // Clear existing images

  const filteredWorks = filter === 'Tous' ? works : works.filter(work => work.category.name === filter);

  // Loop on filtered works and create DOM work element 
  filteredWorks.forEach(work => createWork(work));
}

/**
 * Create a DOM Element for a work
 * 
 * @param {Object} work
 */
function createWork(work) {
  let el_img = document.createElement('img');
  el_img.src = work.imageUrl;
  el_img.alt = work.title;

  let el_title = document.createElement('p');
  el_title.textContent = work.title;

  let el_item = document.createElement('div');
  el_item.classList.add('work-item');
  el_item.append(el_img);
  el_item.append(el_title);

  divProjects.append(el_item);
}
