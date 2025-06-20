import ProductManager from '../managers/productManager.js'
import { Router } from 'express'
import { Product } from '../models/product.js'

const productsRouter = Router()
const productManager = new ProductManager()

productsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query

        const result = await productManager.getProducts({ limit, page, sort, query })

        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage, page: currentPage } = result

        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`

        res.json({
            status: 'success',
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `${baseUrl}?page=${prevPage}` : null,
            nextLink: hasNextPage ? `${baseUrl}?page=${nextPage}` : null
        })
    } catch (error) {
        console.error('Erro ao buscar produtos: ', error)
        res.status(500).json({ status: 'error', message: 'Erro ao buscar produtos' })
    }
})

productsRouter.get('/:pid', async (req, res) => {
  try {
    let { pid } = req.params

    const products = await Product.find(pid).lean()

    if (!products) {
      return res.status(404).json({ status: "Error", message: `Produto id: ${pid} não encontrado` })
    }

    res.json({ status: "success", payload: Product })
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message })
    console.error("Erro ao renderizar /products:", error)
  }
})

productsRouter.post('/', async (req, res) => {
  try {
    const { title, price, category } = req.body

    if (!title || !price) {
      return res.status(400).json({ status: 'error', message: 'Title e price são obrigatórios' })
    }

    const newProduct = await productManager.addProduct({ title, price, category })
    res.status(201).json({ status: 'success', payload: newProduct })
  } catch (error) {
    console.error(error.message)
    // res.status(500).json({ status: 'error', message: 'Erro interno do servidor' })
  }
})

export default productsRouter