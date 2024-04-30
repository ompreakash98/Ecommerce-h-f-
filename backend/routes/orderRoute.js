const express = require('express');
const { createOrder, getSingleOrder, myOrder, allOrders, updateOrder, deleteOrders } = require("../controllers/orderController")
const router = express.Router();
const { isAuthanticateUser, authorizeRoles } = require("../middleware/auth")



// router.route("/order/new").post(newOrder);
router.route("/order/new").post(isAuthanticateUser, createOrder);
router.route("/order/:id").get(isAuthanticateUser, authorizeRoles('admin'), getSingleOrder);
router.route("/order/me").get(isAuthanticateUser, myOrder);
router.route("/admin/orders").get(isAuthanticateUser, authorizeRoles('admin'), allOrders);
router.route("/admin/orders/:id").put(isAuthanticateUser, authorizeRoles('admin'), updateOrder).delete(isAuthanticateUser, authorizeRoles("admin"), deleteOrders)

module.exports = router;