import mongoosePaginate from 'mongoose-paginate-v2'
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
})

productSchema.plugin(mongoosePaginate)

export const Product = mongoose.model('Product', productSchema)