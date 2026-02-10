const app = require('./app')
const prisma = require('./prisma/client')

let server;
let port = 3000

if(prisma){
    console.log('Connected to database')
    server = app.listen(port, () => {
        console.log(`Running on http://localhost:${port}`)
    })
}

const exitHandler = () => {
    if(server){
        server.close(() => {
            console.log('Server Closed')
            process.exit(1)
        })
    }else{
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    console.log(error)
    exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
    console.log('SIGTERM Received')
    if(server){
        server.close()
    }
})