import  ProductManager  from './managers/productManager.js'
import productsRoutes from './routes/productsRouter.js'
import viewRoutes from './routes/viewRouter.js'
import { engine } from "express-handlebars"
import { createServer } from "http"
import { fileURLToPath } from 'url'
import { Server } from "socket.io"
import { dirname } from "path"
import express from "express"
import path from 'path'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

//Handlebars setup
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

//Export io to use in others files
app.set('io', io)

//My rote here
app.use('/api/products', productsRoutes)
app.use('/', viewRoutes)

//Socket logic
const productManager = new ProductManager('products.json')

io.on('connection', async (socket) => {
    console.log('Novo cliente conectado via Websocket')

    //Send actual list
    const products = await productManager.getProducts()
    socket.emit('productsUpdated', products)

    //Create new product
    socket.on('newProduct', async (data) => {
        console.log('Produto recebido no servidor:', data)
        await productManager.addProduct(data)
        const updated = await productManager.getProducts()
        io.emit('productsUpdated', updated)
    })
})

//Start servidor
const PORT = 8080
httpServer.listen(PORT, () => {
    console.log("Servidor rodando na porta 8080")
})