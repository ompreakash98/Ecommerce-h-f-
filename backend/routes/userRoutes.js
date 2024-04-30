const { registerUser, loginUser, logout, forgetPassword
    , resetPassword, getUserDetials

    , updateUserPassword, updateDetials, getAllusers,
    getSingleusers,
    updateUserRole,
    deleteUser } = require("../controllers/userController");
const { isAuthanticateUser, authorizeRoles } = require('../middleware/auth')

const express = require("express");
const router = express.Router();
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forget').post(forgetPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logout);

router.route("/me").get(isAuthanticateUser, getUserDetials);
router.route("/password/update").put(isAuthanticateUser, updateUserPassword);
router.route("/me/update").put(isAuthanticateUser, updateDetials)
router.route("/admin/user").get(isAuthanticateUser, authorizeRoles("admin", getAllusers))
router.route("/admin/singleuser/:id").get(isAuthanticateUser, authorizeRoles, getSingleusers).put(isAuthanticateUser, authorizeRoles, updateUserRole).delete(isAuthanticateUser, authorizeRoles, deleteUser)

module.exports = router
