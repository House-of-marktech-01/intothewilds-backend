

// const mongoose = require('mongoose');

// const rateSchema = new mongoose.Schema({
//     roomType: {
//         type: String,
//         required: true,
//         enum: ['single', 'double', 'suite', 'deluxe']
//     },
//     baseRate: {
//         type: Number,
//         required: true
//     },
//     seasonalRates: [
//         {
//             season: {
//                 type: String,
//                 required: true,
//                 enum: ['high', 'low', 'peak', 'holiday']
//             },
//             startDate: {
//                 type: Date,
//                 required: true
//             },
//             endDate: {
//                 type: Date,
//                 required: true
//             },
//             rate: {
//                 type: Number,
//                 required: true
//             }
//         }
//     ],
//     discount: {
//         type: Number,
//         min: 0,
//         max: 100,
//         default: 0 
//     },
//     surcharge: {
//         type: Number,
//         min: 0,
//         max: 100,
//         default: 0 
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date
//     }
// }, { timestamps: true });

// rateSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

// module.exports = mongoose.model('Rate', rateSchema);
