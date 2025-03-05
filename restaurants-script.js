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
const rapidApiKey = "ee96f3aaa2msh0bab44d15e71c8fp121cd8jsndf24cffef432"
const rapidApiHost = "travel-advisor.p.rapidapi.com"
const googleMapApiHost = "google-map-places.p.rapidapi.com"

// DOM Elements
const searchRestaurantsBtn = document.getElementById("search-restaurants")
const loadingSection = document.getElementById("loading-section")
const resultsSection = document.getElementById("results-section")
const resultsList = document.getElementById("results-list")
const restaurantDetailsSection = document.getElementById("restaurant-details-section")
const restaurantDetails = document.getElementById("restaurant-details")
const menuItems = document.getElementById("menu-items")
const reviewsList = document.getElementById("reviews-list")
const backToResultsBtn = document.getElementById("back-to-results")
const checkAvailabilityBtn = document.getElementById("check-availability")
const timeSlots = document.getElementById("time-slots")
const timeSlotslist = document.getElementById("time-slots-list")
const bookingSection = document.getElementById("booking-section")
const backToRestaurantBtn = document.getElementById("back-to-restaurant")
const confirmBookingBtn = document.getElementById("confirm-booking")
const confirmationSection = document.getElementById("confirmation-section")
const backToHomeBtn = document.getElementById("back-to-home")
const bookingDetails = document.getElementById("booking-details")
const bookingSummaryDetails = document.getElementById("booking-summary-details")
const confirmationDetails = document.getElementById("confirmation-details")
const bookingReference = document.getElementById("booking-reference")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Set up event listeners
  setupEventListeners()

  // Check local storage for any saved searches
  checkSavedSearches()

  // Set default date and time for search
  setDefaultDateTime()
})

// Set up event listeners
function setupEventListeners() {
  // Search restaurants button
  if (searchRestaurantsBtn) {
    searchRestaurantsBtn.addEventListener("click", handleSearchRestaurants)
  }

  // Back to results button
  if (backToResultsBtn) {
    backToResultsBtn.addEventListener("click", () => {
      restaurantDetailsSection.style.display = "none"
      resultsSection.style.display = "block"
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  // Check availability button
  if (checkAvailabilityBtn) {
    checkAvailabilityBtn.addEventListener("click", handleCheckAvailability)
  }

  // Back to restaurant button
  if (backToRestaurantBtn) {
    backToRestaurantBtn.addEventListener("click", () => {
      bookingSection.style.display = "none"
      restaurantDetailsSection.style.display = "block"
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  // Confirm booking button
  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener("click", handleConfirmBooking)
  }

  // Back to home button
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", () => {
      confirmationSection.style.display = "none"
      window.location.href = "restaurants.html"
    })
  }

  // Mobile menu button
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu)
  }

  // Price range filter
  const priceCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"][value^="$"]')
  priceCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterRestaurants)
  })

  // Rating filter
  const ratingCheckboxes = document.querySelectorAll(
    '.filter-group input[type="checkbox"][value^="1"], .filter-group input[type="checkbox"][value^="2"], .filter-group input[type="checkbox"][value^="3"], .filter-group input[type="checkbox"][value^="4"], .filter-group input[type="checkbox"][value^="5"]',
  )
  ratingCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterRestaurants)
  })

  // Cuisine filter
  const cuisineCheckboxes = document.querySelectorAll('#cuisine-list input[type="checkbox"]')
  cuisineCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterRestaurants)
  })

  // Features filter
  const featureCheckboxes = document.querySelectorAll(
    '.filter-group input[type="checkbox"]:not([value^="$"]):not([value^="1"]):not([value^="2"]):not([value^="3"]):not([value^="4"]):not([value^="5"])',
  )
  featureCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterRestaurants)
  })
}

// Toggle mobile menu
function toggleMobileMenu() {
  const nav = document.querySelector("nav")
  if (nav.style.display === "block") {
    nav.style.display = "none"
  } else {
    nav.style.display = "block"
  }
}

// Set default date and time for search
function setDefaultDateTime() {
  const today = new Date()
  const dateInput = document.getElementById("date")
  const timeInput = document.getElementById("time")

  if (dateInput) {
    const formattedDate = today.toISOString().split("T")[0]
    dateInput.value = formattedDate
    dateInput.min = formattedDate
  }

  if (timeInput) {
    const hours = today.getHours()
    const minutes = today.getMinutes()
    const roundedHours = hours + (minutes >= 30 ? 1 : 0)
    const formattedTime = `${roundedHours.toString().padStart(2, "0")}:00`
    timeInput.value = formattedTime
  }

  // Also set for reservation form
  const reservationDateInput = document.getElementById("reservation-date")
  const reservationTimeInput = document.getElementById("reservation-time")

  if (reservationDateInput) {
    const formattedDate = today.toISOString().split("T")[0]
    reservationDateInput.value = formattedDate
    reservationDateInput.min = formattedDate
  }

  if (reservationTimeInput) {
    const hours = today.getHours()
    const minutes = today.getMinutes()
    const roundedHours = hours + (minutes >= 30 ? 1 : 0)
    const formattedTime = `${roundedHours.toString().padStart(2, "0")}:00`
    reservationTimeInput.value = formattedTime
  }
}

