require('dotenv').config()
const app = require('./app')
const mongoose = require('mongoose')

let server;
const port = 3000

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, 
}).then(() => {
    console.log('Connected to MongoDB')
    server = app.listen(port, ()=> {
        console.log(`Connected to http://localhost:${port}`)
    })
})

const exitHandler = () => {
    if(server){
        server.close(()=> {
            console.log('Server closed')
            process.exit(1)
        })
    }else{
        process.exit(1)
    }
}

const unexpectedErrorHandler = (err) => {
    console.log(err)
    exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
    console.log('SIGTERM Receiver')
    if(server){
        server.close()
    }
})