const Review = require('../models/Review');
const User = require('../models/User');
const Tour = require('../models/Properties');

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user').populate('tour');
        res.status(200).json({ success: true, reviews });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createReview = async (req, res) => {
    try {
        const { user, tour, rating, comment } = req.body;

        const userExists = await User.findById(user);
        if (!userExists) return res.status(400).json({ error: 'User not found.' });

        const tourExists = await Tour.findById(tour);
        if (!tourExists) return res.status(400).json({ error: 'Tour not found.' });

        const review = await Review.create({ user, tour, rating, comment });
        res.status(201).json({ success: true, review });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id).populate('user').populate('tour');
        if (!review) return res.status(404).json({ error: 'Review not found.' });
        res.status(200).json({ success: true, review });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findByIdAndUpdate(id, { rating, comment }, { new: true });
        if (!review) return res.status(404).json({ error: 'Review not found.' });
        res.status(200).json({ success: true, review });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);
        if (!review) return res.status(404).json({ error: 'Review not found.' });
        res.status(200).json({ success: true, message: 'Review deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

