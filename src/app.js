import express from "express"
import productsRouter from "./routes/productsRouter.js"

const app = express()

app.use(express.json())
app.use("/api/products", productsRouter)

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080")
})

// // import express from "express"
// import http from "http"

// // const app = express()

// const server = http.createServer((request, response) => {
//     response.setHeader('Content-Type', 'text/html; charset=utf-8')
//     response.end('Meu primeiro servidor!')
// })

// // app.use(express.json())

// // app.use("/data/products", productsRouter)
// // app.use("/api/carts", cartsRouter)

// server.listen(8080, () => {
//     console.log("Servidor rodando na porta 8080")
// })

// [
    // {
    //     "title": "Asus",
    //     "description": "notebook",
    //     "code": "Af15",
    //     "price": 1190,
    //     "status": true,
    //     "stock": 5,
    //     "category": "Portáteis",
    //     "thumbnails": "img/note.png"
    // },
//     {
//         "title": "Dell",
//         "description": "notebook",
//         "code": "Df05",
//         "price": 1060,
//         "status": true,
//         "stock": 7,
//         "category": "Portáteis",
//         "thumbnails": "img/note.png"
//     }
// ]