// Check for saved searches in local storage
function checkSavedSearches() {
  const savedSearch = localStorage.getItem("restaurantSearch")
  if (savedSearch) {
    const searchData = JSON.parse(savedSearch)

    // Fill in the search form with saved data
    document.getElementById("location").value = searchData.location || ""
    document.getElementById("date").value = searchData.date || ""
    document.getElementById("time").value = searchData.time || ""
    document.getElementById("party-size").value = searchData.partySize || "2"
  }
}

// Handle search restaurants button click
async function handleSearchRestaurants() {
  // Get form values
  const location = document.getElementById("location").value
  const date = document.getElementById("date").value
  const time = document.getElementById("time").value
  const partySize = document.getElementById("party-size").value

  // Validate form
  if (!location) {
    alert("Please enter a location")
    return
  }

  // Save search to local storage
  const searchData = {
    location,
    date,
    time,
    partySize,
  }
  localStorage.setItem("restaurantSearch", JSON.stringify(searchData))

  // Show loading section
  document.querySelector(".search-section").style.display = "none"
  loadingSection.style.display = "block"

  try {
    // Fetch restaurants
    const restaurants = await searchRestaurants(location)

    // Display results
    displayRestaurantResults(restaurants)

    // Hide loading, show results
    loadingSection.style.display = "none"
    resultsSection.style.display = "block"
  } catch (error) {
    console.error("Error searching restaurants:", error)
    alert("An error occurred while searching for restaurants. Please try again.")

    // Hide loading, show search again
    loadingSection.style.display = "none"
    document.querySelector(".search-section").style.display = "block"
  }
}

// Search restaurants using Travel Advisor API
async function searchRestaurants(location) {
  // In a real application, we would make an API call to Travel Advisor
  // For this demo, we'll simulate the API response with mock data

  // This would be the actual API call:
  /*
    const url = `https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=12.91285&longitude=100.87808&limit=30&currency=USD&distance=2&open_now=false&lunit=km&lang=en_US`;
    
    const response = await fetch(url, {
        headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': rapidApiHost
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
    }
    
    const data = await response.json();
    return data.data;
    */

  // For demo purposes, return mock data
  return getMockRestaurants(location)
}

// Get mock restaurants for demo
function getMockRestaurants(location) {
  // Generate random restaurants
  const cuisines = [
    "Italian",
    "American",
    "Mexican",
    "Chinese",
    "Japanese",
    "Indian",
    "French",
    "Thai",
    "Mediterranean",
    "Steakhouse",
  ]
  const features = [
    "Outdoor Seating",
    "Delivery",
    "Takeout",
    "Reservations",
    "Wheelchair Accessible",
    "Parking",
    "Free WiFi",
  ]
  const priceRanges = ["$", "$$", "$$$", "$$$$"]
  const restaurants = []

  for (let i = 0; i < 15; i++) {
    // Random cuisine
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)]

    // Random features (2-4 features)
    const numFeatures = Math.floor(Math.random() * 3) + 2
    const restaurantFeatures = []
    for (let j = 0; j < numFeatures; j++) {
      const feature = features[Math.floor(Math.random() * features.length)]
      if (!restaurantFeatures.includes(feature)) {
        restaurantFeatures.push(feature)
      }
    }

    // Random price range
    const priceRange = priceRanges[Math.floor(Math.random() * priceRanges.length)]

    // Random rating (3.0-5.0)
    const rating = (Math.random() * 2 + 3).toFixed(1)

    // Random number of reviews (50-500)
    const reviewCount = Math.floor(Math.random() * 450) + 50

    // Create restaurant
    restaurants.push({
      id: `restaurant-${i}`,
      name: getRestaurantName(cuisine),
      cuisine: cuisine,
      location: location,
      address: `${Math.floor(Math.random() * 999) + 1} Main St, ${location}`,
      features: restaurantFeatures,
      price_level: priceRange,
      rating: Number.parseFloat(rating),
      review_count: reviewCount,
      image: `https://source.unsplash.com/random/400x300/?restaurant,${cuisine.toLowerCase()}`,
    })
  }


  
  // Sort by rating
  restaurants.sort((a, b) => b.rating - a.rating)

  return restaurants
}

