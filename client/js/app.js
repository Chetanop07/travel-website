const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");
fetch('https://travel-website-iota-six.vercel.app/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
});
// Load hotels
async function loadHotels() {
    const search = document.getElementById("search").value;

async function loadHotels() {
    const search = document.getElementById("search").value;

    const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${search}`, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": " 28abea317cmsheabedb8e1367235p1a4444jsncfdfed2ed02", // your key
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
}
// Book hotel
async function bookHotel(id, name) {
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const res = await fetch(`${API}/book`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            hotelId: id,
            hotelName: name,
            date: new Date(),
            guests: 1
        })
    });

    const data = await res.json().catch(() => ({}));

    // ⚠️ IMPORTANT: Save bookingId
    localStorage.setItem("bookingId", data._id || "");

    window.location.href = "payment.html";
}

// Submit review
async function submitReview() {
    const message = document.getElementById("review").value;
    const rating = document.getElementById("rating").value;

    if (!token) {
        alert("Login required");
        return;
    }

    await fetch(`${API}/review`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ message, rating })
    });

    loadReviews();
}

// Load reviews
async function loadReviews() {
    const res = await fetch(`${API}/reviews`);
    const data = await res.json();

    document.getElementById("reviews").innerHTML = data.map(r => `
        <div class="review">
            <p>⭐ ${r.rating}/5</p>
            <p>${r.message}</p>
        </div>
    `).join('');
}

// Initial load
loadHotels();
loadReviews();
function getStars(rating) {
    return "⭐".repeat(rating);
}

async function loadReviews() {
    const res = await fetch(`${API}/reviews`);
    const data = await res.json();

    document.getElementById("reviews").innerHTML = data.map(r => `
        <div class="review">
            <p class="star">${getStars(r.rating)}</p>
            <p>${r.message}</p>
        </div>
    `).join('');
    }
}
// LOAD REVIEWS
async function loadReviews() {
    const res = await fetch(`${API}/reviews`);
    const data = await res.json();

    document.getElementById("reviewsList").innerHTML = data.map(r => `
        <div class="card">
            <h3>${r.name}</h3>
            <p>${"⭐".repeat(r.rating)}</p>
            <p>${r.message}</p>
        </div>
    `).join('');
}

// SUBMIT REVIEW
async function submitReview() {
    const name = document.getElementById("reviewName").value;
    const message = document.getElementById("reviewText").value;
    const rating = document.getElementById("rating").value;

    await fetch(`${API}/review`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ name, message, rating })
    });

    alert("Review submitted!");
    loadReviews();
}

// AUTO LOAD
loadReviews();