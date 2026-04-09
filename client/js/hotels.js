const district = localStorage.getItem("district")?.trim().toLowerCase();
document.getElementById("districtTitle").innerText = district + " Hotels";

// ✅ PROPER HOTEL DATA WITH IMAGES
const hotelsData = {
    shimla: [
        { name: "Shimla Grand", img: "images/hotels/shimla1.jpg" },
        { name: "Snow Valley", img: "images/hotels/shimla2.jpg" },
        { name: "Hotel Pine View", img: "images/hotels/shimla3.jpg" }
    ],
    kullu: [
        { name: "Manali Heights", img: "images/hotels/manali1.jpg" },
        { name: "Snow Peak Resort", img:"images/hotels/manali2.png" }
    ],
    kangra: [
        { name: "Hill View", img: "images/hotels/kangra1.jpg" },
        { name: "Nature Stay", img: "images/hotels/kangra2.jpg" }
    ],
    kinnaur: [
        { name: "Kinnaur Retreat", img: "images/hotels/kinnaur1.jpg" },
        { name: "Zostel Sangla", img: "images/hotels/kinnaur2.jpg" }
    ],
    spiti: [
        { name: "Spiti Valley Camp", img: "images/hotels/spiti1.jpg" },
        { name: "Yellow Hotels Kaza", img: "images/hotels/spiti2.jpg" }
    ],
    chamba: [
        { name: "Chamba Residency", img: "images/hotels/chamba1.jpg" }
    ],
    solan: [
        { name: "Solan Inn", img: "images/hotels/solan1.jpg" }
    ],
    mandi: [
        { name: "Mandi Palace", img: "images/hotels/mandi1.jpg" }
    ],
    bilaspur: [
        { name: "Lake View Hotel", img: "images/hotels/bilaspur1.jpg" }
    ],
    hamirpur: [
        { name: "Hamirpur Lodge", img: "images/hotels/hamirpur1.jpg" }
    ],
    una: [
        { name: "Una Residency", img: "images/hotels/una1.jpg" }
    ],
    sirmaur: [
        { name: "Sirmaur Retreat", img: "images/hotels/sirmaur1.jpg" }
    ]
};

const list = document.getElementById("hotelList");

// ✅ DISPLAY HOTELS
if (!district || !hotelsData[district]) {
    list.innerHTML = "<h2>No hotels available</h2>";
} else {
    list.innerHTML = hotelsData[district].map(hotel => `
        <div class="hotel-card" onclick="selectHotel('${hotel.name}')">
            <img src="${hotel.img}">
            <h3>${hotel.name}</h3>
        </div>
    `).join('');
}

// ✅ BOOK HOTEL
function selectHotel(name) {
    localStorage.setItem("selectedHotel", name);
    window.location.href = "contact.html";
}