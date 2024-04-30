const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your name "],
        maxLength: [30, "name should be less than 30 "],
        minLength: [4, "name should be more than 4"]
    },
    email: {
        type: String,
        required: [true, "Enter your email"],
        unique: true,
        validator: [validator.isEmail, "Please Enter A valid Email"]
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minLength: [8, "Passdord should be 8 charctor "],
        select: false
    },
    avatar: {

        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },

    },
    role: {
        type: String,
        default: 'user'
    },
    resertPasswordToken: String,
    resertPasswordExpire: Date,
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {

        next()

    }
    this.password = await bcrypt.hash(this.password, 10)
});

//JWT Token

userSchema.methods.getJWTtoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

//comapaire password
userSchema.methods.compairePassword = async function (enterComparePassword) {
    return await bcrypt.compare(enterComparePassword, this.password)
}

//genrating password reset token 
userSchema.methods.getresetPasswordToken = function () {

    //genrating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing and adding to resetpasword to schema;
    this.resertPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex');
    this.resertPasswordExpire = Date.now() + 15 * 60 * 100

    return resetToken
}





const User = mongoose.model("User", userSchema)

module.exports = User
