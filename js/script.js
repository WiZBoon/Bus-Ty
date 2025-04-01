// Main JavaScript file for the RedBus-like website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current date as default for date input
    const today = new Date();
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = today;
    }

    // Initialize tab functionality on my-trips page
    initTabs();
});

// Search Buses function
function searchBuses() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;
    
    if (!from || !to) {
        alert('Please enter both source and destination');
        return;
    }
    
    // Store search data in session storage to use on search page
    sessionStorage.setItem('searchData', JSON.stringify({
        from,
        to,
        date
    }));
    
    // Redirect to search page
    window.location.href = 'search.html';
}

// Initialize tabs on my-trips page
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                
                // Update active tab button
                tabBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
}

// Modal functions
function showTripMap() {
    const modal = document.getElementById('trip-map-modal');
    modal.style.display = 'block';
    
    // Initialize map in modal
    initTripMap();
}

function closeModal() {
    const modal = document.getElementById('trip-map-modal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('trip-map-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Load search data on search page
window.addEventListener('load', function() {
    if (window.location.pathname.includes('search.html')) {
        const searchData = JSON.parse(sessionStorage.getItem('searchData'));
        if (searchData) {
            document.getElementById('from-city').textContent = searchData.from;
            document.getElementById('to-city').textContent = searchData.to;
            
            const dateObj = new Date(searchData.date);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            document.getElementById('travel-date').textContent = 'Date: ' + dateObj.toLocaleDateString('en-IN', options);
        }
    }
});