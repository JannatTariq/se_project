const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErros = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken= require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

//Register a User
exports.registerUser = catchAsyncErros(async(req,res,next)=>{
    const {name,email,password}= req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"This is a sample id",
            url:"sampleUrl"
        }
    })
    sendToken(user,201,res)
})


//Login User
exports.loginUser =  catchAsyncErros(async(req,res,next)=>{

    const {email,password} = req.body
    // console.log(email, password)
    //checking if user has given email and password 
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",400))
    }
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",402))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",403))
    }
    sendToken(user,200,res)
})

//  Logout User
exports.logoutUser =  catchAsyncErros(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true, 
    })
    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
})

//Forward Password
exports.forgotPassword =  catchAsyncErros(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler("User not Found",404))
    }
    //Get Reset Password Token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false})

    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your Password Reset Token is: -\n\n ${resetPasswordURL} \n\n If you have not requested this email then please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject:`Opay Password Recovery`,
            message
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully.`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message,500))
    }
})

//Reset Password
exports.resetPassword =  catchAsyncErros(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("Reset Password Token is Invalid or has been expired",400))
    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400))
    }
    user.password=req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    //It will login the user by entering password
    sendToken(user,200,res);
});

//Get Product Details
exports.getUserDetails  =  catchAsyncErros(async(req,res,next)=>{
    const user= await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
})


//Update User Password
exports.updateUserPassword  =  catchAsyncErros(async(req,res,next)=>{
    const user= await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is Incorrect",400))
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400))
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
})

//Update Profile
exports.updateUserProfile  =  catchAsyncErros(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
    })
})

//Get All Users--Admin
exports.getAllUser  =  catchAsyncErros(async(req,res,next)=>{
    const user = await User.find();
    res.status(200).json({
        success:true,
        user
    })
})

//Get Single  Users--Admin
exports.getUser  =  catchAsyncErros(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id} `,400))
    }
    res.status(200).json({
        success:true,
        user
    })
})

//Update User Role--Admin
exports.updateUserRole  =  catchAsyncErros(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    if(!user)
    {
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id} `,400))
    }
    res.status(200).json({
        success:true,
        user
    })
})

//Delete User --Admin
exports.deleteUser  =  catchAsyncErros(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user)
    {
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id} `,400))
    }
    await user.remove();
    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
})

