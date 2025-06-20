import  ProductManager  from './managers/productManager.js'
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartsRouter.js'
import viewRouter from './routes/viewRouter.js'
import handlebars from 'express-handlebars'
import { connectDB } from '../config/db.js'
import session from 'express-session'
import { createServer } from "http"
import { fileURLToPath } from 'url'
import { Server } from "socket.io"
import { dirname } from 'path'
import express from 'express'
import path from 'path'

connectDB()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(session({
  secret: 'cartShop',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'lax' }
}))

app.use((req, res, next) => {
  console.log('Session cartId=', req.session.cartId)
  next()
})

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

//Handlebars setup
app.engine('handlebars', handlebars.engine({
    helpers: {
        multiply: (a, b) => (a * b).toFixed(2),
        calculateTotal: (products) => {
            const total = products.reduce((sum, p) => sum + p.quantity * p.product.price, 0)
            return total.toFixed(2)
        }
        // json: (context) => JSON.stringify(context, null, 2),
    }
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

//Export io to use in others files
app.set('io', io)

//My rote here
app.use('/api/products', productsRouter)
// app.use('/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/', viewRouter)

//Socket logic
const productManager = new ProductManager()

io.on('connection', async (socket) => {
    console.log('Novo cliente conectado via Websocket')

    //Send actual list
    const products = await productManager.getProducts()
    socket.emit('productsUpdated', products.docs)

    //Create new product
    socket.on('newProduct', async (data) => {
        try {
            await productManager.addProduct(data)
            const updated = await productManager.getProducts({})
            io.emit('productsUpdated', updated.docs)
        } catch (error) {
            console.log('Erro ao add produto via WebSocket', error)
        }
    })
})

//Start servidor
const PORT = 8080
httpServer.listen(PORT, () => {
    console.log("Servidor rodando na porta 8080")
})