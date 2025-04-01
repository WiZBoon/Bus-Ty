// Initialize map on search page with Google Maps Directions and Geocoding API
async function initMap() {
    if (!document.getElementById('map')) return;
    
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    const searchData = JSON.parse(sessionStorage.getItem('searchData'));
    if (!searchData) return;
    
    const apiKey = 'AIzaSyA1BOycetEsgve33D3ST0aeYTIT-_jyOt0';
    
    async function getCoordinates(location) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length > 0) {
                return [
                    data.results[0].geometry.location.lat,
                    data.results[0].geometry.location.lng
                ];
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        }
        return null;
    }
    
    const fromCoords = await getCoordinates(searchData.from) || [19.0760, 72.8777];
    const toCoords = await getCoordinates(searchData.to) || [18.5204, 73.8567];
    
    // Fetch route from Google Maps Directions API
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${fromCoords[0]},${fromCoords[1]}&destination=${toCoords[0]},${toCoords[1]}&key=${apiKey}`;
    
    try {
        const response = await fetch(directionsUrl);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
            const routeCoords = data.routes[0].legs[0].steps.map(step => [
                step.start_location.lat, step.start_location.lng
            ]);
            
            routeCoords.push([data.routes[0].legs[0].end_location.lat, data.routes[0].legs[0].end_location.lng]);
            L.polyline(routeCoords, { color: '#d84e55', weight: 3 }).addTo(map);
        }
    } catch (error) {
        console.error('Error fetching route:', error);
    }
    
    L.marker(fromCoords).addTo(map).bindPopup(`<h3>${searchData.from}</h3><p>Departure</p>`).openPopup();
    L.marker(toCoords).addTo(map).bindPopup(`<h3>${searchData.to}</h3><p>Arrival</p>`);
    map.fitBounds([fromCoords, toCoords]);
}

window.addEventListener('load', initMap);
