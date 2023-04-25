const PendingProduct = require('../models/pendingProduct');

// Get all pending submitted products
exports.getPendingSubmittedProducts = async (req, res, next) => {
    try {
      const pendingSubmittedProducts = await PendingProduct.find({
        status: 'submitted',
      });
      res.status(200).json({
        success: true,
        data: pendingSubmittedProducts,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };
  
  // Get all pending rejected products
  exports.getPendingRejectedProducts = async (req, res, next) => {
    try {
      const pendingRejectedProducts = await PendingProduct.find({
        status: 'rejected',
      });
      res.status(200).json({
        success: true,
        data: pendingRejectedProducts,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

// Create a new pending product
exports.createPendingProduct = async (req, res, next) => {
    try {
      const { name, description, price, images, category, stock, shippingAddress } = req.body;
      const user=req.user;
      const pendingProduct = await PendingProduct.create({
        name,
        description,
        price,
        images,
        category,
        stock,
        user,
        status: 'submitted',
        shippingAddress,
      });
      res.status(201).json({
        success: true,
        data: pendingProduct,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

// Update a pending product status by ID
exports.updatePendingProductStatus = async (req, res, next) => {
    try {
      const { newStatus } = req.body;
      const pendingProduct = await PendingProduct.findByIdAndUpdate(
        req.params.id,
        { status: newStatus },
        { new: true }
      );
      if (!pendingProduct) {
        return res.status(404).json({
          success: false,
          error: 'Pending product not found',
        });
      }
      res.status(200).json({
        success: true,
        data: pendingProduct,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

// Delete a pending product by ID
exports.deletePendingProduct = async (req, res, next) => {
  try {
    const pendingProduct = await PendingProduct.findByIdAndDelete(req.params.id);
    if (!pendingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Pending product not found',
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
