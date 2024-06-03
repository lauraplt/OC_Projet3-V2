"use strict";

// Constantes
const node_filters = document.querySelector('#filters');
const node_gallery = document.querySelector('#gallery');

const url_works = "http://localhost:5678/api/works";
const url_login = "http://localhost:5678/api/users/login";

const validEmail = "sophie.bluel@test.tld";
const validPassword = "S0phie";


// Check if the DOM elements exist
if (!node_filters || !node_gallery) {
  console.error("Required DOM elements not found!");
}

// Call URL GET
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

// Call URL POST
async function httpPost(url, data, headers) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'HTTP POST error');
    }
    return responseData;
  } catch (e) {
    console.error("HTTP POST error:", e);
    throw e;
  }
}

// DOM element for Works
function createWork(work) {
  let el_img = document.createElement('img');
  el_img.src = work.imageUrl;
  el_img.alt = work.title;

  let el_title = document.createElement('figcaption');
  el_title.textContent = work.title;

  let el_item = document.createElement("figure");
  el_item.classList.add("work-item");
  el_item.appendChild(el_img);
  el_item.appendChild(el_title);

  node_gallery.appendChild(el_item);
}

// DOM element for Filters
function createFilter(filter, works) {
  let el_filter = document.createElement('button');
  el_filter.textContent = filter.name;
  el_filter.classList.add("filter-item");
  el_filter.dataset.filter = filter.id;

  el_filter.addEventListener('click', () => {
    // Remove filters selection
    document.querySelectorAll('.filter-item').forEach(button => button.classList.remove('active'));
    // Add selection for selected button
    el_filter.classList.add('active');
    displayFilteredWorks(filter.id, works);
  });

  node_filters.appendChild(el_filter);
}

// Display Works
async function displayWorks() {
  const works = await httpGet(url_works);
  while (node_gallery.firstChild) {
    node_gallery.removeChild(node_gallery.firstChild); // Clear previous works
  }
  works.forEach(work => createWork(work));
  return works;
}

// Display filtered works
function displayFilteredWorks(filterId, works) {
  let filteredWorks = works;
  if (filterId !== 'all') {
    filteredWorks = works.filter(work => work.category.id === filterId);
  }
  while (node_gallery.firstChild) {
    node_gallery.removeChild(node_gallery.firstChild); // Clear previous works
  }
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
  // Add "All" filter at the beginning
  const allFilter = { id: 'all', name: 'Tous' };
  createFilter(allFilter, works);

  filters.forEach(filter => createFilter(filter, works));

  // Select "All" filter by default
  const allFilterButton = document.querySelector('.filter-item[data-filter="all"]');
  allFilterButton.classList.add('active');
  displayFilteredWorks('all', works);
}

// Initialize gallery and filters
async function initializeGallery() {
  const works = await displayWorks();
  const filters = extractFilters(works);
  displayFilters(filters, works);
}

// LOGIN //

// Connect user
async function loginUser(email, password) {
  const data = { email, password };
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  try {
    const response = await httpPost(url_login, data, headers);
    console.log('Login successful:', response);

    // Save the token in local storage
    localStorage.setItem('token', response.token);

    // Redirect to homepage
    window.location.href = 'index.html'; // Change this URL to your homepage
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed: ' + error.message);
  }
}

// Logout user
function logoutUser() {
  localStorage.removeItem('token');
  window.location.href = 'index.html'; // Redirect to homepage after logout
}

// Initialize login form
function initializeLoginForm() {
  const loginForm = document.querySelector('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = event.target.username.value;
      const password = event.target.password.value;
      await loginUser(email, password);
    });
  }
}

// Initialize logout button
function initializeLogoutButton() {
  const logoutNav = document.querySelector('#logoutNav');
  if (logoutNav) {
    logoutNav.addEventListener('click', (event) => {
      event.preventDefault();
      logoutUser();
    });
  }
}

// Display "Modifier la galerie" button
function displayEditGalleryButton() {
  const gallerySection = document.querySelector('#gallerySection');
  const editButton = document.createElement('button');
  editButton.id = 'editGallery';
  editButton.textContent = 'Modifier';
  editButton.onclick = () => {
    // Logic to modify gallery
    console.log('Modifier');
  };
  gallerySection.appendChild(editButton);
}

// Check login status
function checkLoginStatus() {
  const token = localStorage.getItem('token');
  if (token) {
    document.querySelector('#loginNav').style.display = 'none';
    document.querySelector('#logoutNav').style.display = 'block';
    displayEditGalleryButton();
  } else {
    document.querySelector('#loginNav').style.display = 'block';
    document.querySelector('#logoutNav').style.display = 'none';
  }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  if (node_filters && node_gallery) {
    initializeGallery();
  }
  initializeLoginForm();
  initializeLogoutButton();
  checkLoginStatus();
});