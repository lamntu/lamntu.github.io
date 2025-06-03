// Global variables
let allNews = []
let allPublications = [];
let showingSelected = true;
let btnAudio;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Load publications and news data
  loadPublications();
  loadNews()

  // Initialize animation delays for sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
  
  // // Add event listener for toggle button
  // const toggleButton = document.getElementById('toggle-publications');
  // if (toggleButton) {
  //   toggleButton.addEventListener('click', togglePublications);
  // }

  btnAudio = document.getElementById("name-pronunciation"); 
});

function playAudio() { 
  btnAudio.play(); 
} 

// Load publications from JSON file
function loadPublications() {
  fetch('publications.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Publications loaded successfully:", data);
      allPublications = data.publications;
      renderPublications(true);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      // Create fallback publications display if JSON loading fails
      displayFallbackPublications();
    });
}

// Load news from JSON file
function loadNews() {
  fetch('news.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("News loaded successfully:", data);
      allNews = data;
      renderNews(true);
    })
    .catch(error => {
      console.error('Error loading news:', error);
      // Create fallback news display if JSON loading fails
      const container = document.getElementById('news-container');
      container.innerHTML = `Error loading news.`;
    });
}

// Fallback if JSON loading fails
function displayFallbackPublications() {
  const container = document.getElementById('publications-container');
  container.innerHTML = `Error loading publications.`;
}

// Toggle between showing all or selected publications
function togglePublications() {
  showingSelected = !showingSelected;
  renderPublications(showingSelected);
  
  // Update button text
  const toggleButton = document.getElementById('toggle-publications');
  toggleButton.textContent = showingSelected ? 'Show All' : 'Show Selected';
  const toggleHeader = document.getElementById('toggle-header');
  toggleHeader.textContent = showingSelected ? 'Selected Publications' : 'All Publications';
}

// Render publications based on selection state
function renderPublications(selectedOnly) {
  const publicationsContainer = document.getElementById('publications-container');
  publicationsContainer.innerHTML = '';
  
  const pubsToShow = selectedOnly ? 
    allPublications.filter(pub => pub.selected === 1) : 
    allPublications;
  
  pubsToShow.forEach(publication => {
    const pubElement = createPublicationElement(publication);
    publicationsContainer.appendChild(pubElement);
  });
}

// Render all news
function renderNews() {
  const newsContainer = document.getElementById('news-list');
  // while (newsContainer.firstChild) { 
  //   newsContainer.firstChild.remove(); 
  // }
  newsContainer.innerHTML = '';
  
  allNews.forEach(news => {
    const newElement = document.createElement('li');
    newElement.className = "award-item"
    
    const timeElement = document.createElement('span');
    timeElement.className = 'award-year';
    timeElement.innerHTML = news.time
    newElement.appendChild(timeElement);

    const descElement = document.createElement('div');
    descElement.className = 'award-desc';
    descElement.innerHTML = news.text
    newElement.appendChild(descElement);

    newsContainer.appendChild(newElement);
  });
}

// Create HTML element for a publication
function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';
  
  // // Create thumbnail
  // const thumbnail = document.createElement('div');
  // thumbnail.className = 'pub-thumbnail';
  // thumbnail.onclick = () => openModal(publication.thumbnail);
  
  // const thumbnailImg = document.createElement('img');
  // thumbnailImg.src = publication.thumbnail;
  // thumbnailImg.alt = `${publication.title} thumbnail`;
  // thumbnail.appendChild(thumbnailImg);
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'pub-content';
  
  // Add title
  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);
  
  // Add authors with highlight
  const authors = document.createElement('div');
  authors.className = 'pub-authors';
  
  // Format authors with highlighting
  let authorsHTML = '';
  publication.authors.forEach((author, index) => {
    if (author.includes('Lam Nguyen Tung')) { // TODO: Highlight specific author
      authorsHTML += `<span class="highlight-name">${author}</span>`;
    } else {
      authorsHTML += author;
    }
    
    if (index < publication.authors.length - 1) {
      authorsHTML += ', ';
    }
  });
  
  authors.innerHTML = authorsHTML;
  content.appendChild(authors);
  
  // Add venue with award if present
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';
  
  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueContainer.appendChild(venue);
  
  content.appendChild(venueContainer);
  
  // Add links if they exist
  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';
    
    if (publication.links.pdf) {
      const pdfLink = document.createElement('a');
      pdfLink.href = publication.links.pdf;
      pdfLink.innerHTML = '<i class="fas fa-file-pdf"></i>PDF';
      links.appendChild(pdfLink);
    }
    
    if (publication.links.code) {
      const codeLink = document.createElement('a');
      codeLink.href = publication.links.code;
      codeLink.textContent = '[Code]';
      links.appendChild(codeLink);
    }
    
    if (publication.links.project) {
      const projectLink = document.createElement('a');
      projectLink.href = publication.links.project;
      projectLink.textContent = '[Project Page]';
      links.appendChild(projectLink);
    }

    // Add award if it exists
    if (publication.award && publication.award.length > 0) {
      const award = document.createElement('div');
      award.className = 'pub-award';
      award.textContent = publication.award;
      links.appendChild(award);
    }
    
    content.appendChild(links);
  }
  
  // Assemble the publication item
  // pubItem.appendChild(thumbnail);
  pubItem.appendChild(content);
  
  return pubItem;
}

// Modal functionality for viewing original images
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    closeModal();
  }
}
