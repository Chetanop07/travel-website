const API = window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://travel-website-iota-six.vercel.app/api";
// =======================
// Get selected district
// =======================
const district = localStorage.getItem("district")?.trim().toLowerCase();
document.getElementById("districtTitle").innerText = district ? district.charAt(0).toUpperCase() + district.slice(1) + " Hotels" : "Hotels";

// ✅ Proper hotel data with images
const hotelsData = {
    shimla: [
        { name: "Shimla Grand", img: "images/hotels/shimla1.jpg", price: 2500 },
        { name: "Snow Valley Resort", img: "images/hotels/shimla2.jpg", price: 3200 },
        { name: "Hotel Pine View", img: "images/hotels/shimla3.jpg", price: 2100 },
        { name: "Radisson Shimla", img: "images/hotels/shimla4.jpg", price: 5000 },
        { name: "Woodville Palace", img: "images/hotels/shimla5.jpg", price: 4200 },
        { name: "Oberoi Cecil", img: "images/hotels/shimla6.jpg", price: 28728 }
    ],
    kullu: [
        { name: "Manali Heights", img: "images/hotels/manali1.jpg", price: 2100 },
        { name: "Snow Peak Resort", img: "images/hotels/manali2.png", price: 2100 },
        { name: "Hotel The Nest", img: "images/hotels/kullu3.jpg", price: 2100 },
        { name: "Capital O", img: "images/hotels/manali4.jpg", price: 3150 },
        { name: "Hotel Kullu Valley", img: "images/hotels/manali5.jpg", price: 3500 },
        { name: "Himalyan Kothi", img: "images/hotels/manali6.jpg", price: 6000 },
        { name: "Hotel Aroma Classic", img: "images/hotels/manali8.jpg", price: 2000 },
        { name: "Shobhla Royale", img: "images/hotels/manali7.jpg", price: 3600 }
    ],
    kangra: [
        { name: "Hill View", img: "images/hotels/kangra1.jpg", price: 2100 },
        { name: "Nature Stay", img: "images/hotels/kangra2.jpg", price: 2100 },
        { name: "Hotel River Retreat", img: "images/hotels/kangra3.jpg", price: 2900 },
        { name: "Kangra Valley Resort", img: "images/hotels/kangra4.jpg", price: 5500 },
        { name: "Kangra Heritage Hotel", img: "images/hotels/kangra5.jpg", price: 2200 },
        { name: "Fort View Inn", img: "images/hotels/kangra6.jpg", price: 7300 },
        { name: "Kangra Comfort Hotel", img: "images/hotels/kangra7.jpg", price: 3100 },
        { name: "Valley Retreat", img: "images/hotels/kangra8.jpg", price: 2400 }
    ],
    kinnaur: [
        { name: "Kinnaur Retreat", img: "images/hotels/kinnaur1.jpg", price: 4000 },
        { name: "Zostel Sangla", img: "images/hotels/kinnaur2.jpg", price: 5100 },
        { name: "Kinnaur Heights", img: "images/hotels/kinnaur3.jpg", price: 2200 },
        { name: "Sangla Valley Resort", img: "images/hotels/kinnaur4.jpg", price: 2500 },
        { name: "Kinnaur Inn", img: "images/hotels/kinnaur5.jpg", price: 7000 },
        { name: "Mountain View Homestay", img: "images/hotels/kinnaur6.jpg", price: 2300 },
        { name: "Kinnaur Valley Hotel", img: "images/hotels/kinnaur7.jpg", price: 2900 },
        { name: "Kinner Kailash Resort", img: "images/hotels/kinnaur8.jpg", price: 2500 }
    ],
    spiti: [
        { name: "Spiti Valley Camp", img: "images/hotels/spiti1.jpg", price: 4500 },
        { name: "Yellow Hotels Kaza", img: "images/hotels/spiti2.jpg", price: 5600 },
        { name: "Spiti Serenity", img: "images/hotels/spiti3.jpg", price: 7600 },
        { name: "Kaza Mountain Lodge", img: "images/hotels/spiti4.jpg", price: 8500 },
        { name: "Spiti Dewachen", img: "images/hotels/spiti5.jpg", price: 5300 },
        { name: "Samtenling Monastary Resort", img: "images/hotels/spiti6.jpg", price: 2400 }
    ],
    chamba: [
        { name: "Chamba Residency", img: "images/hotels/chamba1.jpg", price: 5000 },
        { name: "Chamba Palace", img: "images/hotels/chamba2.jpg", price: 9000 },
        { name: "Dalhousie Heights", img: "images/hotels/chamba3.jpg", price: 2500 },
        { name: "Chamba Valley Hotel", img: "images/hotels/chamba4.jpg", price: 2900 },
        { name: "Himachal Retreat", img: "images/hotels/chamba5.jpg", price: 5000 }
    ],
    solan: [
        { name: "Solan Inn", img: "images/hotels/solan1.jpg", price: 4100 },
        { name: "Solan Valley Resort", img: "images/hotels/solan2.jpg", price: 5500 },
        { name: "Kasauli Heights", img: "images/hotels/solan3.jpg", price: 8000 },
        { name: "Solan Comfort Hotel", img: "images/hotels/solan4.jpg", price: 3000 }
    ],
    mandi: [
        { name: "Mandi Palace", img: "images/hotels/mandi1.jpg", price: 7000 },
        { name: "Mandi Valley Resort", img: "images/hotels/mandi2.jpg", price: 5500 },
        { name: "Rewalsar Lake Hotel", img: "images/hotels/mandi3.jpg", price: 8000 },
        { name: "Mandi Inn", img: "images/hotels/mandi4.jpg", price: 5000}
    ],
    bilaspur: [
        { name: "Lake View Hotel", img: "images/hotels/bilaspur1.jpg", price: 2500 },
        { name: "Bilaspur Palace", img: "images/hotels/bilaspur2.jpg", price: 9000 },
        { name: "Nalagarh Fort Resort", img: "images/hotels/bilaspur3.jpg", price: 7000 },
        { name: "Bilaspur Inn", img: "images/hotels/bilaspur4.jpg", price: 6800 }
    ],
    hamirpur: [
        { name: "Hamirpur Lodge", img: "images/hotels/hamirpur1.jpg", price: 3100 },
        { name: "Hamirpur Valley Resort", img: "images/hotels/hamirpur2.jpg", price: 4300 },
        { name: "Sujanpur Fort Hotel", img: "images/hotels/hamirpur3.jpg", price: 6000 },
        { name: "Hamirpur Inn", img: "images/hotels/hamirpur4.jpg", price: 3200 }
    ],
    una: [
        { name: "Una Residency", img: "images/hotels/una1.jpg", price: 4100 },
        { name: "Hotel Simble Valley", img: "images/hotels/una2.jpg", price: 6000 },
        { name: "Una Comfort Hotel", img: "images/hotels/una3.jpg", price: 2200 }
    ],
    sirmaur: [
        { name: "Sirmaur Retreat", img: "images/hotels/sirmaur1.jpg", price: 6100 },
        { name: "Nahan Inn", img: "images/hotels/sirmaur2.jpg", price: 4300 },
        { name: "Sirmaur Valley Resort", img: "images/hotels/sirmaur3.jpg", price: 7000 }
    ]
};

// =======================
// Display hotels
// =======================
const list = document.getElementById("hotelList");

if (!district || !hotelsData[district]) {
    list.innerHTML = "<h2>No hotels available</h2>";
} else {
    list.innerHTML = hotelsData[district].map(hotel => `
    <div class="hotel-card" data-aos="zoom-in">
        <img src="${hotel.img}">
        
        <div class="hotel-details">
            <h3>${hotel.name}</h3>
            <p class="price">₹${hotel.price || 2000}</p>
            <button onclick="selectHotel('${hotel.name}')">Book Now</button>
        </div>
    </div>
`).join('');
}

// =======================
// Select hotel and go to contact page
// =======================
function selectHotel(name) {
    localStorage.setItem("selectedHotel", name);
    window.location.href = "contact.html";
}
