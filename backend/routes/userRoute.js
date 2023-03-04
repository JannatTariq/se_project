const express = require("express")
const {registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllUser, getUser, updateUserRole, deleteUser} = require("../controllers/userController")
const {isAuthenticatedUser, authorizedRoles} = require("../middleware/authentication")
const router=express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logoutUser);
router.route("/userdetail").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);
router.route("/userdetail/update").put(isAuthenticatedUser, updateUserProfile);
router.route("/admin/user").get(isAuthenticatedUser, authorizedRoles("admin"),getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizedRoles("admin"),getUser).put(isAuthenticatedUser, authorizedRoles("admin"),updateUserRole).delete(isAuthenticatedUser, authorizedRoles("admin"),deleteUser);
module.exports = router


