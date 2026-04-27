const API = "https://travel-website-production-27eb.up.railway.app/api";

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
    <tr>
        <td>${b.hotelName}</td>
        <td>${b.name}</td>
        <td>${b.email}</td>
        <td>${b.phone}</td>
        <td>${new Date(b.date).toLocaleDateString()}</td>
        <td>${b.guests}</td>
        <td class="status ${b.status}">
            ${b.status || "Pending"}
        </td>
        <td>
            <button class="accept" onclick="updateStatus('${b._id}', 'Accepted')">✔</button>
            <button class="reject" onclick="updateStatus('${b._id}', 'Rejected')">✖</button>
        </td>
    </tr>
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