const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new Schema({
  followerUserId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  followingUserId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  creationDateTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("follow", followSchema);
