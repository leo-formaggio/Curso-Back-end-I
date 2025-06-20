import mongoosePaginate from 'mongoose-paginate-v2'
import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                required: true
            }
        }
    ]
})

cartSchema.plugin(mongoosePaginate)

export const Cart = mongoose.model('Cart', cartSchema)