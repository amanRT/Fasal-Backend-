// models/movieListSchema.js
const mongoose = require("mongoose");

const PlayListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  movienum: {
    type: Number,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
});

const PlayListModel = mongoose.model("PlayLists", PlayListSchema);
module.exports = {
  PlayListModel,
};
