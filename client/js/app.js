const API = window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://travel-website-iota-six.vercel.app/api";
// =======================
// API URL & Token
// =======================
const API = "https://travel-website-iota-six.vercel.app/api";
const token = localStorage.getItem("token");

// =======================
// Load hotels
// =======================
async function loadHotels() {
    const search = document.getElementById("search").value || "Delhi";

    try {
        const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${search}`, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": "28abea317cmsheabedb8e1367235p1a4444jsncfdfed2ed02",
                "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
            }
        });

        const data = await res.json();

        document.getElementById("hotels").innerHTML = data.data.map(city => `
            <div class="card">
                <img src="https://source.unsplash.com/300x200/?hotel,${city.city}">
                <h3>${city.city}</h3>
                <p>${city.country}</p>
                <p>₹${Math.floor(Math.random() * 3000 + 1500)}</p>
                <button onclick="bookHotel('${city.city}')">Book</button>
            </div>
        `).join('');

    } catch (err) {
        console.error("Error loading hotels:", err);
        document.getElementById("hotels").innerHTML = "<p>Failed to load hotels.</p>";
    }
}

// =======================
// Book hotel
// =======================
async function bookHotel(name) {
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const bookingData = {
        hotelName: name,
        date: new Date(),
        guests: 1
    };

    try {
        const res = await fetch(`${API}/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(bookingData)
        });

        const data = await res.json();
        localStorage.setItem("bookingId", data._id || "");
        window.location.href = "payment.html";

    } catch (err) {
        console.error("Booking failed:", err);
        alert("Booking failed. Try again.");
    }
}

// =======================
// Submit review
// =======================
async function submitReview() {
    const name = document.getElementById("reviewName").value;
    const message = document.getElementById("reviewText").value;
    const rating = parseInt(document.getElementById("rating").value);

    if (!token) {
        alert("Please login first");
        return;
    }

    try {
        await fetch(`${API}/review`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ name, message, rating })
        });

        alert("Review submitted!");
        loadReviews();

    } catch (err) {
        console.error("Review submission failed:", err);
        alert("Failed to submit review.");
    }
}

// =======================
// Load reviews
// =======================
async function loadReviews() {
    try {
        const res = await fetch(`${API}/reviews`);
        const data = await res.json();

        document.getElementById("reviewsList").innerHTML = data.map(r => `
            <div class="card">
                <h3>${r.name}</h3>
                <p>${"⭐".repeat(r.rating)}</p>
                <p>${r.message}</p>
            </div>
        `).join('');

    } catch (err) {
        console.error("Failed to load reviews:", err);
        document.getElementById("reviewsList").innerHTML = "<p>Failed to load reviews.</p>";
    }
}

// =======================
// Helper: Star rating
// =======================
function getStars(rating) {
    return "⭐".repeat(rating);
}

// =======================
// Initial load
// =======================
loadHotels();
loadReviews();