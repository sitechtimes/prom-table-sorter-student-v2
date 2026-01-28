const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  osis: { type: Number, required: false },
});

const groupSchema = new mongoose.Schema({
  leader: { type: personSchema, required: true },
  members: [personSchema],
});

module.exports = mongoose.model("Group", groupSchema);
