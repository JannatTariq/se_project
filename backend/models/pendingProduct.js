const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Product Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product Price"],
        maxLength:[8,"Price cannot exceed 8 figures"]
    },
    images:[
        {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Please select a category"],
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product Stock"],
        maxLength:[4,"Stpck cannot exceed 4 characters"],
        default:1
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    }
    ,
  status: {
    type: String,
    enum: ["submitted", "approved", "rejected"],
    default: "submitted",
  },
  shippingAddress: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },

    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("PendingProduct",productSchema)