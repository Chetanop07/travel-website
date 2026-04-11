// =======================
// Load all bookings
// =======================
const API = "https://travel-website-production-27eb.up.railway.app/api";

async function loadBookings() {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        alert("Please login first");
        window.location.href = "admin-login.html";
        return;
    }

    try {
        const res = await fetch(`${API}/admin/bookings`, {
            headers: {
                "Authorization": token
            }
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        document.getElementById("bookings").innerHTML = data.map(b => `
            <div class="booking">
                <h3>${b.hotelName}</h3>
                <p>${b.name}</p>
                <p>${b.email}</p>
                <p>${b.phone}</p>
                <p>${b.date}</p>
            </div>
        `).join('');

    } catch {
        document.getElementById("bookings").innerHTML = "Failed to load bookings";
    }
}

loadBookings();
// =======================
// Initialize
// =======================
loadBookings();