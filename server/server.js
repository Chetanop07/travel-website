require('dotenv').config();
require('dns').setDefaultResultOrder('ipv4first');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(cors({
    origin: 'https://travel-website-iota-six.vercel.app',
    methods: ['GET','POST','DELETE','PUT'],
    credentials: true
}));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// =======================
// MONGODB CONNECTION
// =======================
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

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
    if (!token) return res.status(401).send("No token");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        console.error("JWT verification error:", err);
        res.status(400).send("Invalid token");
    }
};

// =======================
// AUTH ROUTES
// =======================
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await new User({ name, email, password: hash }).save();
        res.send("Registered Successfully");
    } catch (err) {
        console.error(err);
        res.status(400).send("User already exists");
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("User not found");

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) return res.status(400).send("Wrong password");

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// =======================
// BOOKING ROUTES
// =======================
app.post('/api/book', async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).send("Booking failed");
    }
});

// =======================
// REVIEW ROUTES
// =======================
app.post('/api/review', async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.send("Review added");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add review");
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch reviews");
    }
});

// =======================
// ADMIN ROUTES
// =======================
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await User.findOne({ email, isAdmin: true });
        if (!admin) return res.status(400).send("Not admin");

        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(400).send("Wrong password");

        const token = jwt.sign(
            { id: admin._id, isAdmin: true },
            process.env.JWT_SECRET
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get('/api/admin/bookings', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send("Access denied");
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch bookings");
    }
});

app.delete('/api/admin/booking/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send("Access denied");
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.send("Deleted");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete booking");
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
    } catch (err) {
        console.error(err);
        res.status(500).send("Admin creation failed");
    }
});

// =======================
// FRONTEND ROUTES
// =======================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));