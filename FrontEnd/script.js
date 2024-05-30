"use strict";

// Const
const node_filters = document.getElementById('filters');
const node_gallery = document.getElementById('gallery');

// Variables
const url_works = "http://localhost:5678/api/works";

// Functions

// Call URL
async function httpGet(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

// Create a DOM Element for a work
function createWork(work) {
  let el_img = document.createElement('img');
  el_img.src = work.imageUrl;
  el_img.alt = work.title;

  let el_title = document.createElement('figcaption');
  el_title.textContent = work.title;

  let el_item = document.createElement("figure");
  el_item.classList.add("work-item");
  el_item.append(el_img);
  el_item.append(el_title);

  node_gallery.append(el_item);
}

// Create a DOM Element for a filter
function createFilter(filter, works) {
  let el_filter = document.createElement('button');
  el_filter.textContent = filter.name;
  el_filter.classList.add("filter-item");
  el_filter.dataset.filter = filter.id;

  el_filter.addEventListener('click', () => {
    // Remove active class from all filter buttons
    document.querySelectorAll('.filter-item').forEach(button => button.classList.remove('active'));
    // Add active class to the clicked button
    el_filter.classList.add('active');
    displayFilteredWorks(filter.id, works);
  });

  node_filters.append(el_filter);
}

// Display all works
async function displayWorks() {
  const works = await httpGet(url_works);
  node_gallery.innerHTML = ''; // Clear previous works
  works.forEach(work => createWork(work));
  return works;
}

// Display filtered works
function displayFilteredWorks(filterId, works) {
  let filteredWorks = works;
  if (filterId !== 'all') {
    filteredWorks = works.filter(work => work.category.id === filterId);
  }
  node_gallery.innerHTML = ''; // Clear previous works
  filteredWorks.forEach(work => createWork(work));
}

// Extract unique filters from works
function extractFilters(works) {
  const filtersMap = {};
  works.forEach(work => {
    if (!filtersMap[work.category.id]) {
      filtersMap[work.category.id] = {
        id: work.category.id,
        name: work.category.name
      };
    }
  });
  return Object.values(filtersMap);
}

// Display filters
function displayFilters(filters, works) {
  // Add the "Tous" filter at the beginning
  const allFilter = { id: 'all', name: 'Tous' };
  createFilter(allFilter, works);

  filters.forEach(filter => createFilter(filter, works));

  // Select "Tous" filter by default
  const allFilterButton = document.querySelector('.filter-item[data-filter="all"]');
  allFilterButton.classList.add('active');
  displayFilteredWorks('all', works);
}

// Initialize gallery and filters
async function initialize() {
  const works = await displayWorks();
  const filters = extractFilters(works);
  displayFilters(filters, works);
}

// Call the initialize function to display filters and works
initialize();
