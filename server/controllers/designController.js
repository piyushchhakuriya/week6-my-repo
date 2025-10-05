const Design = require("../models/Design");

// Create a new design (with thumbnail)
exports.createDesign = async (req, res) => {
  try {
    const { title, jsonData, thumbnailUrl } = req.body;
    const userId = req.user?.id || req.body.userId; // Adjust as per your auth
    const design = new Design({
      title,
      jsonData,
      thumbnailUrl,
      userId,
    });
    await design.save();
    res.status(201).json(design);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all designs for the user (includes thumbnailUrl)
exports.getDesigns = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const designs = await Design.find({ userId });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a design (keep thumbnailUrl)
exports.updateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, jsonData, thumbnailUrl } = req.body;
    const design = await Design.findByIdAndUpdate(
      id,
      { title, jsonData, thumbnailUrl },
      { new: true }
    );
    if (!design) return res.status(404).json({ message: "Design not found" });
    res.json(design);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a design
exports.deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;
    await Design.findByIdAndDelete(id);
    res.json({ message: "Design deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDesignById = async (req, res) => {
  try {
    const { id } = req.params;
    const design = await Design.findById(id);
    if (!design) return res.status(404).json({ message: "Design not found" });
    res.json(design);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
