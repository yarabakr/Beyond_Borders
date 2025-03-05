const menus= document.querySelector('nav ul');
const header= document.querySelector("header");
const menuBtn= document.querySelector(".menu-btn");
const closeBtn= document.querySelector(".close-btn");


menuBtn.addEventListener('click', ()=>{
menus.classList.add("display");
});


closeBtn.addEventListener('click', ()=>{
    menus.classList.remove("display");
    });



   //scroll sticky navbar
   
window.addEventListener('scroll',()=>{
    if(document.documentElement.scrollTop > 20){
     header.classList.add("sticky");   
    }
    else {
        header.classList.remove("sticky");
    }
});   

// Global variables
let accessToken = "O0As0b86Myor1ITBWjjFROowjEJn"; // Flight offer search token
let flightPricingToken = "kchBDAIGE0yJW7IuXimSRIAABuhG"; // Flight offer pricing token
let flightOrderToken = "aUYZ4Q4C3lAQAuNP4YGjHaA6BY8d"; // Flight create orders token

// DOM Elements
const searchFlightsBtn = document.getElementById('search-flights');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');
const resultsList = document.getElementById('results-list');
const bookingSection = document.getElementById('booking-section');
const backToResultsBtn = document.getElementById('back-to-results');
const confirmBookingBtn = document.getElementById('confirm-booking');
const confirmationSection = document.getElementById('confirmation-section');
const backToHomeBtn = document.getElementById('back-to-home');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');
const airlinesList = document.getElementById('airlines-list');
const bookingDetails = document.getElementById('booking-details');
const bookingSummaryDetails = document.getElementById('booking-summary-details');
const totalPrice = document.getElementById('total-price');
const bookingReference = document.getElementById('booking-reference');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    setupEventListeners();
    
    // Set up trip type radio buttons
    setupTripTypeToggle();
    
    // Set up price range slider
    setupPriceRangeSlider();
    
    // Check local storage for any saved searches
    checkSavedSearches();
});

// Set up event listeners
function setupEventListeners() {
    // Search flights button
    if (searchFlightsBtn) {
        searchFlightsBtn.addEventListener('click', handleSearchFlights);
    }
    
    // Back to results button
    if (backToResultsBtn) {
        backToResultsBtn.addEventListener('click', () => {
            bookingSection.style.display = 'none';
            resultsSection.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Confirm booking button
    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', handleConfirmBooking);
    }
    
    // Back to home button
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            confirmationSection.style.display = 'none';
            window.location.href = 'index.html';
        });
    }
    
    // Mobile menu button
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    if (nav.style.display === 'block') {
        nav.style.display = 'none';
    } else {
        nav.style.display = 'block';
    }
}

// Set up trip type toggle
function setupTripTypeToggle() {
    const tripTypeRadios = document.querySelectorAll('input[name="trip-type"]');
    const returnDateGroup = document.querySelector('.return-date');
    
    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'one-way') {
                returnDateGroup.style.display = 'none';
            } else {
                returnDateGroup.style.display = 'block';
            }
        });
    });
}

// Set up price range slider
function setupPriceRangeSlider() {
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = `$${e.target.value}`;
        });
    }
}

// Check for saved searches in local storage
function checkSavedSearches() {
    const savedSearch = localStorage.getItem('flightSearch');
    if (savedSearch) {
        const searchData = JSON.parse(savedSearch);
        
        // Fill in the search form with saved data
        document.getElementById('origin').value = searchData.origin || '';
        document.getElementById('destination').value = searchData.destination || '';
        document.getElementById('departure-date').value = searchData.departureDate || '';
        document.getElementById('return-date').value = searchData.returnDate || '';
        document.getElementById('passengers').value = searchData.passengers || '1';
        document.getElementById('cabin-class').value = searchData.cabinClass || 'economy';
        
        if (searchData.nonStop) {
            document.getElementById('non-stop').checked = true;
        }
    }
}