// Get a random restaurant name based on cuisine
function getRestaurantName(cuisine) {
  const italianNames = ["Bella Italia", "Trattoria Roma", "La Dolce Vita", "Pasta Paradise", "Mamma Mia"]
  const americanNames = ["The Grill House", "American Diner", "Burger Joint", "Stars & Stripes", "Liberty Kitchen"]
  const mexicanNames = ["El Mariachi", "Taco Fiesta", "Casa Mexico", "Cantina", "Amigos"]
  const chineseNames = ["Golden Dragon", "Peking Palace", "Wok & Roll", "Bamboo Garden", "Dynasty"]
  const japaneseNames = ["Sakura", "Tokyo Sushi", "Fuji", "Samurai", "Zen Garden"]
  const indianNames = ["Taj Mahal", "Spice Route", "Curry House", "Bombay Palace", "Delhi Darbar"]
  const frenchNames = ["Le Bistro", "Café Paris", "La Maison", "Petit Château", "Bon Appétit"]
  const thaiNames = ["Bangkok Kitchen", "Thai Orchid", "Siam Palace", "Lemongrass", "Pad Thai"]
  const mediterraneanNames = ["Olive Garden", "Blue Mediterranean", "Santorini", "Aegean", "Mykonos"]
  const steakhouseNames = ["Prime Cut", "The Steakhouse", "Meat & Greet", "Grill Master", "Beef & Bourbon"]

  let names
  switch (cuisine) {
    case "Italian":
      names = italianNames
      break
    case "American":
      names = americanNames
      break
    case "Mexican":
      names = mexicanNames
      break
    case "Chinese":
      names = chineseNames
      break
    case "Japanese":
      names = japaneseNames
      break
    case "Indian":
      names = indianNames
      break
    case "French":
      names = frenchNames
      break
    case "Thai":
      names = thaiNames
      break
    case "Mediterranean":
      names = mediterraneanNames
      break
    case "Steakhouse":
      names = steakhouseNames
      break
    default:
      names = [
        ...italianNames,
        ...americanNames,
        ...mexicanNames,
        ...chineseNames,
        ...japaneseNames,
        ...indianNames,
        ...frenchNames,
        ...thaiNames,
        ...mediterraneanNames,
        ...steakhouseNames,
      ]
  }

  return names[Math.floor(Math.random() * names.length)]
}

// Display restaurant results
function displayRestaurantResults(restaurants) {
  // Clear previous results
  resultsList.innerHTML = ""

  // Display each restaurant
  restaurants.forEach((restaurant) => {
    const restaurantCard = createRestaurantCard(restaurant)
    resultsList.appendChild(restaurantCard)
  })
}

// Filter restaurants based on selected filters
function filterRestaurants() {
  // Get selected price ranges
  const selectedPrices = Array.from(
    document.querySelectorAll('.filter-group input[type="checkbox"][value^="$"]:checked'),
  ).map((checkbox) => checkbox.value)

  // Get selected ratings
  const selectedRatings = Array.from(
    document.querySelectorAll(
      '.filter-group input[type="checkbox"][value^="1"], .filter-group input[type="checkbox"][value^="2"], .filter-group input[type="checkbox"][value^="3"], .filter-group input[type="checkbox"][value^="4"], .filter-group input[type="checkbox"][value^="5"]:checked',
    ),
  ).map((checkbox) => Number.parseInt(checkbox.value))

  // Get selected cuisines
  const selectedCuisines = Array.from(document.querySelectorAll('#cuisine-list input[type="checkbox"]:checked')).map(
    (checkbox) => checkbox.value,
  )

  // Get selected features
  const selectedFeatures = Array.from(
    document.querySelectorAll(
      '.filter-group input[type="checkbox"]:not([value^="$"]):not([value^="1"]):not([value^="2"]):not([value^="3"]):not([value^="4"]):not([value^="5"]):checked',
    ),
  ).map((checkbox) => checkbox.value)

  // Get all restaurant cards
  const restaurantCards = resultsList.querySelectorAll(".restaurant-card")

  // Filter restaurant cards
  restaurantCards.forEach((card) => {
    const price = card.dataset.price
    const rating = Number.parseFloat(card.dataset.rating)
    const cuisine = card.dataset.cuisine.toLowerCase()
    const features = card.dataset.features.toLowerCase().split(",")

    // Check if restaurant matches all selected filters
    const priceMatch = selectedPrices.length === 0 || selectedPrices.includes(price)
    const ratingMatch = selectedRatings.length === 0 || selectedRatings.some((r) => rating >= r)
    const cuisineMatch = selectedCuisines.length === 0 || selectedCuisines.some((c) => cuisine.includes(c))
    const featuresMatch = selectedFeatures.length === 0 || selectedFeatures.every((f) => features.includes(f))

    if (priceMatch && ratingMatch && cuisineMatch && featuresMatch) {
      card.style.display = "flex"
    } else {
      card.style.display = "none"
    }
  })
}

