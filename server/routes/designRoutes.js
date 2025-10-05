const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createDesign, getDesigns, getDesignById, updateDesign, deleteDesign } = require('../controllers/designController');

router.use(authMiddleware);

router.get('/', getDesigns);
router.get('/:id', getDesignById);   // <--- ADD THIS LINE
router.post('/', createDesign);
router.put('/:id', updateDesign);
router.delete('/:id', deleteDesign);

module.exports = router;
