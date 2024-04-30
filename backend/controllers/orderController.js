const Order = require("../models/orderModel");
const Product = require("../models/productModule")
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/cachyAcyncError");

exports.createOrder = catchAsyncError(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(200).json({ success: true, message: "Order Created ucessFully", order })

})

//geting single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
})

//geting logged  in user Order
exports.myOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user });

  res.status(200).json({
    success: true,
    orders,
  });

  // res.status(200).json({success:true,message:'Order Found Successfuly',orders})
})

//geting all orders -admin
exports.allOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let total_Amount = 0;
  orders.forEach((order) => {
    total_Amount += order.totalPrice
  })
  res.status(200).json({
    success: true,
    total_Amount,
    orders

  });

  // res.status(200).json({success:true,message:'Order Found Successfuly',orders})
})
//update Order Status --Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}


//delete user

exports.deleteOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.findByIdAndDelete(req.params.id);

  if (!orders) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  res.status(200).json({
    success: true,
    message: "order deleted sucessfully"

  });

  // res.status(200).json({success:true,message:'Order Found Successfuly',orders})
})