// Map functionality for the RedBus-like website

// Initialize map on search page
function initMap() {
    // Check if we're on the search page and map element exists
    if (!document.getElementById('map')) return;
    
    // Create map centered on India
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Get search data
    const searchData = JSON.parse(sessionStorage.getItem('searchData'));
    if (!searchData) return;
    
    // Sample coordinates for demonstration
    // In a real app, you would geocode the locations or have predefined coordinates
    let fromCoords, toCoords;
    
    // Set coordinates based on common routes (simplified for demo)
    if (searchData.from.toLowerCase().includes('mumbai') && searchData.to.toLowerCase().includes('pune')) {
        fromCoords = [19.0760, 72.8777]; // Mumbai
        toCoords = [18.5204, 73.8567];    // Pune
    } else if (searchData.from.toLowerCase().includes('delhi') && searchData.to.toLowerCase().includes('jaipur')) {
        fromCoords = [28.7041, 77.1025];  // Delhi
        toCoords = [26.9124, 75.7873];    // Jaipur
    } else {
        // Default to Mumbai to Pune if no specific route
        fromCoords = [19.0760, 72.8777];
        toCoords = [18.5204, 73.8567];
    }
    
    // Add markers
    const fromMarker = L.marker(fromCoords).addTo(map)
        .bindPopup(`<h3>${searchData.from}</h3><p>Departure point</p>`)
        .openPopup();
    
    const toMarker = L.marker(toCoords).addTo(map)
        .bindPopup(`<h3>${searchData.to}</h3><p>Arrival point</p>`);
    
    // Add a line between the points
    const route = L.polyline([fromCoords, toCoords], {color: '#d84e55'}).addTo(map);
    
    // Fit map to show both locations
    map.fitBounds([fromCoords, toCoords]);
}

// Initialize map in trip modal
function initTripMap() {
    // Check if trip map element exists
    if (!document.getElementById('trip-map')) return;
    
    // Create map centered on India
    const map = L.map('trip-map').setView([20.5937, 78.9629], 5);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Sample coordinates for Mumbai to Pune trip
    const mumbai = [19.0760, 72.8777];
    const pune = [18.5204, 73.8567];
    
    // Custom icons
    const startIcon = L.divIcon({
        className: 'route-marker route-marker-start',
        iconSize: [12, 12]
    });
    
    const endIcon = L.divIcon({
        className: 'route-marker route-marker-end',
        iconSize: [12, 12]
    });
    
    // Add markers with custom icons
    L.marker(mumbai, {icon: startIcon}).addTo(map)
        .bindPopup('<h3>Mumbai</h3><p>Departure: 22:30</p>')
        .openPopup();
    
    L.marker(pune, {icon: endIcon}).addTo(map)
        .bindPopup('<h3>Pune</h3><p>Arrival: 02:00</p>');
    
    // Add a line between the points
    L.polyline([mumbai, pune], {color: '#d84e55'}).addTo(map);
    
    // Fit map to show both locations
    map.fitBounds([mumbai, pune]);
    
    // Add intermediate points for a more realistic route
    const routePoints = [
        mumbai,
        [19.2183, 72.9781], // Thane
        [19.3919, 73.2627], // Kalyan
        [19.1676, 73.3423], // Lonavala
        [18.7467, 73.4087], // Khandala
        pune
    ];
    
    // Add the detailed route
    L.polyline(routePoints, {color: '#d84e55', weight: 3}).addTo(map);
    
    // Add markers for intermediate points
    routePoints.forEach((point, index) => {
        if (index > 0 && index < routePoints.length - 1) {
            L.circleMarker(point, {
                radius: 5,
                fillColor: '#d84e55',
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);
        }
    });
}

// Initialize maps when page loads
window.addEventListener('load', function() {
    initMap();
});