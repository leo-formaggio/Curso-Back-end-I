import { Product } from '../models/product.js'
export default class ProductManager {
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
            lean: true
        }

        const filters = query ? { category: query } : {}

        return await Product.paginate(filters, options)
    }

    async addProduct(product) {
        return await Product.create(product)
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id)
    }

    async getProductsById(id) {
        return await Product.findById(id)
    }
}