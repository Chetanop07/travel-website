const API = window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://travel-website-iota-six.vercel.app/api";
// =======================
// API URL
// =======================
const API = "https://travel-website-iota-six.vercel.app/api/payment";

// =======================
// Get booking ID
// =======================
const bookingId = localStorage.getItem("bookingId");

// Remove broken fetch at the top
// fetch('https://travel-website-iota-six.vercel.app/api/book', ... ) -> REMOVED

// =======================
// Confirm payment
// =======================
async function confirmPayment() {
    if (!bookingId) {
        alert("No booking found");
        return;
    }

    try {
        const res = await fetch(`${API}/success`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ bookingId })
        });

        if (!res.ok) {
            throw new Error("Payment confirmation failed");
        }

        alert("Payment Successful!");
        localStorage.removeItem("bookingId");
        window.location.href = "index.html";

    } catch (err) {
        console.error("Payment error:", err);
        alert("Payment failed. Please try again.");
    }
}