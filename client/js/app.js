// =======================
// API
// =======================
const API = "https://travel-website-production-27eb.up.railway.app/api";


// =======================
// SUBMIT REVIEW
// =======================
async function submitReview() {
    const name = document.getElementById("reviewName").value;
    const message = document.getElementById("reviewText").value;
    const rating = parseInt(document.getElementById("rating").value);

    try {
        const res = await fetch(`${API}/review`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ name, message, rating })
        });

        const data = await res.json();
        alert("Review submitted ✅");

        loadReviews(); //  refresh reviews

    } catch (err) {
        console.error(err);
        alert("Failed ❌");
    }
}


// =======================
// LOAD REVIEWS
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
        console.error(err);
    }
}


// =======================
// RUN ON PAGE LOAD
// =======================
loadReviews(); 