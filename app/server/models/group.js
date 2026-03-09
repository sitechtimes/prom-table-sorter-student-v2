const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  osis: { type: Number, required: false, trim: true },
  bringingGuest: { type: Boolean, required: false, default: false },
  guest: { type: Boolean, required: false, default: false },
  guestOwner: { type: String, required: false, trim: true },
});

const groupSchema = new mongoose.Schema({
  leader: { type: personSchema, required: true },
  members: [personSchema],
});

module.exports = mongoose.model("Group", groupSchema);
