const express = require('express');
const router = express.Router();

const {
    getPendingSubmittedProducts,
    getPendingRejectedProducts,
  createPendingProduct,
  updatePendingProductStatus,
  deletePendingProduct,
} = require('../controllers/pendingProductController');

// Get all pending submitted products
router.get('/submitted', getPendingSubmittedProducts);

// Get all pending rejected products
router.get('/rejected', getPendingRejectedProducts);

// Create a new pending product
router.post('/', createPendingProduct);

// Update a pending product by ID
router.patch('/:id', updatePendingProductStatus);

// Delete a pending product by ID
router.delete('/:id', deletePendingProduct);



module.exports = router;