// Handle search flights button click
async function handleSearchFlights() {
    // Get form values
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;
    const passengers = document.getElementById('passengers').value;
    const cabinClass = document.getElementById('cabin-class').value;
    const nonStop = document.getElementById('non-stop').checked;
    
    // Validate form
    if (!origin || !destination || !departureDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Save search to local storage
    const searchData = {
        origin,
        destination,
        departureDate,
        returnDate,
        passengers,
        cabinClass,
        nonStop
    };
    localStorage.setItem('flightSearch', JSON.stringify(searchData));
    
    // Show loading section
    document.querySelector('.search-section').style.display = 'none';
    loadingSection.style.display = 'block';
    
    try {
        // Fetch flight offers
        const flights = await searchFlightOffers(origin, destination, departureDate, passengers, nonStop);
        
        // Display results
        displayFlightResults(flights);
        
        // Hide loading, show results
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'block';
    } catch (error) {
        console.error('Error searching flights:', error);
        alert('An error occurred while searching for flights. Please try again.');
        
        // Hide loading, show search again
        loadingSection.style.display = 'none';
        document.querySelector('.search-section').style.display = 'block';
    }
}

// Search flight offers using Amadeus API
async function searchFlightOffers(origin, destination, departureDate, adults, nonStop) {
    // In a real application, we would make an API call to Amadeus
    // For this demo, we'll simulate the API response with mock data
    
    // This would be the actual API call:
    /*
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}&nonStop=${nonStop}&max=250`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch flight offers');
    }
    
    const data = await response.json();
    return data.data;
    */
    
    // For demo purposes, return mock data
    return getMockFlightOffers(origin, destination, departureDate, adults, nonStop);
}

// Get mock flight offers for demo
function getMockFlightOffers(origin, destination, departureDate, adults, nonStop) {
    // Create a date object from the departure date
    const depDate = new Date(departureDate);
    
    // Generate random flight offers
    const airlines = ['American Airlines', 'Delta Air Lines', 'United Airlines', 'British Airways', 'Emirates', 'Qatar Airways'];
    const flightOffers = [];
    
    for (let i = 0; i < 10; i++) {
        // Random departure time (between 6am and 10pm)
        const depHour = Math.floor(Math.random() * 16) + 6;
        const depMinute = Math.floor(Math.random() * 60);
        const depTime = new Date(depDate);
        depTime.setHours(depHour, depMinute);
        
        // Random duration (between 2 and 12 hours)
        const durationHours = Math.floor(Math.random() * 10) + 2;
        const durationMinutes = Math.floor(Math.random() * 60);
        
        // Calculate arrival time
        const arrTime = new Date(depTime);
        arrTime.setHours(arrTime.getHours() + durationHours, arrTime.getMinutes() + durationMinutes);
        
        // Random price (between $200 and $1500)
        const price = Math.floor(Math.random() * 1300) + 200;
        
        // Random airline
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        
        // Create flight offer
        flightOffers.push({
            id: `flight-${i}`,
            departureTime: depTime,
            arrivalTime: arrTime,
            duration: {
                hours: durationHours,
                minutes: durationMinutes
            },
            origin: origin,
            destination: destination,
            airline: airline,
            price: price,
            nonStop: nonStop || Math.random() > 0.3 // 70% chance of being non-stop if not specified
        });
    }
    
    // Sort by price
    flightOffers.sort((a, b) => a.price - b.price);
    
    return flightOffers;
}

// Display flight results
function displayFlightResults(flights) {
    // Clear previous results
    resultsList.innerHTML = '';
    
    // Populate airlines filter
    populateAirlinesFilter(flights);
    
    // Display each flight
    flights.forEach(flight => {
        const flightCard = createFlightCard(flight);
        resultsList.appendChild(flightCard);
    });
}

// Populate airlines filter
function populateAirlinesFilter(flights) {
    // Get unique airlines
    const airlines = [...new Set(flights.map(flight => flight.airline))];
    
    // Clear previous airlines
    airlinesList.innerHTML = '';
    
    // Add each airline to the filter
    airlines.forEach(airline => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = airline;
        input.checked = true;
        
        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${airline}`));
        
        airlinesList.appendChild(label);
    });
    
    // Add event listeners to filter checkboxes
    const airlineCheckboxes = airlinesList.querySelectorAll('input[type="checkbox"]');
    airlineCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterFlights);
    });
}

// Filter flights based on selected filters
function filterFlights() {
    // Get selected airlines
    const selectedAirlines = Array.from(airlinesList.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Get max price
    const maxPrice = parseInt(priceRange.value);
    
    // Get all flight cards
    const flightCards = resultsList.querySelectorAll('.flight-card');
    
    // Filter flight cards
    flightCards.forEach(card => {
        const airline = card.dataset.airline;
        const price = parseInt(card.dataset.price);
        
        if (selectedAirlines.includes(airline) && price <= maxPrice) {
            card.style.display = 'grid';
        } else {
            card.style.display = 'none';
        }
    });
}

// Create a flight card element
function createFlightCard(flight) {
    const card = document.createElement('div');
    card.className = 'flight-card';
    card.dataset.airline = flight.airline;
    card.dataset.price = flight.price;
    
    // Format times
    const depTime = formatTime(flight.departureTime);
    const arrTime = formatTime(flight.arrivalTime);
    
    // Format duration
    const duration = `${flight.duration.hours}h ${flight.duration.minutes}m`;
    
    card.innerHTML = `
        <div class="flight-details">
            <div class="flight-route">
                <div>
                    <div class="flight-time">${depTime}</div>
                    <div class="flight-airports">${flight.origin}</div>
                </div>
                <div class="flight-duration">
                    <span>${duration}</span>
                </div>
                <div>
                    <div class="flight-time">${arrTime}</div>
                    <div class="flight-airports">${flight.destination}</div>
                </div>
            </div>
            <div class="flight-airline">
                <img src="https://via.placeholder.com/30" alt="${flight.airline}" class="airline-logo">
                <span>${flight.airline}</span>
                <span>${flight.nonStop ? 'Non-stop' : '1 Stop'}</span>
            </div>
        </div>
        <div class="flight-price">
            <div>
                <div class="price-amount">$${flight.price}</div>
                <div class="price-person">per person</div>
            </div>
            <button class="btn-primary select-flight-btn">Select</button>
        </div>
    `;
    
    // Add event listener to select button
    const selectBtn = card.querySelector('.select-flight-btn');
    selectBtn.addEventListener('click', () => {
        handleSelectFlight(flight);
    });
    
    return card;
}

// Format time for display
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Handle select flight button click
function handleSelectFlight(flight) {
    // Save selected flight to local storage
    localStorage.setItem('selectedFlight', JSON.stringify(flight));
    
    // Display booking details
    displayBookingDetails(flight);
    
    // Hide results, show booking
    resultsSection.style.display = 'none';
    bookingSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Display booking details
function displayBookingDetails(flight) {
    // Format times
    const depTime = formatTime(new Date(flight.departureTime));
    const arrTime = formatTime(new Date(flight.arrivalTime));
    
    // Format duration
    const duration = `${flight.duration.hours}h ${flight.duration.minutes}m`;
    
    // Format date
    const depDate = new Date(flight.departureTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    
    // Display selected flight details
    bookingDetails.innerHTML = `
        <div class="selected-flight">
            <div class="flight-info">
                <h3>Selected Flight</h3>
                <div class="flight-route">
                    <div>
                        <div class="flight-time">${depTime}</div>
                        <div class="flight-airports">${flight.origin}</div>
                    </div>
                    <div class="flight-duration">
                        <span>${duration}</span>
                    </div>
                    <div>
                        <div class="flight-time">${arrTime}</div>
                        <div class="flight-airports">${flight.destination}</div>
                    </div>
                </div>
                <div class="flight-date">
                    <i class="far fa-calendar-alt"></i> ${depDate}
                </div>
                <div class="flight-airline">
                    <img src="https://via.placeholder.com/30" alt="${flight.airline}" class="airline-logo">
                    <span>${flight.airline}</span>
                    <span>${flight.nonStop ? 'Non-stop' : '1 Stop'}</span>
                </div>
            </div>
            <div class="flight-price">
                <div class="price-amount">$${flight.price}</div>
                <div class="price-person">per person</div>
            </div>
        </div>
        <div class="booking-policies">
            <h4>Booking Policies</h4>
            <p><i class="fas fa-check-circle"></i> Free cancellation within 24 hours</p>
            <p><i class="fas fa-check-circle"></i> Change fees may apply</p>
            <p><i class="fas fa-check-circle"></i> Baggage fees not included</p>
        </div>
    `;
    
    // Display booking summary
    const passengers = parseInt(document.getElementById('passengers').value) || 1;
    const basePrice = flight.price * passengers;
    const taxes = Math.round(basePrice * 0.12); // 12% taxes
    const total = basePrice + taxes;
    
    bookingSummaryDetails.innerHTML = `
        <div class="booking-summary-item">
            <span>Flight (${passengers} passenger${passengers > 1 ? 's' : ''})</span>
            <span>$${basePrice}</span>
        </div>
        <div class="booking-summary-item">
            <span>Taxes & Fees</span>
            <span>$${taxes}</span>
        </div>
    `;
    
    totalPrice.textContent = `$${total}`;
    
    // Save booking summary to local storage
    localStorage.setItem('bookingSummary', JSON.stringify({
        basePrice,
        taxes,
        total,
        passengers
    }));
}

// Handle confirm booking button click
function handleConfirmBooking() {
    // Get form values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Validate form
    if (!firstName || !lastName || !email || !phone) {
        alert('Please fill in all required passenger information fields');
        return;
    }
    
    // Get payment form values
    const cardName = document.getElementById('card-name').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    
    // Validate payment form
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all required payment information fields');
        return;
    }
    
    // In a real application, we would make an API call to process the payment and create the booking
    // For this demo, we'll simulate the API response
    
    // Generate a random booking reference
    const reference = generateBookingReference();
    bookingReference.textContent = reference;
    
    // Save booking to local storage
    const selectedFlight = JSON.parse(localStorage.getItem('selectedFlight'));
    const bookingSummary = JSON.parse(localStorage.getItem('bookingSummary'));
    
    const bookingData = {
        reference,
        flight: selectedFlight,
        passenger: {
            firstName,
            lastName,
            email,
            phone
        },
        payment: {
            cardName,
            cardNumber: maskCardNumber(cardNumber),
            expiryDate
        },
        summary: bookingSummary,
        bookingDate: new Date().toISOString()
    };
    
    // Save to local storage
    const bookings = JSON.parse(localStorage.getItem('flightBookings')) || [];
    bookings.push(bookingData);
    localStorage.setItem('flightBookings', JSON.stringify(bookings));
    
    // Show confirmation section
    bookingSection.style.display = 'none';
    confirmationSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Generate a random booking reference
function generateBookingReference() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = '';
    for (let i = 0; i < 6; i++) {
        reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
}

// Mask card number for security
function maskCardNumber(cardNumber) {
    // Remove spaces and non-numeric characters
    const cleaned = cardNumber.replace(/\D/g, '');
    // Keep only the last 4 digits
    return 'XXXX-XXXX-XXXX-' + cleaned.slice(-4);
}
