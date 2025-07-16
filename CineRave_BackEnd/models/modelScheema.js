const mongoose = require('mongoose');

const movieScheema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  director: String,
  poster: {
    type: String,
    required: true,
  },
  genere: { type: [String] },
  rating: { type: Number },
  description: { type: String },
  trailer: { type: String },
  runtime: { type: Number },
  releaseDate: { type: Date },
  language: { type: [String] },
  background: { type: String },
  reviews: [
    {
      userName: { type: String },
      comment: { type: String },
      rating: { type: Number },
    },
  ],
});

const Movie = mongoose.model('movie', movieScheema);

module.exports = Movie;