// Create a restaurant card element
function createRestaurantCard(restaurant) {
  const card = document.createElement("div")
  card.className = "restaurant-card"
  card.dataset.price = restaurant.price_level
  card.dataset.rating = restaurant.rating
  card.dataset.cuisine = restaurant.cuisine.toLowerCase()
  card.dataset.features = restaurant.features.map((f) => f.toLowerCase()).join(",")

  // Create stars HTML
  const starsHtml = createStarsHtml(restaurant.rating)

  card.innerHTML = `
        <div class="restaurant-image">
            <img src="${restaurant.image}" alt="${restaurant.name}">
        </div>
        <div class="restaurant-info">
            <div class="restaurant-header">
                <h3 class="restaurant-name">${restaurant.name}</h3>
                <div class="restaurant-price">${restaurant.price_level}</div>
            </div>
            <div class="restaurant-rating">
                <div class="stars">${starsHtml}</div>
                <span>${restaurant.rating} (${restaurant.review_count} reviews)</span>
            </div>
            <div class="restaurant-cuisine">${restaurant.cuisine}</div>
            <div class="restaurant-location">
                <i class="fas fa-map-marker-alt"></i> ${restaurant.address}
            </div>
            <div class="restaurant-features">
                ${restaurant.features.map((feature) => `<span class="feature"><i class="fas fa-check"></i> ${feature}</span>`).join("")}
            </div>
            <div class="restaurant-actions">
                <span>${restaurant.features.includes("Reservations") ? "Reservations available" : "Walk-ins welcome"}</span>
                <button class="btn-primary view-restaurant-btn">View Details</button>
            </div>
        </div>
    `

  // Add event listener to view button
  const viewBtn = card.querySelector(".view-restaurant-btn")
  viewBtn.addEventListener("click", () => {
    handleViewRestaurant(restaurant)
  })

  return card
}

// Create HTML for star rating
function createStarsHtml(rating) {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  let starsHtml = ""

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>'
  }

  // Add half star if needed
  if (halfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>'
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>'
  }

  return starsHtml
}

