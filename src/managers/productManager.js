import { fileURLToPath } from 'url'
import path from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export default class ProductManager {
    constructor(filename) {
        this.path = path.join(__dirname, '..', 'data', filename)
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            console.error('Erro ao ler os produtos:', error)
            
        }
    }

    async getProductsId(id) {
        const products = await this.getProducts()
        return products.find(p => p.id === parseInt(id))
    }

    async addProduct(product) {
        const products = await this.getProducts()
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1
        const newProduct = {
            id: newId,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            status: product.status,
            stock: product.stock,
            category: product.category
        }
    
        products.push(newProduct)
    
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')

        return newProduct
      }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2), "utf-8");

    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== parseInt(id));

    if (filtered.length === products.length) return false;

    await fs.promises.writeFile(this.path, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
}