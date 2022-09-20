import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import router from './src/router/router'
import jwtMiddleware from './src/middleware/jwtMiddleware'
import mongoConfig from './src/config/mongoConfig'

dotenv.config()
const app = express()
const server = express()
const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'
const baseUri = process.env.BASEURI || ''
global.__basedir = __dirname

server.use(baseUri, app)

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))

mongoConfig().catch(err => console.log(err))

app.use(jwtMiddleware)

router(app)

app.use((req, res) => {
    if (!req.statusCode) req.statusCode = 500

    if (req.statusCode === 301) {
        return res.status(301).send({success:false})
    }
})

app.all('*', (req, res) => {
    res.statusCode = 404;
    res.json({ success: false, message: "Page Not Found"});
});

server.listen(port, host)
console.info('API running on port ', port)