// Handle view restaurant button click
async function handleViewRestaurant(restaurant) {
  // Save selected restaurant to local storage
  localStorage.setItem("selectedRestaurant", JSON.stringify(restaurant))

  // Display restaurant details
  displayRestaurantDetails(restaurant)

  // Hide results, show restaurant details
  resultsSection.style.display = "none"
  restaurantDetailsSection.style.display = "block"
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Display restaurant details
function displayRestaurantDetails(restaurant) {
  // Create stars HTML
  const starsHtml = createStarsHtml(restaurant.rating)

  // Generate mock hours
  const hours = generateMockHours()

  // Generate mock menu items
  const menuItemsData = generateMockMenuItems(restaurant.cuisine)

  // Generate mock reviews
  const reviewsData = generateMockReviews(restaurant.review_count)

  // Display restaurant details
  restaurantDetails.innerHTML = `
        <div class="restaurant-gallery">
            <div class="main-image">
                <img src="${restaurant.image}" alt="${restaurant.name}">
            </div>
            <div class="thumbnail">
                <img src="https://source.unsplash.com/random/300x200/?restaurant,interior" alt="${restaurant.name} Interior">
            </div>
            <div class="thumbnail">
                <img src="https://source.unsplash.com/random/300x200/?${restaurant.cuisine.toLowerCase()},food" alt="${restaurant.cuisine} Food">
            </div>
        </div>
        <div class="restaurant-info-detailed">
            <h2 class="restaurant-name-detailed">${restaurant.name}</h2>
            <div class="restaurant-price-rating">
                <div class="restaurant-price-detailed">${restaurant.price_level}</div>
                <div class="restaurant-rating-detailed">
                    <div class="stars">${starsHtml}</div>
                    <div class="rating-score">${restaurant.rating}</div>
                    <div class="rating-count">${restaurant.review_count} reviews</div>
                </div>
            </div>
            <div class="restaurant-cuisine-detailed">${restaurant.cuisine} Restaurant</div>
            <div class="restaurant-location-detailed">
                <i class="fas fa-map-marker-alt"></i> ${restaurant.address}
            </div>
            <div class="restaurant-hours">
                <h4>Hours of Operation</h4>
                <div class="hours-list">
                    ${Object.entries(hours)
                      .map(
                        ([day, time]) => `
                        <div class="hours-item">
                            <span>${day}</span>
                            <span>${time}</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
            <div class="restaurant-description">
                <p>Welcome to ${restaurant.name}, a ${restaurant.cuisine.toLowerCase()} restaurant located in the heart of ${restaurant.location}. We offer a wide variety of authentic ${restaurant.cuisine.toLowerCase()} dishes prepared with the freshest ingredients. Our chefs are dedicated to providing you with an exceptional dining experience.</p>
            </div>
            <div class="restaurant-features-detailed">
                <h4>Features & Amenities</h4>
                <div class="features-list">
                    ${restaurant.features
                      .map(
                        (feature) => `
                        <div class="feature-item">
                            <i class="fas fa-check"></i>
                            <span>${feature}</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
            <div class="restaurant-map">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007%2C%20USA!5e0!3m2!1sen!2sus!4v1579793148066!5m2!1sen!2sus" allowfullscreen=""></iframe>
            </div>
        </div>
    `

  // Display menu items
  menuItems.innerHTML = ""
  menuItemsData.forEach((item) => {
    const menuItem = document.createElement("div")
    menuItem.className = "menu-item"
    menuItem.innerHTML = `
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="menu-item-info">
                <h4 class="menu-item-name">${item.name}</h4>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-price">${item.price}</div>
            </div>
        `
    menuItems.appendChild(menuItem)
  })

  // Display reviews
  reviewsList.innerHTML = ""
  reviewsData.forEach((review) => {
    const reviewElement = document.createElement("div")
    reviewElement.className = "review"
    reviewElement.innerHTML = `
            <div class="review-header">
                <div class="reviewer">
                    <div class="reviewer-avatar">
                        <img src="${review.avatar}" alt="${review.name}">
                    </div>
                    <div class="reviewer-name">${review.name}</div>
                </div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-rating">
                ${createStarsHtml(review.rating)}
            </div>
            <div class="review-text">
                <p>${review.text}</p>
            </div>
        `
    reviewsList.appendChild(reviewElement)
  })

  // Set reservation form values
  const reservationDate = document.getElementById("reservation-date")
  const reservationTime = document.getElementById("reservation-time")
  const reservationParty = document.getElementById("reservation-party")

  if (reservationDate && reservationTime && reservationParty) {
    const searchDate = document.getElementById("date").value
    const searchTime = document.getElementById("time").value
    const searchPartySize = document.getElementById("party-size").value

    reservationDate.value = searchDate
    reservationTime.value = searchTime
    reservationParty.value = searchPartySize
  }
}

// Generate mock hours for a restaurant
function generateMockHours() {
  return {
    Monday: "11:00 AM - 10:00 PM",
    Tuesday: "11:00 AM - 10:00 PM",
    Wednesday: "11:00 AM - 10:00 PM",
    Thursday: "11:00 AM - 11:00 PM",
    Friday: "11:00 AM - 12:00 AM",
    Saturday: "10:00 AM - 12:00 AM",
    Sunday: "10:00 AM - 9:00 PM",
  }
}

// Generate mock menu items based on cuisine
function generateMockMenuItems(cuisine) {
  const menuItems = []
  const numItems = 6

  // Define menu items based on cuisine
  const cuisineItems = {
    Italian: [
      { name: "Margherita Pizza", description: "Classic pizza with tomato sauce, mozzarella, and basil", price: "$14" },
      { name: "Spaghetti Carbonara", description: "Pasta with eggs, cheese, pancetta, and black pepper", price: "$16" },
      { name: "Lasagna", description: "Layered pasta with meat sauce, ricotta, and mozzarella", price: "$18" },
      { name: "Risotto ai Funghi", description: "Creamy risotto with wild mushrooms and parmesan", price: "$17" },
      { name: "Tiramisu", description: "Classic Italian dessert with coffee, mascarpone, and cocoa", price: "$9" },
      { name: "Caprese Salad", description: "Fresh tomatoes, mozzarella, and basil with balsamic glaze", price: "$12" },
    ],
    American: [
      {
        name: "Classic Burger",
        description: "Beef patty with lettuce, tomato, onion, and special sauce",
        price: "$15",
      },
      { name: "BBQ Ribs", description: "Slow-cooked ribs with house BBQ sauce and coleslaw", price: "$22" },
      { name: "Mac & Cheese", description: "Creamy macaroni with a blend of cheeses and crispy topping", price: "$14" },
      {
        name: "Chicken Wings",
        description: "Crispy wings with choice of buffalo, BBQ, or honey garlic sauce",
        price: "$13",
      },
      { name: "Apple Pie", description: "Homemade pie with cinnamon apples and vanilla ice cream", price: "$8" },
      {
        name: "Caesar Salad",
        description: "Romaine lettuce with parmesan, croutons, and Caesar dressing",
        price: "$11",
      },
    ],
    Mexican: [
      {
        name: "Tacos al Pastor",
        description: "Marinated pork tacos with pineapple, onion, and cilantro",
        price: "$12",
      },
      {
        name: "Enchiladas",
        description: "Corn tortillas filled with chicken, topped with sauce and cheese",
        price: "$15",
      },
      {
        name: "Guacamole & Chips",
        description: "Fresh avocado dip with lime, tomato, and crispy tortilla chips",
        price: "$10",
      },
      { name: "Carne Asada", description: "Grilled steak with rice, beans, and tortillas", price: "$18" },
      { name: "Churros", description: "Fried dough pastry with cinnamon sugar and chocolate sauce", price: "$7" },
      { name: "Quesadilla", description: "Flour tortilla filled with cheese and choice of meat", price: "$13" },
    ],
    Chinese: [
      { name: "Kung Pao Chicken", description: "Spicy stir-fried chicken with peanuts and vegetables", price: "$16" },
      { name: "Dim Sum Platter", description: "Assortment of steamed dumplings and buns", price: "$18" },
      { name: "Beef with Broccoli", description: "Stir-fried beef and broccoli in savory sauce", price: "$17" },
      { name: "Fried Rice", description: "Wok-fried rice with eggs, vegetables, and choice of protein", price: "$14" },
      {
        name: "Spring Rolls",
        description: "Crispy rolls filled with vegetables and served with dipping sauce",
        price: "$8",
      },
      { name: "Mapo Tofu", description: "Spicy tofu dish with minced meat and Sichuan peppercorns", price: "$15" },
    ],
    Japanese: [
      { name: "Sushi Combo", description: "Assortment of nigiri and maki rolls with wasabi and ginger", price: "$24" },
      { name: "Chicken Teriyaki", description: "Grilled chicken with teriyaki sauce and steamed rice", price: "$17" },
      { name: "Ramen", description: "Noodle soup with pork, egg, and vegetables", price: "$16" },
      { name: "Tempura", description: "Lightly battered and fried shrimp and vegetables", price: "$15" },
      { name: "Miso Soup", description: "Traditional Japanese soup with tofu, seaweed, and green onion", price: "$6" },
      { name: "Gyoza", description: "Pan-fried dumplings filled with pork and vegetables", price: "$9" },
    ],
  }

  // Use default items if cuisine not found
  const defaultItems = [
    { name: "Signature Dish", description: "Our chef's special creation with premium ingredients", price: "$22" },
    { name: "House Salad", description: "Fresh greens with house dressing and seasonal toppings", price: "$10" },
    { name: "Soup of the Day", description: "Freshly made soup with local ingredients", price: "$8" },
    { name: "Grilled Fish", description: "Catch of the day with seasonal vegetables and sauce", price: "$24" },
    { name: "Chocolate Dessert", description: "Rich chocolate cake with ice cream and berries", price: "$9" },
    { name: "Cheese Platter", description: "Selection of artisanal cheeses with crackers and fruit", price: "$16" },
  ]

  // Get items for the specified cuisine or use default
  const items = cuisineItems[cuisine] || defaultItems

  // Create menu items with images
  for (let i = 0; i < numItems; i++) {
    const item = items[i]
    menuItems.push({
      name: item.name,
      description: item.description,
      price: item.price,
      image: `https://source.unsplash.com/random/100x100/?${item.name.toLowerCase().replace(/ /g, ",")}`,
    })
  }

  return menuItems
}

// Generate mock reviews
function generateMockReviews(totalReviews) {
  const reviews = []
  const numReviews = Math.min(5, totalReviews)

  const reviewTexts = [
    "Amazing food and great service! The atmosphere was perfect for our anniversary dinner. Will definitely come back again.",
    "The food was delicious and the portions were generous. Service was a bit slow, but the quality made up for it.",
    "Excellent dining experience. The chef's special was outstanding and the staff was very attentive.",
    "Good food but a bit overpriced for what you get. The ambiance is nice though.",
    "One of the best meals I've had in a long time. The flavors were incredible and the presentation was beautiful.",
    "Friendly staff and delicious food. The menu has great variety and everything we tried was excellent.",
    "Decent food but nothing special. The service was good and the place is clean and well-maintained.",
    "Fantastic restaurant! The food was authentic and the staff was knowledgeable about the menu. Highly recommend!",
    "Great place for a casual dinner. The food came out quickly and was tasty. Good value for money.",
    "Wonderful experience from start to finish. The cocktails were creative and the food was exceptional.",
  ]

  const names = [
    "John Smith",
    "Emily Johnson",
    "Michael Brown",
    "Jessica Davis",
    "David Wilson",
    "Sarah Martinez",
    "Robert Taylor",
    "Jennifer Anderson",
    "James Thomas",
    "Lisa Jackson",
  ]

  // Generate random dates within the last year
  function getRandomDate() {
    const today = new Date()
    const pastDate = new Date(today)
    pastDate.setDate(today.getDate() - Math.floor(Math.random() * 365))
    return pastDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  for (let i = 0; i < numReviews; i++) {
    // Random rating (3.0-5.0)
    const rating = (Math.random() * 2 + 3).toFixed(1)

    reviews.push({
      name: names[Math.floor(Math.random() * names.length)],
      avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
      rating: Number.parseFloat(rating),
      date: getRandomDate(),
      text: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
    })
  }

  return reviews
}

// Handle check availability button click
function handleCheckAvailability() {
  // Get form values
  const date = document.getElementById("reservation-date").value
  const time = document.getElementById("reservation-time").value
  const partySize = document.getElementById("reservation-party").value

  // Validate form
  if (!date || !time) {
    alert("Please select a date and time")
    return
  }

  // Generate time slots
  const selectedTime = new Date(`${date}T${time}`)
  const timeSlots = generateTimeSlots(selectedTime)

  // Display time slots
  displayTimeSlots(timeSlots)

  // Show time slots section
  document.getElementById("time-slots").style.display = "block"

  // Scroll to time slots
  document.getElementById("time-slots").scrollIntoView({ behavior: "smooth" })
}

// Generate time slots around the selected time
function generateTimeSlots(selectedTime) {
  const slots = []
  const slotInterval = 30 // minutes

  // Generate 3 slots before and 3 slots after the selected time
  for (let i = -3; i <= 3; i++) {
    const slotTime = new Date(selectedTime)
    slotTime.setMinutes(slotTime.getMinutes() + i * slotInterval)

    // Skip slots before restaurant opening (11am) or after closing (10pm)
    const hours = slotTime.getHours()
    if (hours < 11 || hours >= 22) {
      continue
    }

    slots.push({
      time: slotTime,
      available: Math.random() > 0.3, // 70% chance of being available
    })
  }

  return slots
}

// Display time slots
function displayTimeSlots(slots) {
  timeSlotslist.innerHTML = ""

  slots.forEach((slot) => {
    const timeSlot = document.createElement("div")
    timeSlot.className = `time-slot ${slot.available ? "" : "unavailable"}`
    if (!slot.available) {
      timeSlot.classList.add("unavailable")
      timeSlot.style.opacity = "0.5"
      timeSlot.style.cursor = "not-allowed"
    }

    const formattedTime = slot.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    timeSlot.textContent = formattedTime

    if (slot.available) {
      timeSlot.addEventListener("click", () => {
        // Remove selected class from all slots
        document.querySelectorAll(".time-slot").forEach((slot) => {
          slot.classList.remove("selected")
        })

        // Add selected class to clicked slot
        timeSlot.classList.add("selected")

        // Update reservation time input
        document.getElementById("reservation-time").value = slot.time.toTimeString().slice(0, 5)

        // Save selected time to local storage
        localStorage.setItem("selectedTime", slot.time.toISOString())
      })
    }

    timeSlotslist.appendChild(timeSlot)
  })

  // Add a "Book Now" button
  const bookNowBtn = document.createElement("button")
  bookNowBtn.className = "btn-primary"
  bookNowBtn.style.marginTop = "20px"
  bookNowBtn.style.width = "100%"
  bookNowBtn.textContent = "Book Selected Time"
  bookNowBtn.addEventListener("click", () => {
    const selectedSlot = document.querySelector(".time-slot.selected")
    if (!selectedSlot) {
      alert("Please select a time slot")
      return
    }

    handleBookReservation()
  })

  timeSlotslist.appendChild(bookNowBtn)
}

// Handle book reservation button click
function handleBookReservation() {
  // Get selected restaurant from local storage
  const restaurant = JSON.parse(localStorage.getItem("selectedRestaurant"))

  // Get reservation details
  const date = document.getElementById("reservation-date").value
  const time = document.getElementById("reservation-time").value
  const partySize = document.getElementById("reservation-party").value
  const occasion = document.getElementById("reservation-occasion").value
  const specialRequests = document.getElementById("special-requests").value

  // Save reservation details to local storage
  const reservationDetails = {
    restaurant,
    date,
    time,
    partySize,
    occasion,
    specialRequests,
  }
  localStorage.setItem("reservationDetails", JSON.stringify(reservationDetails))

  // Display booking details
  displayBookingDetails(reservationDetails)

  // Hide restaurant details, show booking
  restaurantDetailsSection.style.display = "none"
  bookingSection.style.display = "block"
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Display booking details
function displayBookingDetails(reservationDetails) {
  const { restaurant, date, time, partySize, occasion } = reservationDetails

  // Format date
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Format time
  const formattedTime = new Date(`${date}T${time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  // Display booking details
  bookingDetails.innerHTML = `
        <div class="selected-restaurant">
            <div class="selected-restaurant-image">
                <img src="${restaurant.image}" alt="${restaurant.name}">
            </div>
            <div class="selected-restaurant-info">
                <h3>${restaurant.name}</h3>
                <div class="restaurant-cuisine-detailed">${restaurant.cuisine} Restaurant</div>
                <div class="restaurant-location-detailed">
                    <i class="fas fa-map-marker-alt"></i> ${restaurant.address}
                </div>
                <div class="restaurant-price-detailed">${restaurant.price_level}</div>
            </div>
        </div>
        <div class="reservation-details">
            <div class="reservation-date-time">
                <div class="detail-label">Date & Time</div>
                <div>${formattedDate} at ${formattedTime}</div>
            </div>
            <div class="reservation-party">
                <div class="detail-label">Party Size</div>
                <div>${partySize} ${Number.parseInt(partySize) === 1 ? "Person" : "People"}</div>
            </div>
            ${
              occasion
                ? `
                <div class="reservation-occasion">
                    <div class="detail-label">Occasion</div>
                    <div>${occasion}</div>
                </div>
            `
                : ""
            }
        </div>
    `

  // Display booking summary
  bookingSummaryDetails.innerHTML = `
        <div class="booking-summary-item">
            <span>Restaurant</span>
            <span>${restaurant.name}</span>
        </div>
        <div class="booking-summary-item">
            <span>Date</span>
            <span>${formattedDate}</span>
        </div>
        <div class="booking-summary-item">
            <span>Time</span>
            <span>${formattedTime}</span>
        </div>
        <div class="booking-summary-item">
            <span>Party Size</span>
            <span>${partySize} ${Number.parseInt(partySize) === 1 ? "Person" : "People"}</span>
        </div>
        ${
          occasion
            ? `
            <div class="booking-summary-item">
                <span>Occasion</span>
                <span>${occasion}</span>
            </div>
        `
            : ""
        }
    `
}

// Handle confirm booking button click
function handleConfirmBooking() {
  // Get form values
  const firstName = document.getElementById("first-name").value
  const lastName = document.getElementById("last-name").value
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value

  // Validate form
  if (!firstName || !lastName || !email || !phone) {
    alert("Please fill in all required guest information fields")
    return
  }

  // Get payment form values
  const cardName = document.getElementById("card-name").value
  const cardNumber = document.getElementById("card-number").value
  const expiryDate = document.getElementById("expiry-date").value
  const cvv = document.getElementById("cvv").value

  // Validate payment form
  if (!cardName || !cardNumber || !expiryDate || !cvv) {
    alert("Please fill in all required payment information fields")
    return
  }

  // Check terms checkbox
  const termsCheckbox = document.getElementById("terms-checkbox")
  if (!termsCheckbox.checked) {
    alert("Please agree to the cancellation policy and terms of service")
    return
  }

  // Generate a random booking reference
  const reference = generateBookingReference()
  bookingReference.textContent = reference

  // Save booking to local storage
  const reservationDetails = JSON.parse(localStorage.getItem("reservationDetails"))

  const bookingData = {
    reference,
    restaurant: reservationDetails.restaurant,
    date: reservationDetails.date,
    time: reservationDetails.time,
    partySize: reservationDetails.partySize,
    occasion: reservationDetails.occasion,
    specialRequests: reservationDetails.specialRequests,
    guest: {
      firstName,
      lastName,
      email,
      phone,
    },
    payment: {
      cardName,
      cardNumber: maskCardNumber(cardNumber),
      expiryDate,
    },
    bookingDate: new Date().toISOString(),
  }

  // Save to local storage
  const bookings = JSON.parse(localStorage.getItem("restaurantBookings")) || []
  bookings.push(bookingData)
  localStorage.setItem("restaurantBookings", JSON.stringify(bookings))

  // Display confirmation details
  displayConfirmationDetails(bookingData)

  // Show confirmation section
  bookingSection.style.display = "none"
  confirmationSection.style.display = "block"
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Display confirmation details
function displayConfirmationDetails(bookingData) {
  const { restaurant, date, time, partySize, guest } = bookingData

  // Format date
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Format time
  const formattedTime = new Date(`${date}T${time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  // Display confirmation details
  confirmationDetails.innerHTML = `
        <div class="confirmation-details-item">
            <span>Restaurant</span>
            <span>${restaurant.name}</span>
        </div>
        <div class="confirmation-details-item">
            <span>Address</span>
            <span>${restaurant.address}</span>
        </div>
        <div class="confirmation-details-item">
            <span>Date</span>
            <span>${formattedDate}</span>
        </div>
        <div class="confirmation-details-item">
            <span>Time</span>
            <span>${formattedTime}</span>
        </div>
        <div class="confirmation-details-item">
            <span>Party Size</span>
            <span>${partySize} ${Number.parseInt(partySize) === 1 ? "Person" : "People"}</span>
        </div>
        <div class="confirmation-details-item">
            <span>Guest Name</span>
            <span>${guest.firstName} ${guest.lastName}</span>
        </div>
        <div class="confirmation-details-item">
            <span>Email</span>
            <span>${guest.email}</span>
        </div>
    `
}

// Generate a random booking reference
function generateBookingReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let reference = ""
  for (let i = 0; i < 6; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return reference
}

// Mask card number for security
function maskCardNumber(cardNumber) {
  // Remove spaces and non-numeric characters
  const cleaned = cardNumber.replace(/\D/g, "")
  // Keep only the last 4 digits
  return "XXXX-XXXX-XXXX-" + cleaned.slice(-4)
}

