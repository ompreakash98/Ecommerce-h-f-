const express = require('express');
const { getAllproducts, updateProduct, createProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } = require('../controllers/productController');
const router = express.Router();
const { isAuthanticateUser, authorizeRoles } = require('../middleware/auth')

router.route('/products').get(getAllproducts)
router.route('/admin/products/new').post(isAuthanticateUser, authorizeRoles("admin"), createProduct)
router.route('/admin/product/:id').put(isAuthanticateUser, authorizeRoles("admin"), updateProduct).delete(isAuthanticateUser, authorizeRoles("admin"), deleteProduct);
router.route("/product/:id").get(getProductDetails)
router.route("/review").put(isAuthanticateUser, createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthanticateUser, deleteReview)
module.exports = router