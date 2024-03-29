//All Functions of the product category
//Functions made in Controllers are called here

const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErros = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures")


//Post Create Product Admin
exports.createProduct = async (req, res, next) => {
    try {
        console.log(req);
      const { name, description, price, images, category, stock, user,shippingAddress } = req.body;
      const product = await Product.create({
        name,
        description,
        price,
        images,
        category,
        stock,
        user,  shippingAddress,
      });
      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

//Get All Products
exports.getAllProducts= catchAsyncErros(async(req,res,next)=>{
    const resultsPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultsPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success:true,
        products,
        productCount
    })
})

//Put Update Product Admin
exports.updateProduct = catchAsyncErros(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        product
    })
})


//Delete product
exports.deleteProduct = catchAsyncErros(async(req,res,next)=>{
    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    }
    
    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product Deleted"
    })
})

//Get Single Product 
exports.getProductDetails = catchAsyncErros(async(req,res,next)=>{
    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    }
    
    res.status(200).json({
        success:true,
        product
    })
})

//Create new Review or Update the Review
exports.createReview  =  catchAsyncErros(async(req,res,next)=>{
    const {rating,comment,productId} = req.body;
    const review = {
        user: req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };
    const product = await Product.findById(productId);

    //if user id matched again login id, you can change it or else new reviewed will be posted
    const isReviewed = product.reviews.find(rev=> rev.user.toString() == req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString() == req.user._id.toString()){
            rev.rating=rating,
            rev.comment=comment
            }
        })
    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg=0;
    product.reviews.forEach(rev=>{
        avg+=rev.rating
    })
    product.ratings = avg/product.reviews.length

    await product.save({
        validateBeforeSave:false
    })
    res.status(200).json({
        success:true,
    })

})

//Get all review of a product
exports.getAllReview  =  catchAsyncErros(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product has no reviews",400));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

//Delete review
exports.deleteReview  =  catchAsyncErros(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product has no reviews",400));
    }
    const reviews = product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString());
    let avg=0;
    reviews.forEach((rev)=>{
        avg+=rev.rating
    })
    const ratings = avg/reviews.length
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,ratings,numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
    })
})











// Sort products by price
exports.sortProductsByPrice = async (req, res) => {
  const { sortOrder } = req.query;

  try {
    const products = await Product.find()
      .sort({ price: sortOrder === 'asc' ? 1 : -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Sort products by ratings
exports.sortProductsByRatings = async (req, res) => {
  const { sortOrder } = req.query;

  try {
    const products = await Product.find()
      .sort({ ratings: sortOrder === 'asc' ? 1 : -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Filter products by price, shipping fee, and shipping time
exports.filterProducts = async (req, res) => {
  const { minPrice, maxPrice, shippingFee, shippingTime } = req.query;

  try {
    const products = await Product.find()
      .where('price').gte(minPrice).lte(maxPrice)
      .where('shippingFee').equals(shippingFee)
      .where('shippingTime').equals(shippingTime);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
