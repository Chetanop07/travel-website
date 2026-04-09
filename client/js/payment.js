const API = "http://localhost:5000/api/payment";

const bookingId = localStorage.getItem("bookingId");
fetch('https://travel-website-iota-six.vercel.app/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
});
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