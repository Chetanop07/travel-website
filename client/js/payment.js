// =======================
// Confirm payment
// =======================
const API = "https://travel-website-production-27eb.up.railway.app/api";

const bookingId = localStorage.getItem("bookingId");

async function confirmPayment() {
    if (!bookingId) {
        alert("No booking found");
        return;
    }

    try {
        const res = await fetch(`${API}/payment/success`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ bookingId })
        });

        if (!res.ok) throw new Error();

        alert("Payment Successful ✅");
        localStorage.removeItem("bookingId");
        window.location.href = "index.html";

    } catch {
        alert("Payment failed ❌");
    }
}