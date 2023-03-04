const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../models/userModels")

exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login to access",401))
    }
    const decodedDate = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decodedDate.id);
    next()
})

exports.authorizedRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
          return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403))
        }
        next();
    }
    
}