const API = "https://travel-website-iota-six.vercel.app/api";

// Load bookings
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

                <p class="status">Status: ${b.status || "Pending"}</p>

                <div class="actions">
                    <button class="accept" onclick="updateStatus('${b._id}', 'Accepted')">Accept</button>
                    <button class="reject" onclick="updateStatus('${b._id}', 'Rejected')">Reject</button>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error("Error:", err);
        document.getElementById("bookings").innerHTML =
            "<p>Failed to load bookings</p>";
    }
}

// Update booking status
async function updateStatus(id, status) {
    const token = localStorage.getItem("adminToken");

    await fetch(`${API}/admin/booking/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ status })
    });

    loadBookings(); // refresh
}

// INIT
loadBookings();