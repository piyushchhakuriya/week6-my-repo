const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  title: String,
  jsonData: Object,
  thumbnailUrl: String, // <--- stores Base64 PNG
  userId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Design", DesignSchema);
