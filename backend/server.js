const app = require("./app");

const dotenv=require("dotenv");
const connectDatabase=require("./config/database");

// handling uncaught exceptions
process.on("uncaughtException",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down error due to uncaught error`);
    process.exit(1)
})

//connection
dotenv.config({path:"backend/config/config.env"});

connectDatabase();
const server = app.listen(process.env.PORT,()=>{
    console.log(`Sever is working on http://localhost:${process.env.PORT}`);
})

//unhandled promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down error due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})