import { isValidObjectId } from 'mongoose'
import { Cart } from '../models/cart.js'
import { Router } from 'express'

const cartRouter = Router()

cartRouter.post('/', async (req, res) => {
  const newCartId = await Cart.create({ products: [] })
  res.send({ message: `Carrinho criado com Id: ${newCartId}` })
})

cartRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params
  if (!isValidObjectId(cid)) {
    return res.status(400).send({ error: "Id inválido!" })
  }

  const cart = await Cart.findById(cid).populate("products.product").lean()

  if (!cart) {
    return res.status(404).send({ error: "Carrinho não encontrado" })
  }

  cart = await Cart.populate(cart)

  res.send({ message: "Carrinho encontrado", cart })
})

cartRouter.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params
  
  if (!isValidObjectId(cid) || isValidObjectId(pid)) {
    return res.status(400).send({ error: "Id inválido!" })
  }

  const desiredCart = await Cart.findById(cid)
  if (!desiredCart) {
    return res.status(404).send({ error: "Carrinho não encontrado." })
  }

  const updatedCart = await addProductToCart(cid, pid, 1)

  if (!updatedCart) {
    return res.status(500).send({ error: "Erro ao adicionar produto ao carrinho" })
  }

  res.send({
    message: `Produto com Id ${pid} adicionado ao carrinho com Id ${cid} com sucesso!`,
  })

  await Cart.populate("products.product")
  res.json({ status: "success", payload: updatedCart })
})

cartRouter.post('/products/:pid', async (req, res) => {
  console.log("Recebido POST para adicionar produto:", req.params.pid)
  try {
    let { cid } = req.params
  
    if (!cid) {
      const newCart = await Cart.create({ products: [] })
      cid = newCart._id.toString()
      req.session.cartId = cid
    }
    
    console.log('Novo carrinho criado:', cid)
    const { pid } = req.params
    const cart = await Cart.findById(cid)
    console.log('Renderizando cart com:', cart)

    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrinho não encontrado" })
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid)
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1
    } else {
      cart.products.push({ product: pid, quantity: 1 })
    }
    await cart.save()

    res.json({ status: "success", payload: cart })
  } catch (error) {
    console.error("Erro ao adicionar produto ao carrinho:", error)
    res.status(500).json({ status: "error", message: "Erro interno do servidor" })
  }
})

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
        if (!cart) return res.status(404).json({ message: 'Carrinho não encontrado' })

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid)
        await cart.save()
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
})

cartRouter.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body
    const cart = await Cart.findById(req.params.cid)
    if (!cart) return res.status(404).json({ message: 'Carrinho não encontrado' })

    cart.products = products
    await cart.save()

    res.json({ status: 'success', message: 'Carrinho atualizado' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

cartRouter.put(':cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body
    const cart = await Cart.findById(req.params.cid)
    if (!cart) return res.status(404).json({ message: 'Carrinho não encontrado' })

    const productInCart = cart.products.find(p => p.product.toString() === req.params.pid)
    if (!productInCart) return res.status(404).json({ message: 'Produto não está no carrinho' })

    productInCart.quantity = quantity
    await cart.save()

    res.json({ status: 'success', message: 'Quantidade atualizada' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

cartRouter.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
    if (!cart) return res.status(404).json({ message: 'Carrinho não encontrado' })

    cart.products = []
    await cart.save()

    res.json({ status: 'success', message: 'Carrinho esvaziado' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default cartRouter