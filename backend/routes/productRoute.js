//All API requests related to products
const express=require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createReview, getAllReview, deleteReview, getAdminProduct  } = require("../controllers/productController");
const {isAuthenticatedUser, authorizedRoles} = require("../middleware/authentication")
const router=express.Router();


router.route("/products").get(getAllProducts)
router.route("/admin/products/new").post(isAuthenticatedUser, authorizedRoles("admin") , createProduct)
router.route("/admin/products").get(isAuthenticatedUser,authorizedRoles("admin"),getAdminProduct);
router.route("/admin/products/:id").put(isAuthenticatedUser, authorizedRoles("admin") ,  updateProduct).delete(isAuthenticatedUser, authorizedRoles("admin") ,  deleteProduct)
router.route("/products/:id").get(getProductDetails)
router.route("/review").put(isAuthenticatedUser, createReview)
router.route("/reviews").get(getAllReview).delete(isAuthenticatedUser,deleteReview)
module.exports=router;
