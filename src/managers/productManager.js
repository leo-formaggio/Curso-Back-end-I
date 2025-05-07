import fs from "fs/promises"
import path from "path"

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve('src', 'data', filePath)
        console.log('Caminho do arquivo:', this.filePath)
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.filePath, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            console.error('Erro ao ler os produtos:', error)
            throw new Error('Erro ao ler os produtos')
        }
    }

    async getProductsId(id) {
        const products = await this.getProducts()
        return products.find(p => p.id === parseInt(id))
    }

    async addProduct(product) {
        const products = await this.getProducts()
    
        // Geração de id simples com base no maior existente
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1
        const newProduct = { id: newId, ...product }
        products.push(newProduct)
    
        await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')

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

    await fs.writeFile(this.filePath, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
}

export default ProductManager