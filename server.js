require('dotenv').config();
require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// =======================
// MONGODB CONNECTION
// =======================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => console.error("MongoDB Error:", err));

// =======================
// MODELS
// =======================
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    isAdmin: { type: Boolean, default: false }
}));

const Booking = mongoose.model('Booking', new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    hotelName: String,
    date: String,
    guests: Number,
    message: String,
    status: { type: String, default: "Pending" }, // ✅ NEW
    createdAt: { type: Date, default: Date.now }
}));

const Review = mongoose.model('Review', new mongoose.Schema({
    name: String,
    message: String,
    rating: Number,
    date: { type: Date, default: Date.now }
}));

// =======================
// AUTH MIDDLEWARE
// =======================
const auth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid token" });
    }
};

// =======================
// AUTH ROUTES
// =======================

// REGISTER
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        await new User({ name, email, password: hash }).save();

        res.json({ message: "Registered Successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(400).json({ message: "User not found" });

        const valid = await bcrypt.compare(req.body.password, user.password);

        if (!valid) return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        );

        res.json({ token });

    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// =======================
// BOOKING ROUTES
// =======================
app.post('/api/book', async (req, res) => {
    const { hotelName, date, guests } = req.body;

    if (!hotelName || !date || !guests) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        const booking = new Booking(req.body);
        await booking.save();

        res.json({ message: "Booking successful", booking });

    } catch {
        res.status(500).json({ message: "Booking failed" });
    }
});

// =======================
// REVIEW ROUTES
// =======================

// ADD REVIEW
app.post('/api/review', async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.json({ message: "Review added" });
    } catch {
        res.status(500).json({ message: "Failed to add review" });
    }
});

// GET REVIEWS
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.json(reviews);
    } catch {
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
});

// =======================
// ADMIN ROUTES
// =======================

// ADMIN LOGIN
app.post('/api/admin/login', async (req, res) => {
    try {
        const admin = await User.findOne({
            email: req.body.email,
            isAdmin: true
        });

        if (!admin) return res.status(400).json({ message: "Not admin" });

        const valid = await bcrypt.compare(req.body.password, admin.password);

        if (!valid) return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign(
            { id: admin._id, isAdmin: true },
            process.env.JWT_SECRET
        );

        res.json({ token });

    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// GET BOOKINGS (ADMIN)
app.get('/api/admin/bookings', auth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch {
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
});

// DELETE BOOKING
app.delete('/api/admin/booking/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch {
        res.status(500).json({ message: "Delete failed" });
    }
});

// =======================
// CREATE ADMIN (RUN ONCE)
// =======================
app.get('/create-admin', async (req, res) => {
    try {
        const hash = await bcrypt.hash("admin123", 10);

        await new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hash,
            isAdmin: true
        }).save();

        res.send("Admin created");
    } catch {
        res.status(500).send("Admin creation failed");
    }
});

// =======================
// ROOT ROUTE (IMPORTANT)
// =======================
app.get('/', (req, res) => {
    res.send("API is running 🚀");
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
app.put('/api/admin/booking/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({ message: "Status updated", booking });

    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});