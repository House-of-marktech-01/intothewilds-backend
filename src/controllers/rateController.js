
// const Rate = require('../models/Rate');

// exports.createRate = async (req, res) => {
//     try {
//         const { roomType, baseRate, seasonalRates, discount, surcharge } = req.body;

//         // Check if rate already exists for the room type
//         const existingRate = await Rate.findOne({ roomType });
//         if (existingRate) {
//             return res.status(400).json({ message: 'Rate for this room type already exists.' });
//         }

//         // Create a new rate
//         const newRate = new Rate({
//             roomType,
//             baseRate,
//             seasonalRates,
//             discount,
//             surcharge
//         });

//         await newRate.save();

//         return res.status(201).json({ message: 'Rate created successfully', rate: newRate });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to create rate', error: error.message });
//     }
// };

// // Get all rates
// exports.getAllRates = async (req, res) => {
//     try {
//         const rates = await Rate.find();

//         if (!rates || rates.length === 0) {
//             return res.status(404).json({ message: 'No rates found.' });
//         }

//         return res.status(200).json(rates);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to fetch rates', error: error.message });
//     }
// };

// // Get rate by room type
// exports.getRateByRoomType = async (req, res) => {
//     try {
//         const { roomType } = req.params;

//         const rate = await Rate.findOne({ roomType });

//         if (!rate) {
//             return res.status(404).json({ message: 'Rate not found for this room type.' });
//         }

//         return res.status(200).json(rate);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to fetch rate', error: error.message });
//     }
// };

// // Update the rate for a room type
// exports.updateRate = async (req, res) => {
//     try {
//         const { roomType } = req.params;
//         const { baseRate, seasonalRates, discount, surcharge } = req.body;

//         const rate = await Rate.findOne({ roomType });
//         if (!rate) {
//             return res.status(404).json({ message: 'Rate not found for this room type.' });
//         }

//         // Update rate details
//         rate.baseRate = baseRate || rate.baseRate;
//         rate.seasonalRates = seasonalRates || rate.seasonalRates;
//         rate.discount = discount || rate.discount;
//         rate.surcharge = surcharge || rate.surcharge;

//         await rate.save();

//         return res.status(200).json({ message: 'Rate updated successfully', rate });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to update rate', error: error.message });
//     }
// };

// // Delete rate for a room type
// exports.deleteRate = async (req, res) => {
//     try {
//         const { roomType } = req.params;

//         const rate = await Rate.findOneAndDelete({ roomType });

//         if (!rate) {
//             return res.status(404).json({ message: 'Rate not found for this room type.' });
//         }

//         return res.status(200).json({ message: 'Rate deleted successfully.' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to delete rate', error: error.message });
//     }
// };

// // Update seasonal rate for a room type
// exports.updateSeasonalRate = async (req, res) => {
//     try {
//         const { roomType, season } = req.params;
//         const { startDate, endDate, rate } = req.body;

//         const rateDoc = await Rate.findOne({ roomType });
//         if (!rateDoc) {
//             return res.status(404).json({ message: 'Rate not found for this room type.' });
//         }

//         // Find the seasonal rate by season
//         const seasonalRate = rateDoc.seasonalRates.find(r => r.season === season);
//         if (!seasonalRate) {
//             return res.status(404).json({ message: `No seasonal rate found for ${season}.` });
//         }

//         // Update the seasonal rate
//         seasonalRate.startDate = startDate || seasonalRate.startDate;
//         seasonalRate.endDate = endDate || seasonalRate.endDate;
//         seasonalRate.rate = rate || seasonalRate.rate;

//         await rateDoc.save();

//         return res.status(200).json({ message: 'Seasonal rate updated successfully', rate: seasonalRate });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to update seasonal rate', error: error.message });
//     }
// };
