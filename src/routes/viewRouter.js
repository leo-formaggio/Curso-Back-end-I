import ProductManager from '../managers/productManager.js'
import { Cart } from '../models/cart.js'
import { Router } from 'express'

const viewRouter = Router()

const productManager = new ProductManager()

viewRouter.get('/', (req, res) => {
    res.render('home', { title: 'Bem-vindo ao E-commerce' })
})

viewRouter.get('/products', async (req, res) => {
  try {
    const { limit = 5, page = 1, sort, query } = req.query
    const result = await productManager.getProducts({ limit, page, sort, query })

    res.render('products', {
        products: result.docs,
        pagination: {
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        currentPage: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
      }
    })
  } catch (error) {
    console.error('Erro ao carregar produtos na view:', error.message)
    res.status(500).send('Erro ao carregar produtos')
  }
})

viewRouter.get('/cart/:cid', async (req, res) => {
  try {
    const { cid } = req.session
    const cart = await Cart.findById(cid).populate('products.product').lean()

    res.render('cart', { cart })
  } catch(error) {
    console.error(error)
    res.status(500).send("Erro ao carregar o carrinho")
  }
})

viewRouter.get('/realtimeproducts', async (req, res) => {
  res.render('realtimeproducts')
})

export default viewRouter