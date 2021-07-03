const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      require: true,
    },
    auth: {
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    scores: {
      numberScore: {
        type: [Number],
        required: true,
        default: [],
      },
      reactionScore: {
        type: [Number],
        required: true,
        default: [],
      },

      speedScore: {
        type: [Number],
        required: true,
        default: [],
      },

      chimpScore: {
        type: [Number],
        required: true,
        default: [],
      },
    },
  },
  { _id: false }
);

module.exports = mongoose.model("User", userSchema);
