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
app.use(cors());

// =======================
// MONGODB CONNECTION
// =======================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// =======================
// MODELS
// =======================

// USER
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    isAdmin: { type: Boolean, default: false }
}));

// BOOKING
const Booking = mongoose.model('Booking', new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    hotelName: String,
    date: String,
    guests: Number,
    message: String,
    createdAt: { type: Date, default: Date.now }
}));

// REVIEW
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
    if (!token) return res.status(401).send("No token");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch {
        res.status(400).send("Invalid token");
    }
};

// =======================
// AUTH ROUTES
// =======================

// REGISTER
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        await new User({ name, email, password: hash }).save();
        res.send("Registered Successfully");
    } catch {
        res.status(400).send("User already exists");
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User not found");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
    );

    res.json({ token });
});

// =======================
// BOOKING ROUTES
// =======================

// CREATE BOOKING
app.post('/api/book', async (req, res) => {
    const booking = new Booking(req.body);
    await booking.save();
    res.json(booking);
});

// =======================
// REVIEW ROUTES
// =======================

// ADD REVIEW
app.post('/api/review', async (req, res) => {
    const review = new Review(req.body);
    await review.save();
    res.send("Review added");
});

// GET REVIEWS
app.get('/api/reviews', async (req, res) => {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
});

// =======================
// ADMIN ROUTES
// =======================

// ADMIN LOGIN
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin) return res.status(400).send("Not admin");

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign(
        { id: admin._id, isAdmin: true },
        process.env.JWT_SECRET
    );

    res.json({ token });
});

// GET ALL BOOKINGS
app.get('/api/admin/bookings', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send("Access denied");

    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
});

// DELETE BOOKING
app.delete('/api/admin/booking/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send("Access denied");

    await Booking.findByIdAndDelete(req.params.id);
    res.send("Deleted");
});

// =======================
// CREATE ADMIN (RUN ONCE)
// =======================
app.get('/create-admin', async (req, res) => {
    const hash = await bcrypt.hash("admin123", 10);

    await new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: hash,
        isAdmin: true
    }).save();

    res.send("Admin created");
});
// DEBUG: CHECK USERS
app.get('/check-users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});
// =======================
// SERVER START
// =======================
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
function openDistrict(name) {
    localStorage.setItem("district", name);
    window.location.href = "hotels.html";
}