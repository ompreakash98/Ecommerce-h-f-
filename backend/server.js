const app=require('./app');
const dotenv=require('dotenv')
const connectionDb=require('./config/database')
//handling uncautch exception
process.on("uncaughtException",(err)=>{
   console.log(`Error:${err.message}`) 
   console.log(`surting down the server due to unhandle promissage `)
   process.exit(1)
})

//config
// console.log(youtube)

dotenv.config({path:"backend/config/config.env"})
//connecting database 
connectionDb()

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})


//unhandle server rejection
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`)
    console.log(`surting down the server due to unhandle promissage `)
    server.close(()=>{
        process.exit(1)

    })
})