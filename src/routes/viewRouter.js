import ProductManager from '../managers/productManager.js'
import express from 'express'

const router = express.Router()
const productManager = new ProductManager('products.json')

router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.render('home', { title: 'Produtos', products })
    } catch (err) {
        console.error(err)
        res.status(500).send('Erro ao carregar produtos.')
    }
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('realtimeproducts', { title: 'Produtos em tempo real' })
})

export default router