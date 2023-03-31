//Call APIs which are created in routers
const express=require("express");
const app = express();
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./middleware/error")
const cors=require("cors")

app.use(express.json());
app.use(cookieParser());
const product=require("./routes/productRoute");
const user=require("./routes/userRoute");
app.use("/api/v1", cors(),product);
app.use("/api/v1",cors(), user);


//Middleware for error
app.use(errorMiddleware);

module.exports=app;