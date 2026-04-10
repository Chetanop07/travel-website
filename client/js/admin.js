const API = window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://travel-website-iota-six.vercel.app/api";
// =======================
// Load all bookings
// =======================
async function loadBookings() {
    const token = localStorage.getItem("adminToken");

    console.log("Token:", token); // DEBUG

    if (!token) {
        alert("Please login first");
        window.location.href = "admin-login.html";
        return;
    }

    try {
        // Use your deployed backend URL here
        const res = await fetch("https://travel-website-iota-six.vercel.app/api/admin/bookings", {
            headers: {
                "Authorization": token
            }
        });

        const data = await res.json();
        console.log("Bookings:", data); // DEBUG

        if (!data.length) {
            document.getElementById("bookings").innerHTML =
                "<p>No bookings found</p>";
            return;
        }

        document.getElementById("bookings").innerHTML = data.map(b => `
            <div class="booking-card">
                <h3>${b.hotelName}</h3>
                <p><b>Name:</b> ${b.name}</p>
                <p><b>Email:</b> ${b.email}</p>
                <p><b>Phone:</b> ${b.phone}</p>
                <p><b>Date:</b> ${b.date}</p>
                <p><b>Guests:</b> ${b.guests}</p>
            </div>
        `).join('');

    } catch (err) {
        console.error("Error fetching bookings:", err);
        document.getElementById("bookings").innerHTML = "<p>Failed to load bookings.</p>";
    }
}

// =======================
// Initialize
// =======================
loadBookings();