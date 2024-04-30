const ErrorHandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/cachyAcyncError')
const User = require('../models/userModule');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')
//register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this sis the sample id ",
            url: 'profilePicture'
        },
    });

    // const token= user.getJWTtoken()
    // res.status(201).json({sucess:true,token})
    sendToken(user, 201, res);
})

//login user

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    //cheking if user given email or password both given
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email &Password "))

    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("user not faund"));

    };
    const isPasswordMatched = user.compairePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("email or password not matched"));

    };
    //  const token= await user.getJWTtoken()
    //  res.status(201).cookies("token", token, options).json({sucess:true,token})
    sendToken(user, 200, res)
});

//logout ;

exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "Logged Out "
    })
});

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(ErrorHandler('user not found ', 404))
    };
    //geting reset pasword token;
    const resetToken = user.getresetPasswordToken();
    await user.save({ validateBeforSave: false });

    const resetPasswordurl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const massage = `your password reset token is :\n\n${resetPasswordurl}\n\n if  your 
    not requested for this mail the please contect to admin `;
    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message: massage

        })

        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`
        })

    } catch (error) {
        user.getresetPasswordToken = undefined;
        user.resertPasswordExpire = undefined;
        await user.save({ validateBeforSave: false });

        return next(new ErrorHandler(error.message, 500))

    }

})

//reseting the password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    //creating hash token
    const resertPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex');
    const user = await User.findOne({
        resertPasswordToken,
        resertPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('reset password token is invalid or has been expired', 400));

    }
    if (req.body.password !== req.body.compairePassword) {
        return next(new ErrorHandler("password does not mached", 400))
    };
    user.password = req.body.password;
    user.resertPasswordToken = undefined;
    user.resertPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res)

})

//get user detials 

exports.getUserDetials = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id)
    if (!user) {

    }
    res.status(200).json({
        success: true,
        user,
    })

})

//update the user password
exports.updateUserPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password")
    const isPasswordMatched = user.compairePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password Is Incorrect", 401));

    };

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 401));

    };
    user.password = req.body.newPassword;
    await user.save
    res.status(200).json({
        success: true,
        user,
    })

})

//updateDetials 
exports.updateDetials = catchAsyncError(async (req, res, next) => {


    const newUserdata = {
        name: req.body.name,
        emai: req.body.emai,

    }
    //we will add claudnary later
    const user = User.findByIdAndUpdate(req.user.id, newUserdata, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true
    })


})

//geting all users-admin
exports.getAllusers = catchAsyncError(async (req, res, next) => {
    const alluser = await User.find({});
    res.status(200).json({ success: true, alluser })

});
//geting single users-admin
exports.getSingleusers = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`user not exist with the id :${req.params.id}`))
    }
    res.status(200).json({ success: true, alluser })

})


//updateUserRole
exports.updateUserRole = catchAsyncError(async (req, res, next) => {


    const newUserdata = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role



    }
    //we will add claudnary later
    const user = User.findByIdAndUpdate(req.user.id, newUserdata, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true
    })


})


// delete user role
exports.deleteUser = catchAsyncError(async (req, res, next) => {

    //we will remove cloudnary



    const user = User.findById(req.params.id);


    if (!user) {
        return next(new ErrorHandler("user not exist with this id"))
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "userDeleted Successfuly"
    })


})





