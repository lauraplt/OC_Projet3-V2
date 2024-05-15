const divFilters = document.getElementById("filters");
const divProjects = document.getElementById("gallery");

// Request from API
try {
    fetch("http://localhost:5678/api/works")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erreur de la requête HTTP");
            }
            return response.json();
        })
        .then(works => {
            // Generate filters
            const portfolioSection = new Set();
            works.forEach(project => {
                portfolioSection.add(project.category.name);
            });

            const tableProjects = Array.from(portfolioSection);
            let filterHTML = '<button id="Tous" class="button-filter">Tous</button>';
            tableProjects.forEach(filter => {
                filterHTML += `<button id="${filter}" class="button-filter">${filter}</button>`;
            });

            divFilters.innerHTML = filterHTML;

            // Add event listeners for filters
            document.querySelectorAll('.button-filter').forEach(button => {
                button.addEventListener('click', () => {
                    displayWorks(works, button.id);
                });
            });

            // Display all works initially
            displayWorks(works, 'Tous');
        })
        .catch(error => {
            console.error("Erreur:", error);
        });
} catch (error) {
    console.error("Erreur globale:", error);
}

// Function to display works based on filter
function displayWorks(works, filter) {
    divProjects.innerHTML = ''; // Clear existing images

    const filteredWorks = filter === 'Tous' ? works : works.filter(work => work.category.name === filter);

    filteredWorks.forEach(work => {
        const workHTML = `
            <div class="work-item">
                <img src="${work.imageUrl}" alt="${work.title}">
                <p>${work.title}</p>
            </div>
        `;
        divProjects.innerHTML += workHTML;
    });
}
