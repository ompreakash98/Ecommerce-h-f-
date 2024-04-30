const express=require('express');
const cors=require('cors')
const app=express();
const errorMiddleware=require("./middleware/error")
const users=require('./routes/userRoutes');
const order=require("./routes/orderRoute")
const cookieParser=require('cookie-parser')
app.use(cors());
app.use(express.json())
app.use(cookieParser());
// route import
const product=require('./routes/productRoute');
app.use('/api/v1',product);
app.use('/api/v1',users)
app.use('/api/v1',order)



//middleware for errro

app.use(errorMiddleware)
module.exports =app