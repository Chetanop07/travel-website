const API = "http://localhost:5000/api/payment";

const bookingId = localStorage.getItem("bookingId");

async function confirmPayment() {
    if (!bookingId) {
        alert("No booking found");
        return;
    }

    await fetch(`${API}/success`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bookingId })
    });

    alert("Payment Successful!");

    localStorage.removeItem("bookingId");
    window.location.href = "index.html";
}