const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Category = require("../models/categoryModel");

exports.dashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const avgRating = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$ratings" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      userCount,
      productCount,
      orderCount,
      totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
      avgRating: avgRating.length > 0 ? avgRating[0].avgRating : 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.listAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("user", "firstName lastName")
      .populate("category");

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.totalProductsSold = async (req, res) => {
  try {
    const totalProductsSold = await Order.aggregate([
      { $unwind: "$orderItems" },
      { $group: { _id: "$orderItems.product", total: { $sum: "$orderItems.quantity" } } },
      {
        $lookup: {
          from: Product.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          quantitySold: "$total",
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalProductsSold,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.totalRevenueGenerated = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.status(200).json({
      success: true,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.averageProductRating = async (req, res) => {
  try {
    const avgRating = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$ratings" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      avgRating: avgRating.length > 0 ? avgRating[0].avgRating : 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.listAllCategories = async (req, res) => {
  try {
  const categories = await Category.find({});
  res.status(200).json({
    success: true,
    categories,
  });
  } catch (error) {
  console.log(error);
  res.status(500).json({ success: false, error: error.message });
  }
  };
  
  exports.listProductsByCategory = async (req, res) => {
  try {
  const { category } = req.params;
  const products = await Product.find({ category })
    .populate("user", "firstName lastName")
    .populate("category");
  
  res.status(200).json({
    success: true,
    products,
  });
  } catch (error) {
  console.log(error);
  res.status(500).json({ success: false, error: error.message });
  }
  };
  
  
  
  
  