const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  writer: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  toilet: {
    type: mongoose.ObjectId,
    ref: "Toilet",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  description: {
    type: String,
    minlength: 1,
    maxLength: 300,
  },
  image: String,
  updatedAt: {
    type: String,
    required: true,
  },
});

reviewSchema.index({ toilet: -1 });

module.exports = mongoose.model("Review", reviewSchema);
