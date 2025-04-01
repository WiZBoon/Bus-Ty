// Booking page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize seat selection
    initSeatSelection();
});

function initSeatSelection() {
    const seatsGrid = document.querySelector('.seats-grid');
    if (!seatsGrid) return;
    
    // Clear any existing seats
    seatsGrid.innerHTML = '';
    
    // Create seats (2+1 layout - 2 seats on left, aisle, 1 seat on right)
    const totalRows = 4; // Changed from 10 to 4 as requested
    const seatsPerRow = 4; // 2 left, aisle, 1 right
    
    for (let row = 0; row < totalRows; row++) {
        const rowLetter = String.fromCharCode(65 + row); // A, B, C, D
        
        // Add extra gap after row 2 (between B and C)
        if (row === 2) {
            const gapRow = document.createElement('div');
            gapRow.className = 'gap-row';
            gapRow.style.gridColumn = '1 / -1';
            gapRow.style.height = '20px'; // Adjust gap size as needed
            seatsGrid.appendChild(gapRow);
        }
        
        for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
            // Skip the aisle (seatNum 3 in each row)
            if (seatNum === 3) {
                seatsGrid.appendChild(document.createElement('div')); // Empty div for aisle
                continue;
            }
            
            const seat = document.createElement('div');
            seat.className = 'seat available';
            seat.textContent = rowLetter + seatNum;
            
            // Randomly mark some seats as booked or ladies
            const random = Math.random();
            if (random < 0.2) {
                seat.classList.remove('available');
                seat.classList.add('booked');
            } else if (random < 0.3 && seatNum !== 2) { // Don't mark single seats as ladies
                seat.classList.remove('available');
                seat.classList.add('ladies');
            }
            
            // Add click event
            seat.addEventListener('click', function() {
                toggleSeatSelection(this);
            });
            
            seatsGrid.appendChild(seat);
        }
    }
}

function toggleSeatSelection(seatElement) {
    // Don't allow selection of booked seats
    if (seatElement.classList.contains('booked')) {
        return;
    }
    
    // Toggle selected state
    if (seatElement.classList.contains('selected')) {
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
    } else {
        // Check if this is a ladies seat and confirm selection
        if (seatElement.classList.contains('ladies')) {
            const confirmSelection = confirm('This is a ladies seat. Are you sure you want to book it?');
            if (!confirmSelection) return;
        }
        
        seatElement.classList.remove('available', 'ladies');
        seatElement.classList.add('selected');
    }
    
    updateSelectedSeatsList();
    updatePrice();
}

function updateSelectedSeatsList() {
    const selectedSeatsList = document.getElementById('selected-seats-list');
    const selectedSeats = document.querySelectorAll('.seat.selected');
    
    selectedSeatsList.innerHTML = '';
    
    if (selectedSeats.length === 0) {
        selectedSeatsList.innerHTML = '<p>No seats selected</p>';
        return;
    }
    
    const list = document.createElement('ul');
    selectedSeats.forEach(seat => {
        const item = document.createElement('li');
        item.textContent = seat.textContent;
        list.appendChild(item);
    });
    
    selectedSeatsList.appendChild(list);
}

function updatePrice() {
    const selectedSeats = document.querySelectorAll('.seat.selected').length;
    const basePrice = selectedSeats * 450;
    const taxes = selectedSeats * 50;
    const total = basePrice + taxes;
    
    // Update price display
    const priceBreakup = document.querySelector('.price-breakup');
    priceBreakup.innerHTML = `
        <p>Base Fare (${selectedSeats} seat${selectedSeats !== 1 ? 's' : ''}): <span>₹${basePrice}</span></p>
        <p>Taxes & Fees: <span>₹${taxes}</span></p>
        <p class="total">Total: <span>₹${total}</span></p>
    `;
}