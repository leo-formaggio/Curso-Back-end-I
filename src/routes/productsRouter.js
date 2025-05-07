import { Router } from "express"
import  ProductManager from "../managers/productManager.js"

const router = Router()

const productManager = new ProductManager("../data/products.json")

// Middleware de validação de dados
function validateProduct(req, res, next) {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body

    if (!title || !description || !code || 
        typeof price !== "number" || typeof status !== "boolean" || 
        typeof stock !== "number" || !category || !Array.isArray(thumbnails)) {
        return res.status(400).json({ error: "Dados inválidos ou incompletos para o produto" })
    }
    next()
}

// POST /api/products
router.post("/", validateProduct, async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body)
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erro ao adicionar produto", details: error.message })
    }
})

export default router
// router.get("/home", (req, res) => {
//     console.log("olá")
//     res.send("Olá!")
// })

// router.get("/products.json", (req, res) => {
//     res.status(200).send(products)
// })

// router.get("/products.json/:id", (req, res) => {
//     const {id} = req.params
//     const product = products.find(p => p.id === id)

//     if (product) {
//         res.status(200).json(product)
//     } else {
//         res.status(404).json({message: "Produto não encontrado"})
//     }
    
// })

// export default router