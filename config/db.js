import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://dbcoder:dbcoderhouse@test-login.3uyzj.mongodb.net/')
        console.log('Conectado ao MongoDB com sucesso!')
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB: ', error)
        process.exit(1)
    }
}