
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    roomType: {
        type: String,
        required: true,
        enum: ['single', 'double', 'suite', 'deluxe']
    },
    roomNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    amenities: {
        type: [String], 
        default: []
    },
    ratePerNight: {
        type: Number,
        required: true
    },
    maxOccupancy: {
        type: Number,
        required: true,
        min: 1
    },
    availabilityStatus: {
        type: Boolean,
        default: true
    },
    images: {
        type: [String], 
        default: []
    },
    lastMaintenanceDate: {
        type: Date
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
}, { timestamps: true });

inventorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
