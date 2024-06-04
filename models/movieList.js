// models/movieListSchema.js
const mongoose = require("mongoose");

const MovieListSchema = new mongoose.Schema({
  movie: {
    type: String,
    required: true,
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlayLists",
    required: true,
  },
});
const MovieListModel = mongoose.model("MovieLists", MovieListSchema);
module.exports = {
  MovieListModel,
};
