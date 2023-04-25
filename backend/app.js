//Call APIs which are created in routers
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");
// let whitelist = ['http://localhost:4000'];
// let corsOptions = {
//     origin: (origin, callback)=>{
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     credentials: true
// }
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   next();
// });
app.use(express.json());
app.use(cookieParser());


const product=require("./routes/productRoute");
const user=require("./routes/userRoute");
const order=require("./routes/orderRoute");
const category=require("./routes/categoryRoute");
const pendingProducts=require("./routes/pendingProductRoute");
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use('/api/categories', category);
app.use('/api/pending-products', pendingProducts);
//Middleware for error
app.use(errorMiddleware);

module.exports = app;
